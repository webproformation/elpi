import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

// Ajout anticipé du rôle "formateur" de notre Phase 4
type UserRole = 'student' | 'formateur' | 'admin' | 'super_admin';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  profile: any | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  role: null, 
  loading: true, 
  profile: null, 
  signOut: async () => {},
  refreshProfile: async () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction extraite pour récupérer le profil de manière isolée
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        return data; // On retourne la donnée au lieu de modifier le state directement
      }
    } catch (err) {
      console.error("Erreur profil:", err);
    }
    return null;
  };

  // Fonction exposée pour forcer le rafraîchissement (ex: après choix d'avatar)
  const refreshProfile = async () => {
    if (user) {
      console.log("🔄 Rechargement du profil...");
      const newProfile = await fetchProfile(user.id);
      setProfile(newProfile);
    }
  };

  useEffect(() => {
    let mounted = true;

    const timer = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⚠️ Délai d'attente Supabase dépassé : Démarrage forcé.");
        setLoading(false);
      }
    }, 3000);

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!error && session?.user && mounted) {
          // CHARGEMENT ATOMIQUE : On attend le profil AVANT de déclarer l'utilisateur
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
          setUser(session.user);
        }
      } catch (err) {
        console.error("Erreur init:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        // CHARGEMENT ATOMIQUE MÊME SUR CHANGEMENT D'ÉTAT
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 text-[#00aeb7] animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse tracking-widest uppercase text-[10px]">Vérification de votre identité...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role: profile?.role || 'student', loading, profile, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);