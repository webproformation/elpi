import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Rotate3d, 
  ClipboardList, 
  FileSearch, 
  ChevronRight,
  Gamepad2
} from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; mechanic: string; room: string }) => void;
}

export const ConfigModal = ({ isOpen, onClose, onSave }: ConfigModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('dialogue');
  const [room, setRoom] = useState('Salon');

  if (!isOpen) return null;

  const mechanics = [
    {
      id: 'dialogue',
      title: 'DIALOGUE INTERACTIF',
      desc: 'Conversation avec choix et impacts.',
      icon: <MessageCircle size={20} />,
      color: 'bg-[#962588]'
    },
    {
      id: '360',
      title: 'VUE 360° IMMERSIVE',
      desc: 'Exploration d\'une pièce et points sensibles.',
      icon: <Rotate3d size={20} />,
      color: 'bg-slate-400'
    },
    {
      id: 'planning', // AJOUT DE LA MÉCANIQUE MANQUANTE
      title: 'PLANIFICATION & INCIDENTS',
      desc: 'Gérer les priorités et réagir aux imprévus.',
      icon: <ClipboardList size={20} />,
      color: 'bg-slate-400'
    },
    {
      id: 'error',
      title: 'CHERCHEZ L\'ERREUR',
      desc: 'Identifier des fautes sur une image.',
      icon: <FileSearch size={20} />,
      color: 'bg-slate-400'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    // On passe bien la pièce (room) lors de la sauvegarde
    onSave({ title, mechanic: selectedMechanic, room });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header correspondant à votre capture */}
        <div className="p-8 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-[#962588] p-3 rounded-2xl text-white shadow-lg">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Nouveau Jeu</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Choix de la mécanique</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          
          {/* Titre du scénario */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Titre du scénario</label>
            <input
              required
              type="text"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-[#962588] outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Le refus de soin de Suzie"
            />
          </div>

          {/* Pièce de la maison */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pièce de la maison</label>
            <select 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-[#962588] outline-none appearance-none"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="Salon">Salon</option>
              <option value="Cuisine">Cuisine</option>
              <option value="Chambre">Chambre</option>
              <option value="Salle de bain">Salle de bain</option>
            </select>
          </div>

          {/* Mécanique de Gameplay */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Mécanique de gameplay</label>
            <div className="space-y-2">
              {mechanics.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMechanic(m.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                    ${selectedMechanic === m.id ? 'border-[#962588] bg-purple-50' : 'border-slate-50 bg-white hover:border-slate-100'}`}
                >
                  <div className={`p-2 rounded-xl ${selectedMechanic === m.id ? 'bg-[#962588] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[10px] text-slate-800 uppercase">{m.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{m.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMechanic === m.id ? 'border-[#962588]' : 'border-slate-200'}`}>
                    {selectedMechanic === m.id && <div className="w-2.5 h-2.5 bg-[#962588] rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-[#962588] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
            Créer et configurer
          </button>
        </form>
      </div>
    </div>
  );
};