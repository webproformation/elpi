// src/components/BathroomGameView.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { Stats } from '../types';

export const BathroomGameView = ({ onClose, onUpdateStats }: { onClose: () => void, onUpdateStats: (impact: Partial<Stats>) => void }) => {
  const [errorsFound, setErrorsFound] = useState<string[]>([]);
  
  // Zones à cliquer (en % pour être responsive)
  const hygieneErrors = [
    { id: 'towel', style: { top: '70%', left: '20%', width: '15%', height: '10%' } }, // Serviette
    { id: 'razor', style: { top: '55%', left: '60%', width: '5%', height: '5%' } },   // Rasoir
    { id: 'water', style: { top: '80%', left: '50%', width: '20%', height: '15%' } }, // Eau sol
  ];

  const handleClick = (id: string) => {
    if (!errorsFound.includes(id)) setErrorsFound(prev => [...prev, id]);
  };

  useEffect(() => { if (errorsFound.length === 3) onUpdateStats({ hygiene: 30 }); }, [errorsFound]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        <img src="/sdb.png" alt="Salle de Bain" className="w-full h-full object-cover" />
        
        {hygieneErrors.map((err) => (
          <button
            key={err.id}
            onClick={() => handleClick(err.id)}
            className={`absolute border-2 transition-all duration-300 ${errorsFound.includes(err.id) ? 'border-green-500 bg-green-500/30' : 'border-transparent hover:bg-white/10'}`}
            style={err.style}
          >
            {errorsFound.includes(err.id) && <CheckCircle2 className="w-full h-full text-green-500 p-1" />}
          </button>
        ))}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg">
          <h3 className="font-bold text-[#962588] flex items-center gap-2"><Sparkles className="w-4 h-4" /> Hygiène</h3>
          <p className="text-sm text-gray-600">{errorsFound.length} / 3 erreurs</p>
        </div>
      </div>
      <button onClick={onClose} className="absolute top-6 right-6 bg-white/20 p-2 rounded-full text-white"><X className="w-6 h-6" /></button>
    </div>
  );
};