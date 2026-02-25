import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { Medal, AlertTriangle, ArrowRight, BookOpen, ExternalLink, Info } from 'lucide-react';

export const GameResults = ({ scenario, finalScores, onFinish }: any) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(true);
  const [performance, setPerformance] = useState(0);
  const [dbError, setDbError] = useState<string | null>(null);

  const mechanic = scenario.mechanic || 'dialogue';
  const config = scenario.config_json || {};
  const errorsConfig = config.errors || [];

  useEffect(() => {
    const calculateAndSave = async () => {
      try {
        let maxPotential = 0;
        let minPotential = 0;

        // CALCUL DE PERFORMANCE ADAPTÉ À CHAQUE MÉCANIQUE
        if (mechanic === '360' || mechanic === 'error') {
          // Pour le 360 et la Vidéo, on somme les impacts des points configurés
          const points = mechanic === '360' ? config.hotspots : config.errors;
          (points || []).forEach((p: any) => {
            maxPotential += (p.impact?.security || 0) + (p.impact?.hygiene || 0) + (p.impact?.communication || 0);
          });
          minPotential = 0;
        } else {
          // Logique classique pour les dialogues (steps)
          const steps = config.steps || [];
          steps.forEach((step: any) => {
            if (step.choices && step.choices.length > 0) {
              const impacts = step.choices.map((c: any) => 
                (c.impact?.communication || 0) + (c.impact?.security || 0) + (c.impact?.hygiene || 0)
              );
              maxPotential += Math.max(...impacts);
              minPotential += Math.min(...impacts);
            }
          });
        }

        const totalObtained = (finalScores.security || 0) + (finalScores.hygiene || 0) + (finalScores.communication || 0);
        const range = maxPotential - minPotential;
        
        // Calcul du pourcentage final
        const resultPercent = range > 0 ? ((totalObtained - minPotential) / range) * 100 : 100;
        setPerformance(resultPercent);

        // SAUVEGARDE EN BASE DE DONNÉES
        if (user?.id) {
          const { error } = await supabase.from('game_scores').insert([{
            user_id: user.id,
            game_id: scenario.id,
            score: totalObtained,
            performance_percentage: resultPercent,
            score_security: finalScores.security || 0,
            score_hygiene: finalScores.hygiene || 0,
            score_communication: finalScores.communication || 0,
            completed_at: new Date().toISOString()
          }]);

          if (error) throw error;
        }
      } catch (err: any) {
        console.error("Erreur résultats:", err);
        setDbError(err.message);
      } finally {
        setSaving(false);
      }
    };
    calculateAndSave();
  }, [user, scenario, finalScores, mechanic]);

  const getBadge = () => {
    if (performance >= 90) return { label: 'Expert', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (performance >= 70) return { label: 'Confirmé', color: 'text-slate-400', bg: 'bg-slate-50' };
    return { label: 'Apprenti', color: 'text-orange-400', bg: 'bg-orange-50' };
  };

  const badge = getBadge();

  return (
    <div className="max-w-4xl w-full flex flex-col gap-8 animate-in zoom-in duration-500 font-sans px-4 pb-20">
      
      {/* CARTE DE SCORE PRINCIPALE */}
      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl text-center border-4 border-white relative overflow-hidden">
        {dbError ? (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 justify-center">
            <AlertTriangle /> Erreur de sauvegarde : {dbError}
          </div>
        ) : (
          <div className={`w-24 h-24 ${badge.bg} ${badge.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-white`}>
            <Medal size={48} />
          </div>
        )}
        
        <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Rang {badge.label}</h2>
        <p className="text-[#00aeb7] text-xs uppercase font-black tracking-[0.3em] mb-10">
          Précision pédagogique : {Math.round(performance)}%
        </p>

        <button 
          onClick={onFinish} 
          disabled={saving} 
          className="w-full max-w-sm mx-auto py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-black shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest disabled:opacity-50"
        >
          {saving ? 'Analyse des compétences...' : 'Valider mon badge'} <ArrowRight size={18} />
        </button>
      </div>

      {/* GALERIE DE RÉCAPITULATIF PÉDAGOGIQUE (Uniquement pour le jeu vidéo d'erreurs) */}
      {mechanic === 'error' && errorsConfig.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-[3.5rem] p-10 border border-white/20 space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center gap-4 text-white px-2">
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg">
              <Info size={24}/>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Correction de l'analyse</h3>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Comprendre les points critiques de la séquence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {errorsConfig.map((err: any) => (
              <div key={err.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-between border-2 border-transparent hover:border-orange-500 transition-all group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-orange-500 uppercase bg-orange-50 px-3 py-1 rounded-full tracking-widest">
                      Apparition à {Math.floor(err.startTime)}s
                    </span>
                    {err.contentId && (
                      <div className="text-[#00aeb7]">
                        <BookOpen size={20} />
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-slate-800 leading-tight uppercase tracking-tighter">
                    {err.title}
                  </h4>
                  <p className="text-slate-500 text-sm italic font-medium leading-relaxed">
                    "{err.explanation}"
                  </p>
                </div>

                {err.contentId && (
                  <button 
                    onClick={() => navigate(`/app/formation/${err.contentId}`)}
                    className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-[#E6F3F5] text-[#00aeb7] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00aeb7] hover:text-white transition-all shadow-inner"
                  >
                    Réviser la règle associée <ExternalLink size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};