import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Trash2, 
  Save, 
  ListOrdered, 
  AlertTriangle, 
  Shield, 
  Droplets, 
  MessageCircle,
  GripVertical,
  Clock,
  UserCheck,
  CheckCircle2,
  FolderHeart,
  X,
  HeartPulse,
  Info
} from 'lucide-react';

interface GamePlanningEditorProps {
  config: any;
  characters: any[];
  onSave: (data: any) => void;
}

export const GamePlanningEditor = ({ config, characters = [], onSave }: GamePlanningEditorProps) => {
  const [title, setTitle] = useState(config?.title || "");
  const [tasks, setTasks] = useState<any[]>(config?.config_json?.tasks || []);
  const [incidents, setIncidents] = useState<any[]>(config?.config_json?.incidents || []);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(config?.config_json?.characterIds || []);
  const [previewCharacter, setPreviewCharacter] = useState<any>(null);

  useEffect(() => {
    if (config) {
      setTitle(config.title || "");
      setTasks(config.config_json?.tasks || []);
      setIncidents(config.config_json?.incidents || []);
      setSelectedCharacterIds(config.config_json?.characterIds || []);
    }
  }, [config]);

  const toggleCharacter = (id: string) => {
    setSelectedCharacterIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addTask = () => {
    const newTask = { id: crypto.randomUUID(), label: "Nouvelle tâche", impact: { security: 0, hygiene: 0, communication: 0 } };
    setTasks([...tasks, newTask]);
  };

  const addIncident = () => {
    const newIncident = { id: crypto.randomUUID(), label: "Nouvel incident", description: "", triggerAfterSteps: 1, impact: { security: 0, hygiene: 0 } };
    setIncidents([...incidents, newIncident]);
  };

  const updateField = (list: any[], setList: any, id: string, field: string, value: any) => {
    setList(list.map(item => {
      if (item.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { ...item, [parent]: { ...item[parent], [child]: value } };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-8 pb-24 font-sans animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-10">
        <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Titre du scénario de planification</label>
            <input 
                type="text" 
                className="text-3xl font-black text-slate-800 bg-slate-50 border-none rounded-3xl w-full p-6 focus:ring-4 focus:ring-[#962588]/10 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Matinée chargée en cuisine"
            />
        </div>

        <div className="space-y-6">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-3">
                <UserCheck className="text-[#00aeb7]" size={20} /> Résidents concernés par le planning
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {characters.map((c) => (
                    <div key={c.id} className="flex flex-col gap-3">
                        <button
                            onClick={() => toggleCharacter(c.id)}
                            className={`relative p-5 rounded-[2.5rem] border-2 transition-all group flex flex-col items-center gap-4
                                ${selectedCharacterIds.includes(c.id) ? 'border-[#00aeb7] bg-blue-50 shadow-xl scale-105' : 'border-slate-50 bg-white hover:border-slate-200 hover:scale-105'}`}
                        >
                            <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-md relative">
                                <img src={c.assets?.neutral || '/icone-perso.png'} className="w-full h-full object-cover" alt={c.first_name} />
                                {selectedCharacterIds.includes(c.id) && (
                                    <div className="absolute inset-0 bg-[#00aeb7]/20 flex items-center justify-center animate-in zoom-in">
                                        <CheckCircle2 className="text-white fill-[#00aeb7]" size={32} />
                                    </div>
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase truncate w-full text-center ${selectedCharacterIds.includes(c.id) ? 'text-[#00aeb7]' : 'text-slate-600'}`}>
                                {c.first_name}
                            </span>
                        </button>
                        <button 
                            onClick={() => setPreviewCharacter(c)}
                            className="flex items-center justify-center gap-1.5 text-[9px] font-black text-slate-400 hover:text-[#00aeb7] transition-colors uppercase tracking-widest"
                        >
                            <Info size={12} /> Fiche Infos
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {previewCharacter && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl border-4 border-white flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                  <img src={previewCharacter.assets?.neutral || '/icone-perso.png'} className="w-full h-full object-cover" alt={previewCharacter.first_name} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{previewCharacter.first_name} {previewCharacter.last_name}</h3>
                  <p className="text-xs font-black text-[#00aeb7] uppercase tracking-[0.2em] flex items-center gap-2"><FolderHeart size={16} /> Dossier de soins ELPI</p>
                </div>
              </div>
              <button onClick={() => setPreviewCharacter(null)} className="p-4 bg-white text-slate-400 hover:text-red-500 rounded-2xl shadow-sm transition-all border border-slate-100"><X size={28} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><HeartPulse size={14} className="text-red-500"/> Situation & Biographie</h4>
                <p className="bg-slate-50 p-6 rounded-3xl text-slate-600 font-medium italic border border-slate-100 leading-relaxed shadow-inner">
                  {previewCharacter.description || "Aucune information biographique renseignée."}
                </p>
              </section>
            </div>
            <div className="p-10 bg-slate-50 border-t border-slate-100">
              <button onClick={() => setPreviewCharacter(null)} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-black transition-all">Fermer l'aperçu du dossier</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-3"><ListOrdered className="text-[#00aeb7]" size={20} /> Tâches à planifier</h3>
            <button onClick={addTask} className="p-3 bg-[#00aeb7] text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Plus size={24} /></button>
          </div>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 group transition-all hover:border-[#00aeb7] shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="bg-slate-50 text-slate-300 p-3 rounded-2xl"><GripVertical size={20} /></div>
                  <input type="text" className="flex-1 font-black text-slate-700 bg-transparent border-none focus:ring-0 p-0 text-xl" value={task.label} onChange={(e) => updateField(tasks, setTasks, task.id, 'label', e.target.value)} />
                  <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-red-200 hover:text-red-500 transition-colors"><Trash2 size={24} /></button>
                </div>
                <div className="flex gap-4 border-t border-slate-50 pt-6">
                   <ImpactInput icon={<Shield size={16}/>} color="text-blue-500" label="Sécurité" value={task.impact?.security} onChange={(v:any) => updateField(tasks, setTasks, task.id, 'impact.security', parseInt(v))} />
                   <ImpactInput icon={<Droplets size={16}/>} color="text-green-500" label="Hygiène" value={task.impact?.hygiene} onChange={(v:any) => updateField(tasks, setTasks, task.id, 'impact.hygiene', parseInt(v))} />
                   <ImpactInput icon={<MessageCircle size={16}/>} color="text-purple-500" label="Dialogue" value={task.impact?.communication} onChange={(v:any) => updateField(tasks, setTasks, task.id, 'impact.communication', parseInt(v))} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-3"><AlertTriangle className="text-[#962588]" size={20} /> Alertes configurables</h3>
            <button onClick={addIncident} className="p-3 bg-[#962588] text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Plus size={24} /></button>
          </div>
          <div className="space-y-4">
            {incidents.map((inc) => (
              <div key={inc.id} className="bg-purple-50 p-8 rounded-[3rem] border border-purple-100 shadow-sm space-y-6 relative overflow-hidden group">
                <div className="flex items-start gap-5">
                  <div className="flex-1 space-y-4">
                    <input type="text" className="w-full font-black text-purple-900 bg-transparent border-none focus:ring-0 p-0 text-lg uppercase" value={inc.label} onChange={(e) => updateField(incidents, setIncidents, inc.id, 'label', e.target.value)} placeholder="Titre de l'incident..." />
                    <textarea className="w-full bg-white/60 border-none rounded-3xl text-sm italic p-6 focus:ring-4 focus:ring-[#962588]/10 h-32 resize-none" value={inc.description} onChange={(e) => updateField(incidents, setIncidents, inc.id, 'description', e.target.value)} placeholder="Consignes pédagogiques..." />
                  </div>
                  <button onClick={() => setIncidents(incidents.filter(i => i.id !== inc.id))} className="text-purple-200 hover:text-red-500 transition-colors"><Trash2 size={24} /></button>
                </div>
                <div className="flex items-center gap-4 bg-white/50 p-5 rounded-[2rem] border border-purple-200/30">
                  <Clock size={20} className="text-[#962588]" />
                  <span className="text-[11px] font-black text-purple-900 uppercase tracking-widest flex-1">Se déclenche après tâche N° :</span>
                  <input type="number" className="w-16 bg-white rounded-xl border-none text-center font-black text-purple-700 p-2" value={inc.triggerAfterSteps} onChange={(e) => updateField(incidents, setIncidents, inc.id, 'triggerAfterSteps', parseInt(e.target.value))} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => onSave({ title, config_json: { tasks, incidents, characterIds: selectedCharacterIds } })}
        className="fixed bottom-10 right-10 z-50 bg-[#962588] text-white px-12 py-6 rounded-full font-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-sm border-b-8 border-black active:border-b-0 active:translate-y-2"
      >
        <Save size={24} /> Enregistrer la Configuration
      </button>
    </div>
  );
};

const ImpactInput = ({ icon, color, label, value, onChange }: any) => (
  <div className="flex flex-col gap-2 flex-1">
    <div className="flex items-center gap-2 px-2">
        <div className={color}>{icon}</div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <input type="number" className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-black text-slate-600 text-center shadow-inner" value={value || 0} onChange={(e) => onChange(e.target.value)} />
  </div>
);