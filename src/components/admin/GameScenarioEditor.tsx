import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Shield, Droplets, MessageCircle, AlertCircle } from 'lucide-react';

export const GameScenarioEditor = ({ config, onSave, onDelete }: { config: any, onSave: (data: any) => void, onDelete: (id: string) => void }) => {
  // États locaux pour le titre et les étapes
  const [title, setTitle] = useState(config?.title || "");
  const [steps, setSteps] = useState<any[]>(config?.config_json?.steps || []);

  // IMPORTANT : Synchronisation quand on change de scénario
  useEffect(() => {
    if (config) {
      setTitle(config.title || "");
      setSteps(config.config_json?.steps || []);
    }
  }, [config]);

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, speaker: "", emotion: "neutral", text: "", choices: [] }]);
  };

  const updateStep = (id: number, field: string, value: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addChoice = (stepId: number) => {
    setSteps(steps.map(s => s.id === stepId ? {
      ...s, choices: [...(s.choices || []), { text: "", next: 0, impact: { communication: 0, hygiene: 0, security: 0 } }]
    } : s));
  };

  const updateChoice = (stepId: number, cIdx: number, field: string, value: any) => {
    setSteps(steps.map(s => {
      if (s.id === stepId) {
        const newChoices = [...s.choices];
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          newChoices[cIdx][parent] = { ...newChoices[cIdx][parent], [child]: parseInt(value) || 0 };
        } else {
          newChoices[cIdx][field] = value;
        }
        return { ...s, choices: newChoices };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-sans">
      
      {/* HEADER : TITRE ÉDITABLE & SUPPRESSION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 gap-4">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Titre du Scénario</label>
          <input 
            type="text" 
            className="text-2xl font-black text-slate-800 bg-slate-50 border-none rounded-2xl w-full p-4 focus:ring-2 focus:ring-[#00aeb7] outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Le refus de soin de Bernard"
          />
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => { if(confirm("Supprimer définitivement ce scénario ?")) onDelete(config.id); }}
                className="bg-red-50 text-red-500 px-6 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-red-100 transition-all uppercase tracking-widest"
            >
                <Trash2 size={18} /> Supprimer
            </button>
            <button onClick={addStep} className="bg-[#00aeb7] text-white px-6 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg hover:bg-[#008c93] transition-all uppercase tracking-widest">
                <Plus size={18} /> Nouvelle Étape
            </button>
        </div>
      </div>

      {/* LISTE DES ÉTAPES */}
      <div className="space-y-6">
        {steps.length === 0 && (
            <div className="bg-blue-50 border-2 border-dashed border-blue-100 rounded-[2rem] p-12 text-center">
                <AlertCircle className="mx-auto text-blue-400 mb-4" size={48} />
                <p className="text-blue-900 font-bold">Ce scénario est vide.</p>
                <p className="text-blue-600 text-sm">Cliquez sur "Nouvelle Étape" pour commencer la rédaction.</p>
            </div>
        )}
        
        {steps.map((step) => (
          <div key={step.id} className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Étape #{step.id}</span>
              <button onClick={() => setSteps(steps.filter(s => s.id !== step.id))} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={20} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Interlocuteur</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#00aeb7]" value={step.speaker} onChange={(e) => updateStep(step.id, 'speaker', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Émotion</label>
                <select className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#00aeb7]" value={step.emotion} onChange={(e) => updateStep(step.id, 'emotion', e.target.value)}>
                  <option value="happy">Heureux 😊</option>
                  <option value="confused">Dubitatif 🤔</option>
                  <option value="angry">Agressif 😠</option>
                  <option value="sad">Triste 😢</option>
                  <option value="neutral">Neutre 😐</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Texte du dialogue</label>
              <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm h-24 focus:ring-2 focus:ring-[#00aeb7] resize-none italic" value={step.text} onChange={(e) => updateStep(step.id, 'text', e.target.value)} />
            </div>
            
            <div className="space-y-4 border-t border-slate-50 pt-6">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Choix de l'apprenant</h4>
                <button onClick={() => addChoice(step.id)} className="text-[#00aeb7] text-[10px] font-black hover:underline uppercase tracking-widest">+ Ajouter choix</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {step.choices?.map((choice: any, cIdx: number) => (
                  <div key={cIdx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Texte du bouton..." className="flex-1 p-3 bg-white border-none rounded-xl text-xs font-medium shadow-sm" value={choice.text} onChange={(e) => updateChoice(step.id, cIdx, 'text', e.target.value)} />
                      <input type="number" placeholder="Vers ID" className="w-20 p-3 bg-white border-none rounded-xl text-xs font-black text-center shadow-sm" value={choice.next} onChange={(e) => updateChoice(step.id, cIdx, 'next', e.target.value)} />
                    </div>
                    
                    <div className="flex items-center justify-between px-2">
                      <ImpactInput icon={<Shield size={14}/>} color="text-blue-500" value={choice.impact?.security} onChange={(v:any) => updateChoice(step.id, cIdx, 'impact.security', v)} />
                      <ImpactInput icon={<Droplets size={14}/>} color="text-green-500" value={choice.impact?.hygiene} onChange={(v:any) => updateChoice(step.id, cIdx, 'impact.hygiene', v)} />
                      <ImpactInput icon={<MessageCircle size={14}/>} color="text-purple-500" value={choice.impact?.communication} onChange={(v:any) => updateChoice(step.id, cIdx, 'impact.communication', v)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => onSave({ title, config_json: { steps } })} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm mt-10">
        <Star size={20} className="text-yellow-400 animate-pulse" /> Enregistrer la Configuration du Jeu
      </button>
    </div>
  );
};

const ImpactInput = ({ icon, color, value, onChange }: any) => (
  <div className="flex items-center gap-2">
    <div className={color}>{icon}</div>
    <input type="number" className="w-12 p-1 text-[10px] font-black border-none bg-white rounded-lg text-center shadow-sm" value={value || 0} onChange={(e) => onChange(e.target.value)} />
  </div>
);