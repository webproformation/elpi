import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 text-[#00aeb7] animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse tracking-widest uppercase text-xs">Vérification de vos accès...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const avatar = profile?.avatar_url;
  
  const isFirstLogin = 
    !avatar || 
    avatar.trim() === '' || 
    avatar.includes('default') || 
    avatar === '/icone-perso.png';

  const isOnboardingRoute = location.pathname.includes('/app/onboarding');
  const isAdminRoute = location.pathname.includes('/admin');
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  if (isFirstLogin && !isOnboardingRoute && !isAdmin) {
    return <Navigate to="/app/onboarding" replace />;
  }

  if (!isFirstLogin && isOnboardingRoute) {
    return <Navigate to="/app" replace />;
  }

  if (!isAdmin && isAdminRoute) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};