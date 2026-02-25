import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Bath, Sofa, Utensils } from 'lucide-react';
import { NavigationDock } from '../../components/layout/NavigationDock';
import { HUD } from '../../components/app/HUD';

export const Hub = () => {
  const navigate = useNavigate();

  const handleRoomClick = (room: string) => {
    navigate(`/game/${room}`);
  };

  return (
    <div className="h-screen bg-[#E6F3F5] flex flex-col items-center justify-center relative overflow-hidden font-sans">
       
       {/* Le HUD : Avatar et Compétences en haut à droite */}
       <HUD />

       <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center justify-center z-10 px-4 lg:scale-125 origin-center transition-transform duration-700">
         
         {/* TITRE - Descendu d'exactement 80px via translate-y-[80px] */}
         <div className="bg-[#FFE8CC] px-8 py-3 rounded-full inline-block border-2 border-white shadow-xl relative z-20 translate-y-[80px]">
            <h1 className="text-[#8B4513] font-extrabold text-2xl tracking-tight">La Maison de Suzie</h1>
         </div>
         
         {/* CONTENEUR DE LA MAISON ET DES SPOTS */}
         <div className="relative w-full z-10">
           <img 
             src="/maison.png" 
             alt="Maison" 
             className="w-full drop-shadow-2xl pointer-events-none" 
           />

           {/* LES SPOTS LUMINEUX INTERACTIFS OPAQUES */}
           
           {/* Chambre (Haut Gauche) - Inchangé */}
           <RoomSpot 
             icon={<BedDouble size={32} />} 
             onClick={() => handleRoomClick('chambre')} 
             className="top-[42%] left-[33%]" 
           />
           
           {/* Salle de Bain (Haut Droite) - Décalé de 50px vers la droite */}
           <RoomSpot 
             icon={<Bath size={32} />} 
             onClick={() => handleRoomClick('sdb')} 
             className="top-[42%] right-[calc(33%-50px)]" 
           />
           
           {/* Salon (Bas Gauche) - Inchangé */}
           <RoomSpot 
             icon={<Sofa size={32} />} 
             onClick={() => handleRoomClick('salon')} 
             className="bottom-[20%] left-[33%]" 
           />
           
           {/* Cuisine (Bas Droite) - Décalé de 50px vers la droite */}
           <RoomSpot 
             icon={<Utensils size={32} />} 
             onClick={() => handleRoomClick('cuisine')} 
             className="bottom-[20%] right-[calc(33%-50px)]" 
           />

         </div>
       </div>

       <NavigationDock />
    </div>
  );
};

// Composant "Spot Lumineux" (Opaque)
const RoomSpot = ({ icon, onClick, className }: { icon: React.ReactNode, onClick: () => void, className?: string }) => {
  return (
    <button 
      onClick={onClick} 
      className={`absolute z-30 p-4 rounded-full bg-[#00aeb7] text-white shadow-[0_0_25px_rgba(0,174,183,0.8)] hover:shadow-[0_0_40px_rgba(0,174,183,1)] hover:scale-110 hover:bg-[#008c93] transition-all duration-300 animate-pulse-slow -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {icon}
    </button>
  );
};