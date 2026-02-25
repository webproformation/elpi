import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, PartyPopper, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/AuthContext';
import { GameMechanicSelector } from '../GameMechanicSelector';

export const SalonGame = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState<any>(null);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    if (user) loadRandomScenario();
  }, [user]);

  const loadRandomScenario = async () => {
    setLoading(true);
    const { data: configs } = await supabase.from('game_configs').select('*').eq('game_type', 'salon');
    const { data: scores } = await supabase.from('game_scores').select('game_id').eq('user_id', user?.id);
    const playedIds = scores?.map(s => s.game_id) || [];
    const unplayed = configs?.filter(c => !playedIds.includes(c.id)) || [];

    if (unplayed.length === 0) setAllCompleted(true);
    else setScenario(unplayed[Math.floor(Math.random() * unplayed.length)]);
    setLoading(false);
  };

  if (loading) return (
    <div className="h-screen bg-[#E6F3F5] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#00aeb7] w-12 h-12" />
    </div>
  );

  if (allCompleted) {
    return (
      <div className="h-screen bg-[#E6F3F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-lg text-center border-4 border-white">
          <PartyPopper size={48} className="text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-800 mb-4">Félicitations !</h2>
          <p className="text-slate-500 mb-8 font-medium">Vous avez terminé tous les scénarios du Salon.</p>
          <button onClick={() => navigate('/app')} className="w-full py-5 bg-[#00aeb7] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> Retour Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-y-auto">
      {scenario && (
        <GameMechanicSelector 
          scenario={scenario} 
          onClose={() => navigate('/app')} 
        />
      )}
    </div>
  );
};