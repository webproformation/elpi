import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Save, BookOpen, Trophy, Star, User as UserIcon, Loader2 } from 'lucide-react';
import { NavigationDock } from '../../components/layout/NavigationDock';
import { useAuth } from '../../features/auth/AuthContext';
import { supabase } from '../../lib/supabase';

const AVATAR_OPTIONS = [
  '/01.png', '/02.png', '/03.png', '/04.png', '/05.png', '/06.png', '/07.png', '/08.png',
  '/11.png', '/12.png', '/13.png', '/14.png', '/15.png', '/16.png', '/17.png', '/18.png'
];

export const Profile = () => {
  const navigate = useNavigate();
  const { signOut, profile, user, refreshProfile } = useAuth();
  
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone: '', address: '' });
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [badges, setBadges] = useState<any[]>([]);
  const [stats, setStats] = useState({ formations: 0, finished: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
      setSelectedAvatar(profile.avatar_url || '');
      fetchStats();
    }
  }, [profile]);

  const fetchStats = async () => {
    if (!user) return;
    const { data: b } = await supabase.from('user_badges').select('badges(*)').eq('user_id', user.id);
    const { data: enrolls } = await supabase.from('enrollments').select('id').eq('user_id', user.id);
    const { data: progress } = await supabase.from('user_progress').select('id').eq('user_id', user.id);

    setBadges(b?.map(item => item.badges) || []);
    setStats({ formations: enrolls?.length || 0, finished: progress?.length || 0 });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      ...formData,
      avatar_url: selectedAvatar,
      full_name: `${formData.first_name} ${formData.last_name}`.trim()
    }).eq('id', user.id);

    if (!error) {
      await refreshProfile();
      alert("Profil et Avatar enregistrés !");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="h-screen bg-[#F0F4F8] font-sans overflow-hidden relative flex flex-col">
      <div className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10 shrink-0">
        <h2 className="text-2xl font-extrabold text-[#962588] flex items-center gap-2"><Settings className="w-6 h-6" /> Mon Compte</h2>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition"><LogOut size={16}/> Déconnexion</button>
      </div>

      <div className="flex-grow w-full max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden mb-24">
        <div className="md:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-[#00aeb7] to-[#962588] opacity-10"></div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full p-1 bg-white shadow-lg overflow-hidden flex items-center justify-center">
                {selectedAvatar ? <img src={selectedAvatar} className="w-full h-full object-cover" /> : <UserIcon className="w-10 h-10 text-gray-300" />}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-2">{formData.first_name || 'Apprenant'}</h3>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><div className="text-xl font-black text-[#00aeb7]">{stats.formations}</div><div className="text-[9px] uppercase font-bold text-slate-400">Inscrit</div></div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><div className="text-xl font-black text-green-500">{stats.finished}</div><div className="text-[9px] uppercase font-bold text-slate-400">Terminé</div></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-white">
            <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4 flex items-center gap-2"><Trophy size={16} className="text-orange-400"/> Certifications</h4>
            <div className="grid grid-cols-2 gap-3">
              {badges.map(b => (
                <div key={b?.id} className="flex flex-col items-center p-2 bg-slate-50 rounded-xl border text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white mb-1"><Star size={18} fill="white"/></div>
                  <span className="text-[9px] font-black text-slate-700 uppercase">{b?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg border flex flex-col overflow-hidden">
           <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
             <h4 className="text-lg font-bold text-gray-700 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#00aeb7]" /> Informations RH</h4>
             <button onClick={handleSave} disabled={saving} className="bg-[#962588] text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md">
               {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} Enregistrer
             </button>
           </div>
           <div className="p-6 overflow-y-auto space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block mb-3">Choisir mon Avatar</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {AVATAR_OPTIONS.map((url) => (
                    <button key={url} onClick={() => setSelectedAvatar(url)} className={`aspect-square rounded-full border-4 overflow-hidden transform hover:scale-110 ${selectedAvatar === url ? 'border-[#00aeb7] ring-4 ring-[#00aeb7]/20 shadow-lg' : 'border-slate-100'}`}><img src={url} className="w-full h-full object-cover" /></button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Prénom" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" />
                <input type="text" placeholder="Nom" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" />
              </div>
              <input type="tel" placeholder="Téléphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none" />
              <textarea placeholder="Adresse postale" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 outline-none h-24" />
           </div>
        </div>
      </div>
      <NavigationDock />
    </div>
  );
};