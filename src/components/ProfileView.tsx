// src/components/ProfileView.tsx
import React from 'react';
import { Settings, LogOut, Star, Shield, BookOpen, Save, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { NavigationDock } from './NavigationDock';
import { UserData, ViewState } from '../types';

export const ProfileView = ({ user, onNavigate }: { user: UserData, onNavigate: (view: ViewState) => void }) => {
  return (
    <div className="h-screen bg-[#F0F4F8] font-sans overflow-hidden relative flex flex-col">
      <div className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10 shrink-0">
        <h2 className="text-2xl font-extrabold text-[#962588] flex items-center gap-2"><Settings className="w-6 h-6" /> Mon Compte</h2>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition"><LogOut className="w-4 h-4" /> Se déconnecter</button>
      </div>
      <div className="flex-grow w-full max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden mb-24">
        <div className="md:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center border border-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-[#00aeb7] to-[#962588] opacity-10"></div>
            <div className="relative">
              <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-r from-[#00aeb7] to-[#962588] mb-3 shadow-lg"><img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full border-4 border-white" /></div>
              <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
              <p className="text-gray-500 text-xs mb-3">{user.email || 'email@exemple.com'}</p>
              <div className="flex justify-center gap-2"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-wide">Niveau 3</span><span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold border border-purple-100 uppercase tracking-wide">Explorateur</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"><div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-1"><Star className="w-4 h-4 fill-current" /></div><span className="text-xl font-bold text-gray-800">1,250</span><span className="text-[10px] text-gray-400 font-medium uppercase">Points XP</span></div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-1"><Shield className="w-4 h-4" /></div><span className="text-xl font-bold text-gray-800">4</span><span className="text-[10px] text-gray-400 font-medium uppercase">Badges</span></div>
          </div>
        </div>
        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg border border-white/50 relative flex flex-col overflow-hidden">
           <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center"><h4 className="text-lg font-bold text-gray-700 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#00aeb7]" /> Mes Informations</h4><button className="bg-[#962588] hover:bg-[#7e1d72] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-md"><Save className="w-4 h-4" /> Enregistrer</button></div>
           <div className="p-6 overflow-y-auto custom-scrollbar flex-grow"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nom</label><input type="text" defaultValue="Dupont" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Prénom</label><input type="text" defaultValue={user.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div className="space-y-2"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label><div className="relative"><Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input type="email" defaultValue={user.email} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Téléphone</label><div className="relative"><Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input type="tel" placeholder="06 12 34 56 78" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div></div><div className="md:col-span-2 grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Code Postal</label><input type="text" placeholder="59000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Ville</label><input type="text" placeholder="Lille" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Adresse Postale</label><div className="relative"><MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input type="text" placeholder="12 rue de la Formation" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Formation Suivie</label><div className="relative"><BookOpen className="absolute left-3 top-2.5 w-5 h-5 text-[#962588]" /><select className="w-full bg-purple-50 border border-purple-100 rounded-xl pl-10 pr-4 py-2 text-purple-900 font-medium focus:ring-2 focus:ring-[#962588] outline-none appearance-none cursor-pointer"><option>Assistant de vie aux familles</option><option>Titre Professionnel ADVF</option><option>Formation Continue - Petite Enfance</option></select><ChevronRight className="absolute right-4 top-3 w-4 h-4 text-purple-400 rotate-90" /></div></div></div></div>
        </div>
      </div>
      <NavigationDock active="profile" onNavigate={onNavigate} />
    </div>
  );
};