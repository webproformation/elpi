// src/components/NavigationDock.tsx
import React from 'react';
import { ViewState } from '../types';

export const NavigationDock = ({ active, onNavigate }: { active: ViewState, onNavigate: (view: ViewState) => void }) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 flex justify-center">
      <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white p-2 flex items-center justify-around w-full gap-4 md:gap-12">
        
        {/* HUB */}
        <button 
          onClick={() => onNavigate('hub')}
          className={`flex flex-col items-center gap-1 group transition-all duration-300 shrink-0 ${active === 'hub' ? 'relative -top-6 scale-110' : 'opacity-60 hover:opacity-100 hover:-translate-y-1'}`}
        >
          <div className={`${active === 'hub' ? 'bg-gradient-to-b from-[#f4a938] to-[#d68c20] shadow-lg border-[5px] border-[#E6F3F5]' : ''} p-2 rounded-full transition-all`}>
            <img src="/icone-maison.png" alt="Hub" className={`w-8 h-8 drop-shadow-sm shrink-0 ${active === 'hub' ? 'brightness-0 invert' : ''}`} /> 
          </div>
          {active === 'hub' && <span className="text-xs font-bold text-[#d68c20] absolute -bottom-5 animate-fade-in-up whitespace-nowrap">Hub</span>}
        </button>

        {/* PROFIL */}
        <button 
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center gap-1 group transition-all duration-300 shrink-0 ${active === 'profile' ? 'relative -top-6 scale-110' : 'opacity-60 hover:opacity-100 hover:-translate-y-1'}`}
        >
          <div className={`${active === 'profile' ? 'bg-gradient-to-b from-[#00aeb7] to-[#008b92] shadow-lg border-[5px] border-[#E6F3F5] p-3' : 'p-1' } rounded-full transition-all`}>
            <img src="/icone-perso.png" alt="Profil" className={`w-14 h-14 drop-shadow-md shrink-0 ${active === 'profile' ? 'brightness-0 invert w-8 h-8' : ''}`} />
          </div>
          {active === 'profile' && <span className="text-xs font-bold text-[#00aeb7] absolute -bottom-5 animate-fade-in-up whitespace-nowrap">Profil</span>}
        </button>

        {/* CLASSEMENT */}
        <button 
          onClick={() => onNavigate('ranking')} 
          className={`flex flex-col items-center gap-1 group transition-all duration-300 shrink-0 ${active === 'ranking' ? 'relative -top-6 scale-110' : 'opacity-60 hover:opacity-100 hover:-translate-y-1'}`}
        >
          <div className={`${active === 'ranking' ? 'bg-gradient-to-b from-[#962588] to-[#701a65] shadow-lg border-[5px] border-[#E6F3F5] p-3' : 'p-1' } rounded-full transition-all`}>
            <img src="/icone-coupe.png" alt="Classement" className={`w-14 h-14 drop-shadow-md shrink-0 ${active === 'ranking' ? 'brightness-0 invert w-8 h-8' : ''}`} />
          </div>
          {active === 'ranking' && <span className="text-xs font-bold text-[#962588] absolute -bottom-5 animate-fade-in-up whitespace-nowrap">Compétences</span>}
        </button>

      </div>
    </div>
  );
};