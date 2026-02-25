// Exemple pour ChambreGame.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ChambreGame = () => { // Changez le nom ici : CuisineGame, ChambreGame, SdbGame
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-purple-500">Jeu de la Chambre</h1> {/* Changez le titre */}
      <p className="mb-8">Le module est en cours de refactoring...</p>
      <button onClick={() => navigate('/app')} className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold flex items-center gap-2">
        <ArrowLeft /> Retour Maison
      </button>
    </div>
  );
};