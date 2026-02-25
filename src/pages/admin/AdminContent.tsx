import { Loader2, Phone, MapPin, Info, Lock, Edit2, Trash2, Video, FileText as FileIcon, HeartPulse, Pill, Utensils } from 'lucide-react';
import { GameScenarioEditor } from '../../components/admin/GameScenarioEditor';
import { Game360Editor } from '../../components/admin/Game360Editor'; 
import { GamePlanningEditor } from '../../components/admin/GamePlanningEditor';
import { GameErrorEditor } from '../../components/admin/GameErrorEditor';

export const AdminContent = ({ activeTab, loading, data, selection, onUserResults, onUserAccess, onUserEdit, onManageChapters, onEditScenario, onDelete, onEditChapter, onSaveScenario, onBack }: any) => {
  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin w-8 h-8 text-[#00aeb7]" /></div>;

  const isEditing = activeTab === 'edit-game';

  return (
    <div className={`${isEditing ? '' : 'bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden min-h-[600px]'}`}>
      
      {/* VUE PERSONNAGES */}
      {activeTab === 'characters' && (
        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.characters?.map((c: any) => (
            <div key={c.id} className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 flex gap-6 group hover:shadow-xl transition-all">
              <div className="w-32 h-32 rounded-[2rem] bg-white shadow-inner overflow-hidden border-4 border-white flex-shrink-0">
                <img src={c.assets?.neutral || '/icone-perso.png'} className="w-full h-full object-cover" alt={c.first_name} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-xl text-slate-800 uppercase tracking-tighter">{c.first_name} {c.last_name}</h3>
                  <button onClick={() => onDelete('game_characters', c.id)} className="text-red-300 hover:text-red-500 transition-colors p-1"><Trash2 size={18}/></button>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">{c.description || 'Pas de biographie renseignée.'}</p>
                <div className="flex gap-2 pt-3">
                  {c.medical_history && <div className="p-2 bg-purple-100 text-purple-700 rounded-xl" title={c.medical_history}><HeartPulse size={16}/></div>}
                  {c.medications && <div className="p-2 bg-blue-100 text-blue-700 rounded-xl" title={c.medications}><Pill size={16}/></div>}
                  {c.dietary_info && <div className="p-2 bg-green-100 text-green-700 rounded-xl" title={c.dietary_info}><Utensils size={16}/></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VUE UTILISATEURS */}
      {activeTab === 'users' && (
        <table className="w-full text-left font-sans">
          <thead className="bg-slate-50 border-b"><tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]"><th className="p-8">Apprenant</th><th className="p-8">Contact</th><th className="p-8 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data.users?.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-8"><div className="font-black text-slate-800 uppercase tracking-tighter text-lg">{u.full_name || '(Sans nom)'}</div><div className="text-xs text-slate-400 font-medium">{u.email}</div></td>
                <td className="p-8"><div className="text-xs font-bold text-slate-600 flex items-center gap-1"><Phone size={12} className="text-[#00aeb7]"/> {u.phone || '-'}</div><div className="text-[10px] text-slate-400 font-bold mt-1 uppercase"><MapPin size={10} className="inline mr-1"/> {u.address || '-'}</div></td>
                <td className="p-8 text-right flex justify-end gap-3">
                    <button onClick={() => onUserResults(u)} className="flex items-center gap-1 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-[#962588] transition-colors"><Info size={14}/> Résultats</button>
                    <button onClick={() => onUserAccess(u)} className="flex items-center gap-1 text-[#00aeb7] font-black text-[10px] uppercase tracking-widest hover:underline"><Lock size={14}/> Accès</button>
                    <button onClick={() => onUserEdit(u)} className="flex items-center gap-1 text-blue-500 font-black text-[10px] uppercase tracking-widest hover:underline"><Edit2 size={14}/> Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* VUE CATÉGORIES */}
      {activeTab === 'categories' && (
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.categories?.map((cat: any) => (
            <div key={cat.id} className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 flex justify-between items-center shadow-sm hover:shadow-xl transition-all">
              <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">{cat.name}</h4>
              <button onClick={() => onDelete('categories', cat.id)} className="text-red-300 hover:text-red-500 transition-colors p-2"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>
      )}

      {/* VUE FORMATIONS */}
      {activeTab === 'formations' && (
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.formations?.map((f: any) => (
            <div key={f.id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all relative">
              <span className="text-[9px] font-black uppercase text-[#00aeb7] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-4 inline-block tracking-widest">{f.categories?.name || 'Sans catégorie'}</span>
              <h3 className="font-black text-slate-800 text-xl mb-8 line-clamp-2 uppercase tracking-tighter leading-none">{f.title}</h3>
              <div className="flex gap-3">
                <button onClick={() => onManageChapters(f)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00aeb7] transition-all shadow-md">Gérer chapitres <Edit2 size={14} /></button>
                <button onClick={() => onDelete('formations', f.id)} className="p-4 text-red-300 hover:text-red-500 border border-slate-100 rounded-2xl hover:bg-red-50"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VUE JEUX CONFIG (LISTE) */}
      {activeTab === 'games' && (
        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          {data.gameConfigs?.map((cfg: any) => ( 
            <div key={cfg.id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm border-l-8 border-l-[#962588] relative hover:shadow-xl transition-all">
              <span className="text-[9px] font-black uppercase text-[#962588] bg-purple-50 px-3 py-1 rounded-full mb-4 inline-block tracking-widest">{cfg.mechanic}</span>
              <h3 className="font-black text-slate-800 text-xl mb-8 line-clamp-2 uppercase tracking-tighter leading-none">{cfg.title}</h3>
              <div className="flex gap-3">
                <button onClick={() => onEditScenario(cfg)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg">Modifier <Edit2 size={14} /></button>
                <button onClick={() => onDelete('game_configs', cfg.id)} className="p-4 text-red-300 hover:text-red-500 border border-slate-100 rounded-2xl hover:bg-red-50"><Trash2 size={20} /></button>
              </div>
            </div> 
          ))}
        </div>
      )}

      {/* ÉDITION DU JEU - BASCULE ENTRE LES ÉDITEURS */}
      {activeTab === 'edit-game' && selection.config && (
        <div className="animate-in fade-in duration-500">
          {selection.config.mechanic === 'planning' ? (
            <GamePlanningEditor 
              config={selection.config}
              characters={data.characters} 
              onSave={onSaveScenario}
            />
          ) : selection.config.mechanic === '360' ? (
            <Game360Editor 
              config={selection.config}
              onSave={onSaveScenario}
              onBack={onBack}
            />
          ) : selection.config.mechanic === 'error' ? (
            <GameErrorEditor 
              config={selection.config}
              contents={data.chapters}
              onSave={onSaveScenario}
            />
          ) : (
            <GameScenarioEditor 
              config={selection.config}
              onSave={onSaveScenario}
              onDelete={(id: string) => onDelete('game_configs', id)}
            />
          )}
        </div>
      )}

      {/* VUE CHAPITRES (LISTE) */}
      {activeTab === 'chapters' && (
        <div className="p-10 space-y-4">
          {data.chapters?.map((chap: any) => (
            <div key={chap.id} className="bg-slate-50 border rounded-[2rem] p-6 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl shadow-sm ${chap.type === 'video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {chap.type === 'video' ? <Video size={24} /> : <FileIcon size={24} />}
                </div>
                <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{chap.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Format : {chap.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEditChapter(chap)} className="p-3 text-blue-400 hover:text-blue-600 transition-colors"><Edit2 size={24} /></button>
                <button onClick={() => onDelete('contents', chap.id)} className="p-3 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={24} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};