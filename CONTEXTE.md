# CAHIER DES CHARGES ET ÉTAT DES LIEUX : PROJET ELPI

## ⚠️ PROTOCOLE DE DÉVELOPPEMENT STRICT (À LIRE AVANT CHAQUE SESSION) ⚠️
1. **Interdiction absolue de résumer ou tronquer :** Tout code fourni doit être **intégral et complet**. Les commentaires du type `// ... reste du code` ou `// ... vues précédentes` sont des erreurs critiques interdites.
2. **Préservation du UI/UX :** Les placeholders, les icônes (lucide-react), les styles Tailwind complexes (arrondis, ascenseurs internes, flexbox) et les indications de saisie sont des spécifications fonctionnelles intangibles.
3. **Règle des 200 lignes :** Si un fichier s'approche des 200 lignes, **l'IA doit proposer de scinder le code** en créant de nouveaux fichiers (ex: sous-composants) plutôt que de simplifier la logique.
4. **Plan de vol (Checklist) :** Avant de générer du code complexe, l'IA doit formuler un "Plan de vol" listant ce qu'elle va coder ET les éléments existants qu'elle s'engage à conserver intacts.

---

## 1. PRÉSENTATION DU PROJET
ELPI est une plateforme de formation immersive destinée au personnel des EHPAD. Elle combine des parcours de formation théoriques classiques (textes, PDF, vidéos) avec des mini-jeux interactifs situés dans un environnement virtuel ("La Maison de Suzie"). L'objectif est de certifier des compétences transverses (Hygiène, Sécurité, Communication) via l'acquisition de badges basés sur les performances réelles.

---

## 2. 📌 RÉALISÉ (Session du 19/02)

### A. Administration & Édition (Opérationnel)
* **Correction de l'Éditeur :** Le `GameScenarioEditor.tsx` est désormais synchronisé. Il permet de modifier le **Titre** du scénario et de visualiser/éditer les étapes du Smoke Test (auparavant invisibles).
* **Sauvegarde Hybride :** `AdminDashboard.tsx` enregistre maintenant simultanément le titre (champ texte) et la configuration technique (JSON).
* **Gestion des Interlocuteurs :** Bibliothèque globale de personnages avec gestion des émotions (Heureux, Neutre, Confus, Colère) et dossiers cliniques.

### B. Moteur de Jeu & Pédagogie (Opérationnel)
* **GameMechanicSelector :** Implémentation d'un répartiteur universel. Le système peut désormais lancer différentes mécaniques (`dialogue`, `360`, `error`, `report`) dans n'importe quelle pièce de la maison.
* **Logique de Badge (Différentiel) :** Calcul de performance basé sur l'amplitude Min/Max du scénario. Éviter un piège (ex: -10 points) est comptabilisé comme une progression vers le badge Expert.
* **Navigation Dock :** Mise à jour des labels (Hub, Formations, Compétences, Profil).

### C. HUD & Data (Opérationnel)
* **HUD Dynamique :** Connexion réelle à Supabase. Les jauges de compétences (Sécurité, Hygiène, Communication) affichent la moyenne réelle de l'élève.
* **Schéma SQL :** Table `game_scores` enrichie avec `performance_percentage`, les scores détaillés ELPI et la date de complétion.
* **Sécurité RLS :** Politiques de sécurité activées pour permettre aux élèves d'enregistrer leurs scores de manière autonome.

---

## 3. 🚀 À FAIRE (Objectifs Restants)

### A. Nouvelles Mécaniques de Gameplay (À Prototyper)
* **"Cherchez l'erreur" :** Moteur d'analyse d'image ou de scène avec points critiques à identifier.
* **"Vue 360°" :** Exploration immersive d'une pièce avec "Hotspots" pédagogiques.
* **"Le Maître des Transmissions" :** Module de rédaction de compte-rendu après un soin ou un entretien.

### B. Expansion du Contenu
* **Duplication des Pièces :** Appliquer la logique du Salon (tirage aléatoire de scénarios) à la **Cuisine**, la **Salle de Bain** et la **Chambre**.
* **Système d'XP :** Création d'une barre de niveau globale sur le profil apprenant.

---

## 4. 💡 PROPOSITIONS DE JEUX SUPPLÉMENTAIRES (MÉMOIRE)

* **L'Oreille Absolute (Communication) :** Décoder le non-verbal via des clips audio (soupirs, intonations) ou des gros plans sur le regard des résidents.
* **La Ronde de Minuit (Sécurité) :** Jeu chronométré à la lampe torche pour repérer les dangers nocturnes (tapis, barrières, obstacles).
* **Le Plateau Témoin (Hygiène/Nutrition) :** Analyser les restes d'un repas pour détecter des troubles cliniques (fausses routes, perte d'appétit).
* **Hygiène Détective (360°) :** Identifier les ruptures de la chaîne d'asepsie lors d'une séquence de soin animée.

---

## 5. 🛠️ NOUVELLES FONCTIONNALITÉS À ÉTUDIER

* **Mode "Urgence Critique" :** Événements aléatoires sur le Hub (malaise, alarme) avec 30 secondes pour agir dans l'ordre ELPI.
* **Journal de Réflexion :** Zone de saisie post-jeu pour l'auto-évaluation de l'élève, consultable par le formateur.
* **Simulateur de Relève :** Écoute d'une transmission orale rapide suivie d'un test de saisie des données cruciales.
* **Compétition de Service :** Classements par équipes (Équipe de jour vs Nuit) pour stimuler l'engagement.

---

## 6. ARCHITECTURE DE LA BASE DE DONNÉES (SUPABASE)
* **Tables :** `profiles`, `formations`, `categories`, `contents`, `enrollments`, `user_progress`, `game_configs`, `game_characters`, `game_scores`, `badges`, `user_badges`.
* **RLS :** Politiques d'accès granulaires par rôle (`student`, `formateur`, `admin`, `super_admin`).