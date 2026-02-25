import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages Publiques
import { Landing } from './pages/public/Landing';
import { Auth } from './pages/auth/Auth';

// Composant de Protection et Tunnel
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Onboarding } from './pages/app/Onboarding';

// Pages Apprenant (App)
import { Hub } from './pages/app/Hub';
import { Profile } from './pages/app/Profile'; 
import { Ranking } from './pages/app/Ranking';
import { Catalog } from './pages/app/Catalog'; 
import { FormationView } from './pages/app/FormationView';

// Pages Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Jeux
import { SalonGame } from './features/games/salon/SalonGame';
import { ChambreGame } from './features/games/chambre/ChambreGame';
import { SdbGame } from './features/games/sdb/SdbGame';
import { CuisineGame } from './features/games/cuisine/CuisineGame';

// Styles globaux
import './index.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROUTES PUBLIQUES --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* --- ROUTES PROTÉGÉES (Apprenants & Admin) --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* Tunnel de première connexion */}
          <Route path="/app/onboarding" element={<Onboarding />} />

          {/* Hub et Espaces Apprenant */}
          <Route path="/app" element={<Hub />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/ranking" element={<Ranking />} />
          <Route path="/app/catalog" element={<Catalog />} />
          <Route path="/app/formation/:id" element={<FormationView />} />

          {/* Jeux Immersifs */}
          <Route path="/game/salon" element={<SalonGame />} />
          <Route path="/game/chambre" element={<ChambreGame />} />
          <Route path="/game/sdb" element={<SdbGame />} />
          <Route path="/game/cuisine" element={<CuisineGame />} />

          {/* Administration */}
          <Route path="/admin" element={<AdminDashboard />} />

        </Route>

        {/* --- FALLBACK --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;