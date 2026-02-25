import { useNavigate } from 'react-router-dom';
import { Users, Tags, FileText, Gamepad2, ExternalLink, ArrowLeft, Plus, Heart } from 'lucide-react';

export const AdminLayout = ({ children, activeTab, setActiveTab, role, onAdd, formationTitle, configTitle }: any) => {
  const navigate = useNavigate();
  
  const getPageTitle = () => {
    switch (activeTab) {
      case 'users': return 'Gestion des Apprenants';
      case 'characters': return 'Bibliothèque des Résidents';
      case 'categories': return 'Catégories de Formation';
      case 'formations': return 'Catalogue de Formations';
      case 'games': return 'Jeux & Scénarios Immersifs';
      case 'edit-game': return `Édition : ${configTitle || 'Scénario'}`;
      case 'chapters': return `Contenu : ${formationTitle}`;
      default: return 'Administration ELPI';
    }
  };

  const hasAccessToGames = role === 'admin' || role === 'super_admin';

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex text-slate-900">
      <div className="w-64 bg-slate-900 text-white flex flex-col fixed h-screen z-30">
        <div className="p-8">
          <div className="text-2xl font-black tracking-tighter text-[#00aeb7] flex items-center gap-2">
            ELPI <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold uppercase tracking-widest">Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<Users size={20}/>} label="Apprenants" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon={<Heart size={20}/>} label="Interlocuteurs" active={activeTab === 'characters'} onClick={() => setActiveTab('characters')} />
          <NavItem icon={<Tags size={20}/>} label="Catégories" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
          <NavItem icon={<FileText size={20}/>} label="Formations" active={activeTab === 'formations' || activeTab === 'chapters'} onClick={() => setActiveTab('formations')} />
          
          {hasAccessToGames && (
            <NavItem 
              icon={<Gamepad2 size={20}/>} 
              label="Jeux & Config" 
              active={activeTab === 'games' || activeTab === 'edit-game'} 
              onClick={() => setActiveTab('games')} 
            />
          )}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={() => navigate('/app')} className="w-full flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors font-bold px-4 py-2">
            <ExternalLink size={16}/> Retour Application
          </button>
        </div>
      </div>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-10 py-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-6">
            {(activeTab === 'chapters' || activeTab === 'edit-game') && (
              <button 
                onClick={() => setActiveTab(activeTab === 'edit-game' ? 'games' : 'formations')}
                className="bg-slate-50 p-3 rounded-2xl text-[#00aeb7] hover:bg-[#00aeb7] hover:text-white transition-all shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{getPageTitle()}</h1>
          </div>
          
          <div className="flex gap-4">
            {activeTab !== 'edit-game' && activeTab !== 'chapters' && (
              <button 
                onClick={onAdd} 
                className="bg-[#00aeb7] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus size={18} /> Nouveau
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick} 
    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300
      ${active 
        ? 'bg-[#00aeb7] text-white shadow-xl shadow-[#00aeb7]/20 translate-x-2' 
        : 'hover:bg-slate-800 text-slate-400 hover:text-white hover:translate-x-1'
      }`}
  >
    <div className={`${active ? 'text-white' : 'text-[#00aeb7]'}`}>{icon}</div>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
  </div>
);