import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { Check, ChevronRight, UserCircle, Star, Shield, Heart, AlertTriangle } from 'lucide-react';

// Génération d'une liste de 16 avatars pour la grille
const AVATARS = Array.from({ length: 16 }, (_, i) => `/avatars/avatar-${i + 1}.png`);

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveAvatar = async () => {
    if (!selectedAvatar || !user) return;
    setIsSaving(true);
    setErrorMessage(null); 
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: selectedAvatar })
        .eq('id', user.id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Base de données verrouillée (RLS) : Impossible de mettre à jour le profil.");
      }
      
      setStep(2); 

    } catch (err: any) {
      console.error("Erreur complète lors de l'enregistrement :", err);
      setErrorMessage(err.message || "Erreur inconnue lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const finishOnboarding = async () => {
    await refreshProfile();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* PANNEAU LATÉRAL (Indicateur de progression) */}
        <div className="w-full md:w-1/3 bg-slate-900 p-10 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-4xl font-black text-[#00aeb7] mb-2 tracking-tighter">ELPI</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-16">La Maison de Suzie</p>
            
            <div className="space-y-10">
              <div className={`flex items-start gap-4 transition-all duration-500 ${step === 1 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                <div className={`p-3 rounded-2xl shadow-lg ${step === 1 ? 'bg-[#00aeb7] text-white' : 'bg-slate-800 text-slate-500'}`}>
                  <UserCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">1. Votre Identité</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Choisissez l'avatar qui vous représentera dans le Hub de formation.</p>
                </div>
              </div>
              <div className={`flex items-start gap-4 transition-all duration-500 ${step === 2 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                <div className={`p-3 rounded-2xl shadow-lg ${step === 2 ? 'bg-[#962588] text-white' : 'bg-slate-800 text-slate-500'}`}>
                  <Star size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">2. Bienvenue</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Découvrez votre nouvel espace interactif.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/50">
            <p className="text-[9px] text-slate-500 italic">Plateforme de formation immersive pour le personnel des EHPAD.</p>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="w-full md:w-2/3 p-10 md:p-16 flex flex-col justify-center relative bg-white">
          
          {/* ÉTAPE 1 : CHOIX DE L'AVATAR */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Choisissez votre Avatar</h2>
              <p className="text-sm text-slate-500 mb-8 font-medium">Cet avatar sera visible par vos formateurs et apparaîtra dans votre profil RH.</p>
              
              {/* ZONE D'ERREUR SI SUPABASE BLOQUE */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in shake">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-red-700 font-medium leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4 mb-10 max-h-[320px] overflow-y-auto custom-scrollbar p-2">
                {AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative aspect-square rounded-3xl border-4 overflow-hidden transition-all duration-300 transform ${selectedAvatar === avatar ? 'border-[#00aeb7] shadow-xl scale-105' : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:scale-105'}`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                       <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=elpi${idx}` }} />
                    </div>
                    {selectedAvatar === avatar && (
                      <div className="absolute inset-0 bg-[#00aeb7]/20 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-[#00aeb7] text-white p-2 rounded-full shadow-lg animate-in zoom-in duration-300">
                          <Check size={24} strokeWidth={4} />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSaveAvatar}
                  disabled={!selectedAvatar || isSaving}
                  className={`px-8 py-5 rounded-[1.5rem] font-black text-sm flex items-center gap-3 transition-all uppercase tracking-widest ${!selectedAvatar ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#00aeb7] text-white shadow-xl hover:bg-[#008c93] active:scale-95'}`}
                >
                  {isSaving ? 'Enregistrement...' : 'Valider mon avatar'}
                  {!isSaving && <ChevronRight size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : MESSAGE DE BIENVENUE */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col justify-center">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner border border-green-100">
                <Heart size={48} className="animate-pulse" />
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-6 tracking-tight">Bonjour {profile?.first_name || 'Apprenant'} !</h2>
              
              <div className="space-y-6 text-slate-600 mb-12 leading-relaxed">
                <p className="text-lg font-medium">
                  Nous sommes heureux de faire votre connaissance et nous vous souhaitons la bienvenue sur <strong className="text-[#00aeb7] font-black tracking-tighter text-xl">ELPI</strong>.
                </p>
                <p className="text-slate-500">
                  Nous vous proposons une expérience interactive inédite pour parfaire votre formation théorique. Vous allez bientôt explorer <strong className="text-[#962588]">La Maison de Suzie</strong> et mettre en pratique vos connaissances.
                </p>
                
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4 shadow-inner">
                  <Shield className="text-blue-500 shrink-0 mt-1" size={28} />
                  <p className="text-sm text-blue-900 font-medium leading-relaxed">
                    <strong className="block mb-2 text-blue-700 uppercase tracking-widest text-[10px] font-black">Action requise :</strong>
                    Lors de votre première visite, pensez impérativement à vérifier vos informations personnelles dans votre espace <span className="underline font-bold">Mon Compte / Profil</span>.
                  </p>
                </div>
              </div>
              
              <button
                onClick={finishOnboarding}
                className="w-full py-6 bg-[#00aeb7] text-white rounded-[2rem] font-black text-sm shadow-2xl hover:bg-[#008c93] transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
              >
                Entrer dans la Maison
                <ChevronRight size={24} className="animate-bounce" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};