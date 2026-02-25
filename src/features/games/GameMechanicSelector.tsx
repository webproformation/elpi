import React from 'react';
import { GameEngine } from './GameEngine';
import { Game360Engine } from './Game360Engine';
import { GamePlanningEngine } from './GamePlanningEngine';
import { GameErrorEngine } from './GameErrorEngine'; // Import du nouveau moteur vidéo
import { Eye, Rotate3d, AlertCircle, ClipboardList, Target } from 'lucide-react';

interface SelectorProps {
  scenario: any;
  onClose: () => void;
}

export const GameMechanicSelector = ({ scenario, onClose }: SelectorProps) => {
  const mechanic = scenario.mechanic || 'dialogue';

  switch (mechanic) {
    case 'dialogue':
      // Moteur classique d'entretien et dialogue
      return <GameEngine scenario={scenario} onClose={onClose} />;

    case '360':
      // Moteur d'exploration immersive 360°
      return <Game360Engine scenario={scenario} onClose={onClose} />;

    case 'planning':
      // Moteur de planification et gestion d'incidents
      return <GamePlanningEngine scenario={scenario} onClose={onClose} />;

    case 'error':
      // NOUVEAU : Activation du moteur de vigilance sur séquence vidéo
      return <GameErrorEngine scenario={scenario} onClose={onClose} />;

    case 'report':
      // Cette mécanique reste en placeholder pour le moment
      return <PlaceholderEngine icon={<Eye size={48} />} title="Compte-Rendu" onClose={onClose} />;

    default:
      return (
        <div className="bg-white p-12 rounded-[3rem] text-center shadow-2xl animate-in zoom-in duration-300 font-sans border-4 border-white">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Mécanique Inconnue</h2>
          <p className="text-slate-500 mb-6 text-sm">Le type de jeu "{mechanic}" n'est pas encore configuré dans le système.</p>
          <button 
            onClick={onClose} 
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all shadow-lg uppercase tracking-widest text-[10px]"
          >
            Retour au Hub
          </button>
        </div>
      );
  }
};

const PlaceholderEngine = ({ icon, title, onClose }: any) => (
  <div className="max-w-2xl w-full bg-white rounded-[3.5rem] p-16 shadow-2xl text-center animate-in zoom-in duration-500 border-4 border-white font-sans">
    <div className="w-24 h-24 bg-[#E6F3F5] text-[#00aeb7] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-white">
      {icon}
    </div>
    <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase tracking-tighter">{title}</h2>
    <p className="text-slate-500 mb-10 leading-relaxed font-medium italic">
      Cette mécanique de jeu est en cours de déploiement technique.<br/> 
      Elle sera bientôt disponible pour tous les scénarios de la Maison de Suzie.
    </p>
    <button 
      onClick={onClose}
      className="w-full py-5 bg-[#00aeb7] text-white rounded-[1.5rem] font-black hover:bg-[#008c93] shadow-xl transition-all uppercase tracking-[0.2em] text-sm"
    >
      Retour au Hub
    </button>
  </div>
);