// src/types.ts

export type ViewState = 'landing' | 'create-account' | 'hub' | 'profile' | 'ranking' | 'game-salon' | 'game-chambre' | 'game-sdb';

export type UserData = {
  email: string;
  name: string;
  avatar: string;
};

// Les 3 nouvelles compétences demandées
export type Stats = {
  security: number;      // Sécurité 🛡️
  hygiene: number;       // Hygiène ✨
  communication: number; // Communication 💬
};