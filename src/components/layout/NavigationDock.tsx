import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavigationDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const active = location.pathname.includes('catalog') ? 'catalog'
               : location.pathname.includes('ranking') ? 'ranking' 
               : location.pathname.includes('profile') ? 'profile' 
               : 'hub';

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4 flex justify-center font-sans">
      <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-xl border border-white p-2 flex justify-around w-full items-center h-20">
        <NavBtn 
          icon="/icone-maison.png" 
          label="Elpi" 
          active={active === 'hub'} 
          onClick={() => navigate('/app')}
          activeColor="text-[#f4a938]" // Couleur orange de la maison
          gradient="from-[#f4a938] to-[#d68c20]"
        />
        <NavBtn 
          icon="/icone-formation.png" 
          label="Formations" 
          active={active === 'catalog'} 
          onClick={() => navigate('/app/catalog')}
          activeColor="text-[#7db343]" // Couleur verte de la formation
          gradient="from-[#7db343] to-[#5a8c2a]"
        />
        <NavBtn 
          icon="/icone-coupe.png" 
          label="Compétences" 
          active={active === 'ranking'} 
          onClick={() => navigate('/app/ranking')}
          activeColor="text-[#3498db]" // Couleur bleue de la coupe
          gradient="from-[#3498db] to-[#2980b9]"
        />
        <NavBtn 
          icon="/icone-perso.png" 
          label="Profil" 
          active={active === 'profile'} 
          onClick={() => navigate('/app/profile')}
          activeColor="text-[#95a5a6]" // Couleur grise du profil
          gradient="from-[#95a5a6] to-[#7f8c8d]"
        />
      </div>
    </div>
  );
};

interface NavBtnProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor: string;
  gradient: string;
}

const NavBtn = ({ icon, label, active, onClick, activeColor, gradient }: NavBtnProps) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center transition-all duration-300 relative ${active ? '-translate-y-4 scale-110' : 'opacity-60 hover:opacity-100'}`}
  >
    <div className={`p-2 rounded-full transition-all ${active ? `bg-gradient-to-b ${gradient} shadow-lg border-4 border-white` : ''}`}>
      <img src={icon} className={`w-10 h-10 ${active ? 'brightness-0 invert' : ''}`} alt={label} />
    </div>
    {active && (
      <span className={`text-[10px] font-black absolute -bottom-6 whitespace-nowrap uppercase tracking-widest ${activeColor}`}>
        {label}
      </span>
    )}
  </button>
);