import React from 'react';
import { Star, Trophy } from 'lucide-react';

interface ResultsModalProps {
  user: any;
  stats: { scores: any[], progress: any[], badges: any[] };
  onClose: () => void;
}

export const ResultsModal = ({ user, stats, onClose }: ResultsModalProps) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-8 text-slate-800">Parcours de {user?.first_name}</h2>
        <div className="space-y-10">
          <div>
            <h3 className="text-xs font-black uppercase text-[#962588] tracking-widest mb-6 border-b pb-2 flex items-center gap-2"><Star size={14}/> Certifications (Badges)</h3>
            <div className="flex flex-wrap gap-4">
              {stats.badges.length > 0 ? stats.badges.map((b: any) => (
                <div key={b.id} className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg uppercase shadow-sm">{b.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-black text-purple-900 leading-tight uppercase">{b.name}</p>
                    <p className="text-[10px] text-purple-600 uppercase font-bold">{b.category}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-400 italic">Aucune compétence certifiée pour le moment.</p>}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-[#00aeb7] tracking-widest mb-6 border-b pb-2 flex items-center gap-2"><Trophy size={14}/> Records Mini-jeux</h3>
            <div className="grid grid-cols-2 gap-4">
              {['cuisine', 'salon', 'sdb', 'chambre'].map(game => {
                const best = Math.max(0, ...stats.scores.filter((s: any) => s.game_id === game).map((s: any) => s.score));
                return (
                  <div key={game} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600 capitalize">{game}</span>
                    <span className="text-sm font-black text-[#00aeb7]">{best} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-full mt-12 py-5 bg-[#00aeb7] text-white rounded-[1.5rem] font-bold shadow-xl">Fermer</button>
      </div>
    </div>
  );
};