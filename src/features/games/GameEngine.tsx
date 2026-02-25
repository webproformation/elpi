import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, MessageCircle } from 'lucide-react';
import { GameResults } from './GameResults';

interface GameEngineProps {
  scenario: any;
  onClose: () => void;
}

// Exportation nommée explicite pour éviter le SyntaxError
export const GameEngine = ({ scenario, onClose }: GameEngineProps) => {
  const [currentStepId, setCurrentStepId] = useState(1);
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({ security: 0, hygiene: 0, communication: 0 });
  const [gameEnded, setGameEnded] = useState(false);

  const currentStep = scenario.config_json?.steps?.find((s: any) => s.id === currentStepId);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!currentStep?.speaker) return;
      setLoading(true);
      const { data } = await supabase
        .from('game_characters')
        .select('*')
        .ilike('first_name', currentStep.speaker || '')
        .single();
      
      if (data) setCharacter(data);
      setLoading(false);
    };

    if (currentStep && !character) {
      loadCharacter();
    }
  }, [currentStep, character]);

  const handleChoice = (choice: any) => {
    setScores(prev => ({
      security: prev.security + (choice.impact?.security || 0),
      hygiene: prev.hygiene + (choice.impact?.hygiene || 0),
      communication: prev.communication + (choice.impact?.communication || 0),
    }));

    if (choice.next === 0 || !choice.next) {
      setGameEnded(true);
    } else {
      setCurrentStepId(choice.next);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="animate-spin text-[#00aeb7] w-12 h-12 mb-4" />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Initialisation de la scène...</p>
    </div>
  );

  // Correction : On passe l'objet scenario COMPLET pour que GameResults calcule les badges
  if (gameEnded || currentStep?.end) {
    return <GameResults scenario={scenario} finalScores={scores} onFinish={onClose} />;
  }

  const characterImage = character?.assets?.[currentStep?.emotion] || character?.assets?.neutral || '/icone-perso.png';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-700 font-sans">
      <div className="relative mb-8 group">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-white relative z-10">
          {/* Sécurité : on ne rend l'image que si l'URL est valide */}
          {characterImage && (
            <img 
              src={characterImage} 
              alt={character?.first_name || 'Personnage'} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#962588] text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg z-20 whitespace-nowrap">
          {character?.first_name} {character?.last_name}
        </div>
      </div>

      <div className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 relative mb-8">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-md text-[#00aeb7]">
          <MessageCircle size={24} />
        </div>
        <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed text-center italic">
          "{currentStep?.text || "..."}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
        {currentStep?.choices?.map((choice: any, idx: number) => (
          <button
            key={idx}
            onClick={() => handleChoice(choice)}
            className="bg-[#00aeb7] hover:bg-[#008c93] text-white p-6 rounded-2xl font-black transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg flex items-center justify-center text-center text-sm border-b-4 border-[#008c93] uppercase tracking-tight"
          >
            {choice.text}
          </button>
        ))}
        {(!currentStep?.choices || currentStep.choices.length === 0) && (
          <button 
            onClick={() => setGameEnded(true)}
            className="col-span-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-colors"
          >
            Terminer l'entretien
          </button>
        )}
      </div>
    </div>
  );
};