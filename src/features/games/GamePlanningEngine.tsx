import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  GripVertical, 
  CheckCircle2, 
  ArrowRight, 
  Clock,
  ClipboardList,
  Zap,
  FolderHeart,
  X,
  HeartPulse,
  Pill,
  Utensils,
  Loader2
} from 'lucide-react';
import { GameResults } from './GameResults';

export const GamePlanningEngine = ({ scenario, onClose }: any) => {
  const config = scenario?.config_json || {};
  const initialTasks = config.tasks || [];
  const incidents = config.incidents || [];
  const characterIds = config.characterIds || [];
  
  // Mapping des images de fond par pièce
  const roomBackgrounds: Record<string, string> = {
    'salon': '/salon.png',
    'cuisine': '/cuisine.png',
    'chambre': '/chambre.png',
    'salle de bain': '/sdb.png'
  };

  // On récupère l'image selon la pièce (game_type)
  const bgImage = roomBackgrounds[scenario.game_type?.toLowerCase()] || '/salon.png';

  const [todoList, setTodoList] = useState([...initialTasks]);
  const [completedCount, setCompletedCount] = useState(0);
  const [activeIncident, setActiveIncident] = useState<any>(null);
  const [scores, setScores] = useState({ security: 0, hygiene: 0, communication: 0 });
  const [showResults, setShowResults] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [showDossier, setShowDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      if (characterIds.length === 0) { setLoading(false); return; }
      const { data } = await supabase.from('game_characters').select('*').in('id', characterIds);
      if (data) setPatients(data);
      setLoading(false);
    };
    loadPatients();
  }, [characterIds]);

  useEffect(() => {
    const incidentToTrigger = incidents.find((inc: any) => inc.triggerAfterSteps === completedCount);
    if (incidentToTrigger && !activeIncident) {
      setActiveIncident(incidentToTrigger);
    }
  }, [completedCount, incidents, activeIncident]);

  const handleTaskAction = (task: any) => {
    setScores(prev => ({
      security: prev.security + (task.impact?.security || 0),
      hygiene: prev.hygiene + (task.impact?.hygiene || 0),
      communication: prev.communication + (task.impact?.communication || 0),
    }));
    setCompletedCount(prev => prev + 1);
    setTodoList(prev => prev.filter(t => t.id !== task.id));
  };

  if (showResults) return <GameResults scenario={scenario} finalScores={scores} onFinish={onClose} />;
  if (loading) return <div className="flex flex-col items-center p-20"><Loader2 className="animate-spin text-[#00aeb7] w-12 h-12" /></div>;

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
      
      {/* IMAGE DE FOND DYNAMIQUE */}
      <div className="fixed inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover" alt="Décor" />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      </div>

      {/* CONTENU DU JEU (AU-DESSUS) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6 flex flex-col gap-6">
        
        {/* HUD */}
        <div className="flex justify-between items-center bg-white/20 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/30 shadow-2xl">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-[#962588] p-3 rounded-2xl shadow-lg"><ClipboardList size={24}/></div>
            <div>
              <h2 className="font-black uppercase tracking-tighter text-lg leading-none">{scenario.title}</h2>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Lieu : {scenario.game_type}</p>
            </div>
          </div>
          <div className="bg-white/20 px-6 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-3 border border-white/20">
            <Clock size={18} className="text-[#00aeb7]" /> {completedCount} / {initialTasks.length}
          </div>
        </div>

        {/* DOSSIERS RÉSIDENTS */}
        <div className="flex flex-wrap gap-4">
          {patients.map(p => (
            <button key={p.id} onClick={() => setShowDossier(p)} className="bg-white/90 backdrop-blur-md p-2 pr-6 rounded-full shadow-lg flex items-center gap-3 border-2 border-transparent hover:border-[#00aeb7] transition-all group active:scale-95">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00aeb7]/20"><img src={p.assets?.neutral || '/icone-perso.png'} className="w-full h-full object-cover" /></div>
              <div className="text-left">
                <div className="text-[10px] font-black text-slate-800 uppercase leading-none">{p.first_name}</div>
                <div className="text-[8px] font-bold text-[#00aeb7] uppercase tracking-widest mt-0.5">Dossier de soin</div>
              </div>
            </button>
          ))}
        </div>

        {/* LISTE DES TÂCHES */}
        <div className="grid gap-4 mt-4">
          {todoList.length > 0 ? todoList.map((task, index) => (
            <div key={task.id} className="bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white flex items-center gap-6 group hover:border-[#00aeb7] transition-all animate-in slide-in-from-bottom-4">
              <div className="bg-slate-50 p-4 rounded-3xl text-slate-300 group-hover:text-[#00aeb7] transition-colors"><GripVertical size={24} /></div>
              <div className="flex-1">
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{task.label}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Action planifiée</p>
              </div>
              <button onClick={() => handleTaskAction(task)} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#00aeb7] transition-all shadow-lg flex items-center gap-2 border-b-4 border-black active:border-b-0 active:translate-y-1">Effectuer <CheckCircle2 size={18} /></button>
            </div>
          )) : (
            <div className="bg-white p-20 rounded-[4rem] text-center space-y-8 shadow-2xl border-8 border-white">
               <div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-white"><CheckCircle2 size={64} /></div>
               <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic">Mission terminée</h3>
               <button onClick={() => setShowResults(true)} className="w-full max-w-sm mx-auto py-6 bg-[#00aeb7] text-white rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all">Bilan ELPI <ArrowRight size={20} /></button>
            </div>
          )}
        </div>
      </div>

      {/* POPUP DOSSIER (TRICHE PORTAL NON NÉCESSAIRE ICI CAR ON EST DANS LE MOTEUR) */}
      {showDossier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border-4 border-white flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-md"><img src={showDossier.assets?.neutral || '/icone-perso.png'} className="w-full h-full object-cover" /></div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{showDossier.first_name}</h3>
              </div>
              <button onClick={() => setShowDossier(null)} className="p-3 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <ClinicalSection title="Pathologies" content={showDossier.medical_history} color="text-red-500" />
              <ClinicalSection title="Traitements" content={showDossier.medications} color="text-blue-500" />
              <ClinicalSection title="Nutrition" content={showDossier.dietary_info} color="text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* INCIDENT POPUP */}
      {activeIncident && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-lg">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 border-8 border-purple-100 shadow-2xl text-center space-y-8 animate-in zoom-in">
            <div className="w-24 h-24 bg-purple-50 text-[#962588] rounded-full flex items-center justify-center mx-auto shadow-inner"><Zap size={48} fill="currentColor" /></div>
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">ALERTE : {activeIncident.label}</h3>
            <p className="text-slate-500 font-medium italic text-lg leading-relaxed">"{activeIncident.description}"</p>
            <button onClick={() => setActiveIncident(null)} className="w-full py-6 bg-[#962588] text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">Prendre en charge</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ClinicalSection = ({ title, content, color }: any) => (
  <section className="space-y-2">
    <h4 className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</h4>
    <p className="bg-slate-50 p-6 rounded-3xl text-slate-600 font-medium italic border border-slate-100">{content || "Non renseigné."}</p>
  </section>
);