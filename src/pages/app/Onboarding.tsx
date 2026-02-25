import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { Check, ChevronRight, UserCircle, Star, Shield, Heart, AlertTriangle } from 'lucide-react';

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
      if (!data || data.length === 0) throw new Error("Base de données verrouillée.");
      
      setStep(2); 
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de sauvegarde.");
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
        <div className="w-full md:w-1/3 bg-slate-900 p-10 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-4xl font-black text-[#00aeb7] mb-2 tracking-tighter">ELPI</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-16">La Maison de Suzie</p>
            <div className="space-y-10">
              <div className={`flex items-start gap-4 transition-all duration-500 ${step === 1 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                <div className={`p-3 rounded-2xl shadow-lg ${step === 1 ? 'bg-[#00aeb7] text-white' : 'bg-slate-800 text-slate-500'}`}><UserCircle size={24} /></div>
                <div><h3 className="font-bold text-white mb-1">1. Votre Identité</h3><p className="text-[10px] text-slate-400 leading-relaxed">Choisissez l'avatar du Hub.</p></div>
              </div>
              <div className={`flex items-start gap-4 transition-all duration-500 ${step === 2 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                <div className={`p-3 rounded-2xl shadow-lg ${step === 2 ? 'bg-[#962588] text-white' : 'bg-slate-800 text-slate-500'}`}><Star size={24} /></div>
                <div><h3 className="font-bold text-white mb-1">2. Bienvenue</h3><p className="text-[10px] text-slate-400 leading-relaxed">Découvrez votre espace interactif.</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-10 md:p-16 flex flex-col justify-center relative bg-white">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Choisissez votre Avatar</h2>
              {errorMessage && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-start gap-3"><AlertTriangle size={20} /><p className="text-xs font-medium">{errorMessage}</p></div>}
              <div className="grid grid-cols-4 gap-4 mb-10 max-h-[320px] overflow-y-auto p-2">
                {AVATARS.map((avatar, idx) => (
                  <button key={idx} onClick={() => setSelectedAvatar(avatar)} className={`relative aspect-square rounded-3xl border-4 overflow-hidden transform ${selectedAvatar === avatar ? 'border-[#00aeb7] scale-105' : 'border-transparent bg-slate-50'}`}>
                    <img src={avatar} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=elpi${idx}` }} />
                    {selectedAvatar === avatar && <div className="absolute inset-0 bg-[#00aeb7]/20 flex items-center justify-center"><Check size={24} className="bg-[#00aeb7] text-white p-1 rounded-full" /></div>}
                  </button>
                ))}
              </div>
              <div className="flex justify-end"><button onClick={handleSaveAvatar} disabled={!selectedAvatar || isSaving} className={`px-8 py-5 rounded-[1.5rem] font-black text-sm flex items-center gap-3 transition-all ${!selectedAvatar ? 'bg-slate-100 text-slate-400' : 'bg-[#00aeb7] text-white shadow-xl hover:bg-[#008c93]'}`}>{isSaving ? 'Enregistrement...' : 'Valider'} <ChevronRight size={20} /></button></div>
            </div>
          )}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col justify-center">
              <Heart size={48} className="text-green-500 mb-8 animate-pulse" />
              <h2 className="text-4xl font-black text-slate-800 mb-6">Bonjour {profile?.first_name || 'Apprenant'} !</h2>
              <div className="space-y-6 text-slate-600 mb-12">
                <p className="text-lg font-medium">Bienvenue sur <strong className="text-[#00aeb7]">ELPI</strong>.</p>
                <div className="p-6 bg-blue-50 border rounded-3xl flex items-start gap-4 shadow-inner"><Shield className="text-blue-500 mt-1" size={28} /><p className="text-sm text-blue-900">Vérifiez impérativement vos informations dans <span className="underline font-bold">Mon Compte / Profil</span>.</p></div>
              </div>
              <button onClick={finishOnboarding} className="w-full py-6 bg-[#00aeb7] text-white rounded-[2rem] font-black text-sm shadow-2xl">Entrer dans la Maison <ChevronRight size={24} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};