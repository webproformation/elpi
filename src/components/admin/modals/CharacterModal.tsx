import { useRef } from 'react';
import { 
  User, HeartPulse, Pill, Utensils, Smile, X, 
  Camera, Upload, CheckCircle, Video, Info
} from 'lucide-react';

interface CharacterModalProps {
  show: boolean;
  onSave: (e: React.FormEvent) => void;
  data: any;
  setData: (data: any) => void;
  onClose: () => void;
}

export const CharacterModal = ({ show, onSave, data, setData, onClose }: CharacterModalProps) => {
  if (!show) return null;

  const fileInputRefs = {
    neutral: useRef<HTMLInputElement>(null),
    happy: useRef<HTMLInputElement>(null),
    angry: useRef<HTMLInputElement>(null),
    confused: useRef<HTMLInputElement>(null),
  };

  const attitudes = [
    { id: 'neutral', label: 'Neutre' },
    { id: 'happy', label: 'Heureux' },
    { id: 'angry', label: 'En colère' },
    { id: 'confused', label: 'Confus' }
  ];

  const handleFileChange = (emoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData({ 
        ...data, 
        assets: { ...data.assets, [emoId]: file } 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] max-w-5xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="p-8 pb-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <User className="text-[#962588]" size={28} /> Fiche de l'Interlocuteur (Résident)
            </h2>
            <p className="text-slate-400 text-[10px] mt-1 uppercase font-black tracking-widest">Dossier médical & Histoire de vie Elpi</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form onSubmit={onSave} className="space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-[#962588] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Info size={14}/> Identité & Biographie
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Prénom</label>
                    <input type="text" placeholder="ex: Suzie" required className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#962588] font-bold" value={data.first_name} onChange={e => setData({...data, first_name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Nom de famille</label>
                    <input type="text" placeholder="ex: MARTIN" required className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#962588] font-bold" value={data.last_name} onChange={e => setData({...data, last_name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Description de sa situation personnelle</label>
                  <textarea placeholder="Situation familiale, ancien métier, traits de caractère marquants, ce qu'elle aime ou déteste..." className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm h-32 outline-none focus:ring-2 focus:ring-[#962588] resize-none shadow-inner" value={data.description} onChange={e => setData({...data, description: e.target.value})} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-[#00aeb7] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Camera size={14}/> Attitudes (Photos ou Vidéos)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {attitudes.map((emo) => (
                    <div key={emo.id} className="relative p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 group hover:border-[#00aeb7] transition-all">
                      <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-[#00aeb7]">{emo.label}</span>
                      <input type="file" hidden accept="image/*,video/*" ref={fileInputRefs[emo.id as keyof typeof fileInputRefs]} onChange={(e) => handleFileChange(emo.id, e)} />
                      
                      {data.assets?.[emo.id] ? (
                        <div className="flex flex-col items-center text-green-600 animate-in zoom-in text-center">
                          <CheckCircle size={28} />
                          <span className="text-[8px] font-bold mt-1 uppercase">Média chargé</span>
                          <button type="button" onClick={() => fileInputRefs[emo.id as keyof typeof fileInputRefs].current?.click()} className="text-[8px] text-blue-500 underline mt-1">Modifier</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileInputRefs[emo.id as keyof typeof fileInputRefs].current?.click()} className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-[#00aeb7] transition-all transform group-hover:scale-110">
                          <Upload size={24} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <Video size={16} className="text-blue-500 mt-1 shrink-0" />
                  <p className="text-[9px] text-blue-800 leading-relaxed font-medium">Uploadez des fichiers images ou MP4. Ils seront affichés selon l'humeur du personnage dans le jeu.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <HeartPulse size={14}/> Dossier de Soins & Pathologies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <HeartPulse size={12} className="text-[#962588]"/> Troubles & Pathologies
                  </label>
                  <textarea 
                    placeholder="ex: Atteinte d'Alzheimer stade 2, Surdité oreille droite, antécédents cardiaques, troubles de la marche..." 
                    className="w-full p-4 bg-purple-50/30 border-none rounded-2xl text-sm h-44 outline-none focus:ring-2 focus:ring-[#962588] resize-none" 
                    value={data.medical_history} 
                    onChange={e => setData({...data, medical_history: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <Pill size={12} className="text-blue-500"/> Traitements & Soins
                  </label>
                  <textarea 
                    placeholder="ex: Sous anticoagulants (Previscan), aide à la prise au verre, pilulier hebdomadaire, précautions de manipulation..." 
                    className="w-full p-4 bg-blue-50/30 border-none rounded-2xl text-sm h-44 outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                    value={data.medications} 
                    onChange={e => setData({...data, medications: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <Utensils size={12} className="text-green-600"/> Nutrition & Habitudes
                  </label>
                  <textarea 
                    placeholder="ex: Régime sans sel, texture mixée, aide à la déglutition, boit peu, aime son café très sucré..." 
                    className="w-full p-4 bg-green-50/30 border-none rounded-2xl text-sm h-44 outline-none focus:ring-2 focus:ring-green-500 resize-none" 
                    value={data.dietary_info} 
                    onChange={e => setData({...data, dietary_info: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]">
                <Smile className="text-yellow-400 animate-pulse" size={20} /> Valider la fiche du Personnage
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};