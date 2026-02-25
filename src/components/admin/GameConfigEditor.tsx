import { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';

interface ScenarioStep {
  id: number;
  speaker: string;
  emotion: string;
  text: string;
  choices: {
    text: string;
    next: number;
    type: string;
    impact: { security?: number; hygiene?: number; communication?: number };
  }[];
  end?: boolean;
}

export const GameConfigEditor = ({ config, onSave }: { config: any, onSave: (data: any) => void }) => {
  const [steps, setSteps] = useState<ScenarioStep[]>(config.steps || [{
    id: 1, speaker: "Suzie", emotion: "happy", text: "Bonjour ! Comment allez-vous aujourd'hui ?", choices: []
  }]);

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, speaker: "", emotion: "happy", text: "", choices: [] }]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: number, field: string, value: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addChoice = (stepId: number) => {
    setSteps(steps.map(s => {
      if (s.id === stepId) {
        return {
          ...s,
          choices: [...s.choices, { text: "", next: 0, type: "empathic", impact: {} }]
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800">Éditeur de Scénario Interactif</h3>
          <p className="text-xs text-slate-500 text-balance">Définissez les dialogues, les embranchements et les points de compétences.</p>
        </div>
        <button onClick={addStep} className="bg-[#00aeb7] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <Plus size={16} /> Ajouter une étape
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black">ID: {step.id}</span>
              <button onClick={() => removeStep(step.id)} className="text-red-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" placeholder="Nom du personnage (ex: Suzie)"
                className="w-full p-2 bg-slate-50 border rounded-lg text-sm"
                value={step.speaker} onChange={(e) => updateStep(step.id, 'speaker', e.target.value)}
              />
              <select 
                className="w-full p-2 bg-slate-50 border rounded-lg text-sm"
                value={step.emotion} onChange={(e) => updateStep(step.id, 'emotion', e.target.value)}
              >
                <option value="happy">Heureux 😊</option>
                <option value="very_happy">Très Heureux 😍</option>
                <option value="neutral">Neutre 😐</option>
                <option value="confused">Dubitatif 🤔</option>
                <option value="angry">Agressif 😠</option>
                <option value="sad">Triste 😢</option>
              </select>
            </div>

            <textarea 
              placeholder="Texte prononcé par le personnage..."
              className="w-full p-3 bg-slate-50 border rounded-xl text-sm h-20 mb-4"
              value={step.text} onChange={(e) => updateStep(step.id, 'text', e.target.value)}
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choix de l'apprenant</h4>
                <button onClick={() => addChoice(step.id)} className="text-[#00aeb7] text-[10px] font-bold hover:underline">+ Ajouter un choix</button>
              </div>
              
              {step.choices.map((choice, cIdx) => (
                <div key={cIdx} className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Texte du bouton..."
                      className="flex-1 p-2 bg-white border rounded-lg text-xs"
                      value={choice.text} onChange={(e) => {
                        const newChoices = [...step.choices];
                        newChoices[cIdx].text = e.target.value;
                        updateStep(step.id, 'choices', newChoices);
                      }}
                    />
                    <input 
                      type="number" placeholder="Vers ID..."
                      className="w-20 p-2 bg-white border rounded-lg text-xs"
                      value={choice.next} onChange={(e) => {
                        const newChoices = [...step.choices];
                        newChoices[cIdx].next = parseInt(e.target.value);
                        updateStep(step.id, 'choices', newChoices);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400">Impact Scores :</span>
                    <div className="flex gap-2">
                      {['security', 'hygiene', 'communication'].map(skill => (
                        <div key={skill} className="flex items-center gap-1">
                          <span className="text-[10px] capitalize">{skill.substring(0,3)}.</span>
                          <input 
                            type="number" className="w-12 p-1 text-[10px] border rounded"
                            placeholder="0"
                            onChange={(e) => {
                              const newChoices = [...step.choices];
                              newChoices[cIdx].impact = { ...newChoices[cIdx].impact, [skill]: parseInt(e.target.value) };
                              updateStep(step.id, 'choices', newChoices);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onSave({ steps })}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition flex items-center justify-center gap-2"
      >
        <Star size={20} className="text-yellow-400" /> Enregistrer la Configuration du Jeu
      </button>
    </div>
  );
};