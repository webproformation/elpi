import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // 1. Écran de chargement pendant la vérification du profil
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 text-[#00aeb7] animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse tracking-widest uppercase text-xs">Vérification de vos accès...</p>
      </div>
    );
  }

  // 2. S'il n'y a pas d'utilisateur connecté, on renvoie à la page de connexion
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. VÉRIFICATION BLINDÉE DE L'AVATAR (Le cœur du correctif)
  const avatar = profile?.avatar_url;
  
  // On considère que c'est une première connexion si :
  // - avatar est null ou undefined (!avatar)
  // - avatar est une chaîne vide (trim() === '')
  // - avatar contient le mot 'default' ou le nom de votre icône de base
  const isFirstLogin = 
    !avatar || 
    avatar.trim() === '' || 
    avatar.includes('default') || 
    avatar === '/icone-perso.png';

  const isOnboardingRoute = location.pathname.includes('/app/onboarding');
  const isAdminRoute = location.pathname.includes('/admin');
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  // 4. LOGIQUE DE REDIRECTION STRICTE
  
  // RÈGLE A : Si première connexion + Apprenant + N'est pas déjà sur l'onboarding -> FORCER ONBOARDING
  if (isFirstLogin && !isOnboardingRoute && !isAdmin) {
    console.log("👉 Redirection forcée vers l'Onboarding. Avatar actuel détecté :", avatar);
    return <Navigate to="/app/onboarding" replace />;
  }

  // RÈGLE B : S'il a déjà fait l'onboarding et tente de forcer l'URL /app/onboarding -> RETOUR AU HUB
  if (!isFirstLogin && isOnboardingRoute) {
    return <Navigate to="/app" replace />;
  }

  // RÈGLE C : Si un apprenant tente d'aller sur l'admin -> RETOUR AU HUB
  if (!isAdmin && isAdminRoute) {
    return <Navigate to="/app" replace />;
  }

  // 5. Si tout est validé, on laisse passer
  return <Outlet />;
};