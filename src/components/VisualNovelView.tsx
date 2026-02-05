// src/components/VisualNovelView.tsx
import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { Stats } from '../types';

const EMOTION_IMAGES: Record<string, string> = {
  happy: '/md1.png', neutral: '/md2.png', angry: '/md3.png', sad: '/md4.png'
};

const SCENARIO_SALON = [
  // ... (Reprendre le scénario de ma réponse précédente avec les impacts mis à jour)
  // Pour faire court ici, je mets un extrait, mais gardez le scénario complet.
  {
    id: 1, speaker: "Mme Durand", emotion: "angry", 
    text: "NON ! Je ne veux voir personne ! Ma fille m'a encore posé un lapin !",
    choices: [
      { text: "Madame, je comprends votre colère...", type: "empathic", impact: { communication: +20 }, next: 3 },
      { text: "Calmez-vous, je travaille.", type: "authoritarian", impact: { communication: -10 }, next: 2 }
    ]
  },
  { id: 2, speaker: "Mme Durand", emotion: "neutral", text: "Pff, faites vite.", choices: [], end: true },
  { id: 3, speaker: "Mme Durand", emotion: "sad", text: "C'est dur d'être seule...", choices: [], end: true }
];

export const VisualNovelView = ({ onClose, onUpdateStats, currentStats }: { onClose: () => void, onUpdateStats: (impact: Partial<Stats>) => void, currentStats: Stats }) => {
  const [currentStepId, setCurrentStepId] = useState(1);
  const currentStep = SCENARIO_SALON.find(s => s.id === currentStepId) || SCENARIO_SALON[0];

  const handleChoice = (nextId: number, impact?: Partial<Stats>) => {
    if (impact) onUpdateStats(impact);
    if (currentStep?.end || !nextId) onClose(); else setCurrentStepId(nextId);
  };

  return (
    <div className="h-screen bg-gray-900 font-sans relative flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0"><div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div><img src="/salon.jpg" alt="Salon" className="w-full h-full object-cover" /></div>
      <button onClick={onClose} className="absolute top-6 right-6 z-50 bg-white/20 p-2 rounded-full text-white"><X className="w-6 h-6" /></button>
      
      <div className="absolute top-6 left-6 z-50 flex flex-col gap-2">
         {/* HUD Stats simplifié */}
         <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20"><MessageCircle className="w-4 h-4 text-purple-400" /><div className="w-24 h-2 bg-gray-700 rounded-full"><div className="h-full bg-purple-500 transition-all" style={{ width: `${currentStats.communication}%` }}></div></div></div>
      </div>

      <div className={`z-10 mt-auto mb-8 transition-all duration-500 transform ${currentStep.emotion === 'angry' ? 'scale-110' : 'scale-100'}`}>
        <div className="w-48 h-48 md:w-72 md:h-72 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 mx-auto"><img src={EMOTION_IMAGES[currentStep.emotion] || '/md2.png'} className="w-full h-full object-cover" /></div>
      </div>

      <div className="z-20 w-full max-w-4xl px-4 pb-8 mt-auto mb-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-fade-in-up">
          <div className="bg-[#962588] text-white px-8 py-3 font-bold text-xl inline-block rounded-br-2xl">{currentStep.speaker}</div>
          <div className="p-6 md:p-8"><p className="text-xl md:text-2xl text-gray-800 font-medium mb-8">"{currentStep.text}"</p><div className="space-y-3">
             {currentStep.choices?.map((choice, idx) => (<button key={idx} onClick={() => handleChoice(choice.next || 0, choice.impact)} className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-[#E6F3F5] border-2 border-transparent transition-all group flex items-center"><div className="bg-white border border-gray-200 text-gray-500 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#00aeb7] group-hover:text-white shrink-0">{String.fromCharCode(65 + idx)}</div><span className="text-gray-700 font-medium group-hover:text-[#00aeb7]">{choice.text}</span></button>))}
             {currentStep.end && <button onClick={() => onClose()} className="w-full text-center p-4 rounded-xl bg-[#962588] text-white font-bold">Terminer</button>}
          </div></div>
        </div>
      </div>
    </div>
  );
};