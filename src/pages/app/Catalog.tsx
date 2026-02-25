import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { NavigationDock } from '../../components/layout/NavigationDock';
import { useAuth } from '../../features/auth/AuthContext';
import { BookOpen, ChevronRight, Loader2, Lock, CheckCircle } from 'lucide-react';

export const Catalog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    // 1. Récupère les inscriptions
    const { data: enrollmentData } = await supabase.from('enrollments').select('formation_id').eq('user_id', user?.id);
    const enrolledIds = enrollmentData?.map(e => e.formation_id) || [];

    if (enrolledIds.length === 0) {
      setCategories([]);
      setLoading(false);
      return;
    }

    // 2. Récupère les catégories + formations + tous les chapitres pour calculer le %
    const { data } = await supabase
      .from('categories')
      .select('*, formations!inner(*, contents(id))')
      .in('formations.id', enrolledIds)
      .order('name');
    
    // 3. Récupère les chapitres terminés
    const { data: progress } = await supabase.from('user_progress').select('content_id').eq('user_id', user?.id);
    
    if (data) setCategories(data);
    if (progress) setProgressData(progress.map(p => p.content_id));
    setLoading(false);
  };

  const getProgress = (formation: any) => {
    if (!formation.contents || formation.contents.length === 0) return 0;
    const completed = formation.contents.filter((c: any) => progressData.includes(c.id)).length;
    return Math.round((completed / formation.contents.length) * 100);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#00aeb7]" /></div>;

  return (
    <div className="min-h-screen bg-[#F0F7F8] pb-32 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#8B4513] mb-8">Mes Formations</h1>

        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-12">
            <Lock size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Aucune formation attribuée pour le moment.</p>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="mb-10">
              <h2 className="text-sm font-bold text-[#00aeb7] uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-[#00aeb7] rounded-full"></span> {cat.name}
              </h2>
              
              <div className="grid gap-4">
                {cat.formations?.map((f: any) => {
                  const percent = getProgress(f);
                  return (
                    <button 
                      key={f.id}
                      onClick={() => navigate(`/app/formation/${f.id}`)}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-white hover:shadow-md transition text-left group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl transition ${percent === 100 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'}`}>
                            {percent === 100 ? <CheckCircle size={24} /> : <BookOpen size={24} />}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{f.title}</h3>
                            <p className="text-xs text-slate-500">{f.contents?.length || 0} chapitres</p>
                          </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-[#00aeb7] transition" />
                      </div>
                      
                      {/* BARRE DE PROGRESSION */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${percent === 100 ? 'bg-green-500' : 'bg-[#00aeb7]'}`} style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Progression</span>
                        <span className="text-[10px] font-bold text-[#00aeb7]">{percent}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      <NavigationDock />
    </div>
  );
};