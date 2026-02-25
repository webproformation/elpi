import { supabase } from './supabase';

/**
 * Enregistre un score pour un jeu spécifique
 * @param userId L'ID de l'élève connecté
 * @param gameId Le nom du jeu ('cuisine', 'salon', 'sdb', 'chambre')
 * @param score Le score obtenu
 */
export const saveGameScore = async (userId: string, gameId: string, score: number) => {
  const { error } = await supabase
    .from('game_scores')
    .insert([{ 
      user_id: userId, 
      game_id: gameId, 
      score: score 
    }]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score:", error.message);
    return false;
  }
  return true;
};