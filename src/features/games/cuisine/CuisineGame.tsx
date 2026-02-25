import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const CuisineGame = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-green-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Jeu de la Cuisine</h1>
      <p className="mb-8">Service et HACCP (En construction)</p>
      <button onClick={() => navigate('/app')} className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold flex items-center gap-2">
        <ArrowLeft /> Retour Maison
      </button>
    </div>
  );
};