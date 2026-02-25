import { useEffect, useState } from 'react';
import { 
  Trophy, Zap, ShieldCheck, Sparkles, MessageCircle, 
  CheckCircle2, BookOpen, Loader2 
} from 'lucide-react';
import { NavigationDock } from '../../components/layout/NavigationDock';
import { useAuth } from '../../features/auth/AuthContext';
import { supabase } from '../../lib/supabase';

const colorMap: Record<string, { bg: string, border: string, text: string, iconBg: string }> = {
  blue: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', iconBg: 'bg-blue-100' },
  yellow: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', iconBg: 'bg-yellow-100' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700', iconBg: 'bg-purple-100' }
};

export const Ranking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ security: 0, hygiene: 0, communication: 0 });
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchRealProgression();
  }, [user]);

  const fetchRealProgression = async () => {
    setLoading(true);
    try {
      const { data: scores } = await supabase
        .from('game_scores')
        .select('score_security, score_hygiene, score_communication')
        .eq('user_id', user?.id);

      if (scores && scores.length > 0) {
        const totals = scores.reduce((acc, curr) => ({
          sec: acc.sec + (curr.score_security || 0),
          hyg: acc.hyg + (curr.score_hygiene || 0),
          com: acc.com + (curr.score_communication || 0)
        }), { sec: 0, hyg: 0, com: 0 });

        const count = scores.length;
        const getLevel = (val: number) => Math.min(4, Math.floor((val / count) / 20)); 

        setStats({
          security: getLevel(totals.sec),
          hygiene: getLevel(totals.hyg),
          communication: getLevel(totals.com)
        });
      }

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('formation_id, formations(title, contents(id))')
        .eq('user_id', user?.id);

      const { data: progress } = await supabase
        .from('user_progress')
        .select('content_id')
        .eq('user_id', user?.id);

      const completedIds = progress?.map(p => p.content_id) || [];

      if (enrollments) {
        const skillsData = enrollments.map((e: any) => {
          const totalChapters = e.formations?.contents?.length || 0;
          const completed = e.formations?.contents?.filter((c: any) => completedIds.includes(c.id)).length || 0;
          const percent = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0;
          return {
            name: e.formations?.title,
            score: percent,
            status: percent === 100 ? 'acquired' : percent > 0 ? 'progress' : 'review'
          };
        });
        setSkills(skillsData);
      }
    } catch (err) { console.error("Data error:", err); } 
    finally { setLoading(false); }
  };

  const badgeConfigs = [
    { title: "SÉCURITÉ", icon: <ShieldCheck className="w-6 h-6 text-blue-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: stats.security, color: "blue" },
    { title: "HYGIÈNE", icon: <Sparkles className="w-6 h-6 text-yellow-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: stats.hygiene, color: "yellow" },
    { title: "COMMUNICATION", icon: <MessageCircle className="w-6 h-6 text-purple-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: stats.communication, color: "purple" }
  ];

  if (loading) return <div className="h-screen flex flex-col items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 text-[#00aeb7] animate-spin mb-4" /><p className="text-slate-500 font-bold uppercase text-[10px]">Calcul des badges...</p></div>;

  return (
    <div className="h-screen bg-[#F0F4F8] font-sans overflow-hidden relative flex flex-col">
      <div className="w-full bg-white shadow-sm py-6 px-8 flex justify-between items-center z-10 shrink-0">
        <h2 className="text-2xl font-black text-[#962588] uppercase tracking-tighter flex items-center gap-2"><Trophy className="text-yellow-500" /> Mes Compétences</h2>
        <div className="flex gap-2"><span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="fill-current" /> Actif</span></div>
      </div>
      <div className="flex-grow w-full max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden mb-24">
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
           {badgeConfigs.map((badge, idx) => {
              const styles = colorMap[badge.color];
              return (
                <div key={idx} className="bg-white rounded-[2rem] shadow-sm border p-8 transition-all hover:shadow-md">
                  <div className="flex items-center gap-4 mb-6"><div className={`p-4 rounded-2xl ${styles.iconBg}`}>{badge.icon}</div><h3 className="font-black text-slate-800 text-lg uppercase tracking-widest">{badge.title}</h3></div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {badge.levels.map((level, i) => {
                      const isActive = i < badge.current;
                      return (
                        <div key={i} className={`flex flex-col items-center gap-2 ${isActive ? 'opacity-100' : 'opacity-20 grayscale'}`}><div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 ${isActive ? `${styles.bg} ${styles.border}` : 'bg-slate-50 border-slate-100'}`}>{i === 3 ? '👑' : i === 2 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div><span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{level}</span></div>
                      );
                    })}
                  </div>
                </div>
              );
           })}
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-xl border flex flex-col overflow-hidden">
          <div className="p-8 border-b bg-slate-50/50"><h4 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2"><BookOpen size={18} className="text-[#962588]" /> Suivi des Compétences</h4></div>
          <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-6">
            {skills.map((skill, idx) => (
              <div key={idx} className="border rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-3"><span className="font-black text-slate-700 uppercase text-xs tracking-tight">{skill.name}</span>{skill.status === 'acquired' ? <span className="text-[9px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Acquis</span> : <span className="text-[9px] font-black text-[#00aeb7] bg-blue-50 px-3 py-1 rounded-full uppercase">{skill.score}%</span>}</div>
                <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100"><div className={`h-full transition-all duration-1000 ${skill.status === 'acquired' ? 'bg-green-500' : 'bg-[#00aeb7]'}`} style={{width: `${skill.score}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NavigationDock />
    </div>
  );
};