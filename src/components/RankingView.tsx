// src/components/RankingView.tsx
import React from 'react';
import { Trophy, Zap, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { NavigationDock } from './NavigationDock';
import { ViewState } from '../types';

export const RankingView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  // CONFIGURATION DES BADGES
  const badges = [
    { title: "SÉCURITÉ", icon: <ShieldCheck className="w-6 h-6 text-blue-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: 2, color: "blue" },
    { title: "HYGIÈNE", icon: <Sparkles className="w-6 h-6 text-yellow-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: 1, color: "yellow" },
    { title: "COMMUNICATION", icon: <MessageCircle className="w-6 h-6 text-purple-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: 3, color: "purple" }
  ];

  return (
    <div className="h-screen bg-[#F0F4F8] font-sans overflow-hidden relative flex flex-col">
      <div className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10 shrink-0">
        <h2 className="text-2xl font-extrabold text-[#962588] flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" /> Mes Compétences</h2>
        <div className="flex gap-2"><span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Zap className="w-3 h-3 fill-current" /> Progression</span></div>
      </div>
      
      <div className="flex-grow w-full max-w-4xl mx-auto p-6 overflow-y-auto mb-24 custom-scrollbar">
        {badges.map((badge, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full bg-${badge.color}-100`}>{badge.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg">{badge.title}</h3>
            </div>
            
            {/* Matrice des niveaux */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {badge.levels.map((level, i) => (
                <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${i < badge.current ? 'opacity-100 scale-105' : 'opacity-30 grayscale scale-95'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 shadow-sm ${i < badge.current ? `bg-${badge.color}-100 border-${badge.color}-500 text-${badge.color}-700` : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                    {i === 3 ? '👑' : i === 2 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${i < badge.current ? `text-${badge.color}-600` : 'text-gray-400'}`}>{level}</span>
                </div>
              ))}
            </div>
            
            {/* Barre de progression */}
            <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
               <div className={`h-full bg-${badge.color}-500 transition-all duration-1000 ease-out`} style={{width: `${(badge.current / 4) * 100}%`}}></div>
            </div>
          </div>
        ))}
      </div>
      <NavigationDock active="ranking" onNavigate={onNavigate} />
    </div>
  );
};