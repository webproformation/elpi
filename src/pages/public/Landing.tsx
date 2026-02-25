import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 -z-10" />
      <img src="/logo-elpi.png" alt="Logo Elpi" className="h-32 mb-8 drop-shadow-md" />
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center">
        Projet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#962588] to-[#00aeb7]">ELPI</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8">La formation professionnelle réinventée.</p>
      <button 
        onClick={() => navigate('/auth')}
        className="px-8 py-4 bg-[#962588] text-white rounded-xl font-bold text-xl shadow-lg hover:bg-[#7e1d72] transition flex items-center gap-2"
      >
        Commencer l'aventure <ArrowRight />
      </button>
    </div>
  );
};