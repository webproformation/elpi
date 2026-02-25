import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ChevronRight, Loader2, AlertCircle, CheckCircle2, Lock, Mail, User } from 'lucide-react';

export const Auth = () => {
  const navigate = useNavigate();
  
  // État pour basculer entre Connexion et Inscription
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Messages d'erreur ou de succès
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        // --- LOGIQUE DE CONNEXION ---
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        if (error) throw error;
        
        // Si ça marche, on va vers l'app
        navigate('/app'); 
      } else {
        // --- LOGIQUE D'INSCRIPTION ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // On stocke le nom complet dans les métadonnées de l'utilisateur
            data: { name: fullName } 
          }
        });
        if (error) throw error;
        
        setSuccessMsg("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setIsLogin(true); // On rebascule sur l'écran de connexion
      }
    } catch (err: any) {
      // Gestion des messages d'erreur (traduction simple)
      let msg = err.message;
      if (msg === 'Invalid login credentials') msg = 'Email ou mot de passe incorrect.';
      if (msg.includes('already registered')) msg = 'Cet email est déjà utilisé.';
      if (msg.includes('Password should be')) msg = 'Le mot de passe doit faire au moins 6 caractères.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-white/50 relative overflow-hidden">
        
        {/* En-tête */}
        <div className="text-center mb-8 relative z-10">
          <img src="/logo-elpi.png" alt="ELPI" className="h-16 mx-auto mb-4 object-contain" />
          <h2 className="text-2xl font-extrabold text-[#962588]">
            {isLogin ? 'Bon retour parmi nous !' : 'Rejoindre l\'aventure'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Connectez-vous pour continuer votre formation.' : 'Créez votre espace apprenant.'}
          </p>
        </div>

        {/* Messages d'alerte */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm border border-green-100">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          
          {/* Champ Nom (Uniquement si Inscription) */}
          {!isLogin && (
             <div>
               <label className="block text-xs font-bold text-gray-700 mb-1 uppercase ml-1">Prénom & Nom</label>
               <div className="relative">
                 <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" required={!isLogin}
                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00aeb7] outline-none transition bg-gray-50 focus:bg-white"
                   value={fullName} onChange={(e) => setFullName(e.target.value)}
                   placeholder="Julie Dupont"
                 />
               </div>
             </div>
          )}

          {/* Champ Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="email" required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00aeb7] outline-none transition bg-gray-50 focus:bg-white"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="password" required minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00aeb7] outline-none transition bg-gray-50 focus:bg-white"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Bouton d'action */}
          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#00aeb7] to-[#008c93] hover:from-[#008c93] hover:to-[#007a80] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform hover:scale-[1.02] mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>{isLogin ? 'Se connecter' : 'Créer mon compte'} <ChevronRight /></>
            )}
          </button>
        </form>

        {/* Lien de bascule (Login <-> Inscription) */}
        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-[#962588] font-medium transition underline decoration-dotted"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire gratuitement" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};