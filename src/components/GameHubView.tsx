// src/components/GameHubView.tsx
import React from 'react';
import { BedDouble, Bath, Sofa, Utensils, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { NavigationDock } from './NavigationDock';
import { UserData, Stats, ViewState } from '../types';

export const GameHubView = ({ user, onNavigate, onStartGameSalon, onStartGameChambre, onStartGameSdb, stats }: { 
  user: UserData, 
  onNavigate: (view: ViewState) => void, 
  onStartGameSalon: () => void, 
  onStartGameChambre: () => void, 
  onStartGameSdb: () => void,
  stats: Stats 
}) => {
  return (
    <div className="h-screen bg-[#E6F3F5] font-sans overflow-hidden relative flex flex-col justify-center items-center">
      
      {/* BACKGROUND ANIMÉ (Vos animations conservées) */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] -left-[150px] w-[120px] opacity-50 animate-cloud-slow" style={{animationDelay: '-10s'}}><img src="/nuage1.png" alt="" className="w-full brightness-110" /></div>
        <div className="absolute top-[8%] -left-[400px] w-[100px] opacity-40 animate-cloud-slow" style={{animationDelay: '-60s'}}><img src="/nuage2.png" alt="" className="w-full brightness-110" /></div>
        <div className="absolute top-[30%] -left-[400px] w-[450px] opacity-30 animate-cloud-fast" style={{animationDelay: '-2s'}}><img src="/nuage3.png" alt="" className="w-full brightness-110" /></div>
        
        {/* Oiseaux */}
        <div className="absolute top-[15%] -left-[100px] w-16 opacity-80 animate-fly-1" style={{animationDelay: '-5s'}}><img src="/bird1.png" alt="" className="w-full" /></div>
        <div className="absolute top-[25%] -left-[100px] w-10 opacity-70 animate-fly-2" style={{animationDelay: '-12s'}}><img src="/bird2.png" alt="" className="w-full" /></div>
      </div>

      {/* HEADER FLOTTANT (PROFIL & STATS MISES À JOUR) */}
      <div className="absolute top-4 right-4 z-50 md:w-auto w-[92%] md:left-auto left-4">
        <div className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-2xl p-3 shadow-xl flex items-center gap-4 animate-fade-in-down">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00aeb7] to-[#962588] rounded-full blur-sm opacity-50"></div>
            <img src={user.avatar} alt="Profile" className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-md z-10" />
          </div>
          <div className="flex-1 pr-2 min-w-[140px]">
            <h3 className="font-extrabold text-lg text-gray-800 leading-tight">{user.name}</h3>
            <div className="space-y-1.5 mt-1.5">
              
              {/* Sécurité */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-blue-500 w-16 uppercase tracking-wide flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Sécurité</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100">
                  <div className="h-full bg-gradient-to-r from-blue-300 to-blue-500 w-[40%] rounded-full transition-all duration-500" style={{width: `${stats.security}%`}}></div>
                </div>
              </div>

              {/* Hygiène */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-yellow-500 w-16 uppercase tracking-wide flex items-center gap-1"><Sparkles className="w-3 h-3" /> Hygiène</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100">
                  <div className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 w-[60%] rounded-full transition-all duration-500" style={{width: `${stats.hygiene}%`}}></div>
                </div>
              </div>

              {/* Communication */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-purple-500 w-16 uppercase tracking-wide flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Comm.</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100">
                  <div className="h-full bg-gradient-to-r from-purple-300 to-purple-500 w-[60%] rounded-full transition-all duration-500" style={{width: `${stats.communication}%`}}></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-grow flex flex-col justify-center items-center relative z-10 w-full px-4">
        <div className="relative w-full max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-500 animate-scale-slow">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-40 w-full text-center">
             <div className="inline-flex items-center justify-center gap-3 bg-[#FFE8CC]/95 backdrop-blur-md px-8 py-3 rounded-full border-2 border-white shadow-xl animate-fade-in-up">
               <img src="/icone-maison.png" alt="" className="w-8 h-8 drop-shadow-sm" />
               <span className="text-[#8B4513] font-extrabold text-2xl tracking-tight">La Maison de Suzie</span>
             </div>
          </div>
          <img src="/maison.png" alt="Maison de Suzie" className="w-full drop-shadow-2xl z-0 relative" />
          
          <div className="absolute top-[25%] left-[10%] right-[10%] bottom-[5%] grid grid-cols-2 grid-rows-2 gap-4 z-30 p-4">
            
            {/* CHAMBRE (SÉCURITÉ) */}
            <button onClick={onStartGameChambre} className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none transform -translate-y-4 -translate-x-2">
              <div className="p-3.5 rounded-full bg-blue-500 text-white shadow-lg border-4 border-white transition-all duration-300 group-hover:bg-blue-600"><BedDouble className="w-8 h-8 drop-shadow-md" /></div>
              <span className="mt-2 font-bold text-white text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">Chambre</span>
            </button>
            
            {/* SALLE DE BAIN (HYGIÈNE) - REMPLACE LE BUREAU */}
            <button onClick={onStartGameSdb} className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none transform translate-x-2 -translate-y-2">
              <div className="p-3.5 rounded-full bg-yellow-500 text-white shadow-lg border-4 border-white transition-all duration-300 group-hover:bg-yellow-600"><Bath className="w-8 h-8 drop-shadow-md" /></div>
              <span className="mt-2 font-bold text-white text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">Salle de Bain</span>
            </button>

            {/* SALON (COMMUNICATION) */}
            <button onClick={onStartGameSalon} className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none transform translate-y-2 -translate-x-2 cursor-pointer">
              <div className="p-3.5 rounded-full bg-purple-600 text-white shadow-lg border-4 border-white transition-all duration-300 group-hover:bg-purple-700 animate-pulse"><Sofa className="w-8 h-8 drop-shadow-md" /></div>
              <span className="mt-2 font-bold text-white text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30 group-hover:bg-[#962588]">Salon (JOUER)</span>
            </button>

            {/* CUISINE */}
            <button className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none transform translate-y-2 translate-x-2">
              <div className="p-3.5 rounded-full bg-green-600 text-white shadow-lg border-4 border-white transition-all duration-300 group-hover:bg-green-700"><Utensils className="w-8 h-8 drop-shadow-md" /></div>
              <span className="mt-2 font-bold text-white text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">Cuisine</span>
            </button>
          </div>
        </div>
      </div>
      <NavigationDock active="hub" onNavigate={onNavigate} />
    </div>
  );
};