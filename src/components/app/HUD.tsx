import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { Shield, Droplets, MessageCircle, Award, Loader2, LayoutDashboard } from 'lucide-react';

export const HUD = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ security: 0, hygiene: 0, communication: 0 });
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  useEffect(() => {
    const fetchRealStats = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('game_scores')
        .select('score_security, score_hygiene, score_communication')
        .eq('user_id', user.id);

      if (!error && data && data.length > 0) {
        const totals = data.reduce((acc, curr) => ({
          sec: acc.sec + (curr.score_security || 0),
          hyg: acc.hyg + (curr.score_hygiene || 0),
          com: acc.com + (curr.score_communication || 0)
        }), { sec: 0, hyg: 0, com: 0 });

        const count = data.length;
        const normalize = (val: number) => Math.min(100, Math.max(0, (val / count) * 5)); 

        setStats({
          security: normalize(totals.sec),
          hygiene: normalize(totals.hyg),
          communication: normalize(totals.com)
        });
      }
      setLoading(false);
    };

    fetchRealStats();
  }, [user]);

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
      
      <div className="flex items-center gap-3">
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin')}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/50 text-[#962588] hover:bg-[#962588] hover:text-white transition-all group flex items-center gap-2"
            title="Administration"
          >
            <LayoutDashboard size={20} className="transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Admin</span>
          </button>
        )}

        <div className="relative group cursor-help">
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-50 relative z-10">
            <img src={profile?.avatar_url || '/icone-perso.png'} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-1.5 rounded-full border-2 border-white shadow-md z-20 animate-bounce">
            <Award size={18} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-[2rem] shadow-xl border border-white/50 w-52 space-y-4">
        <h4 className="text-[10px] font-black text-[#00aeb7] uppercase tracking-[0.2em] text-center border-b border-slate-100 pb-3">
          Mes Compétences
        </h4>
        
        {loading ? (
          <div className="py-4 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={20}/></div>
        ) : (
          <>
            <SkillBar icon={<Shield size={14} />} color="bg-blue-500" value={stats.security} label="Sécurité" />
            <SkillBar icon={<Droplets size={14} />} color="bg-green-500" value={stats.hygiene} label="Hygiène" />
            <SkillBar icon={<MessageCircle size={14} />} color="bg-purple-500" value={stats.communication} label="Dialogue" />
          </>
        )}
      </div>
    </div>
  );
};

const SkillBar = ({ icon, color, value, label }: any) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
      <span className="flex items-center gap-2">{icon} {label}</span>
      <span className="text-[11px] text-slate-800">{Math.round(value)}%</span>
    </div>
    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out shadow-sm`} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);