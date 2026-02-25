import React from 'react';
import { Edit2, Plus, Tags, FileText, Link as LinkIcon, Gamepad2, X, MessageSquare, Rotate3d, Target } from 'lucide-react';
import { Editor } from '../Editor';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  data: any;
  setData: (data: any) => void;
}

export const ChapterModal = ({ show, onClose, onSave, data, setData, editingId }: any) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-[2rem] p-10 max-w-3xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">{editingId ? <Edit2 className="text-[#00aeb7]" /> : <Plus className="text-[#00aeb7]" />} Chapitre</h2>
        <form onSubmit={onSave} className="space-y-6">
          <input type="text" placeholder="Titre" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
          <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
            {['video', 'pdf', 'text'].map(t => (
              <button key={t} type="button" onClick={() => setData({...data, type: t as any})} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${data.type === t ? 'bg-[#00aeb7] text-white shadow-md' : 'text-slate-500'}`}>{t.toUpperCase()}</button>
            ))}
          </div>
          {data.type === 'text' ? <Editor content={data.content} onChange={(html) => setData({...data, content: html})} /> : <div className="relative"><LinkIcon className="absolute left-4 top-5 w-5 h-5 text-slate-400" /><input type="text" placeholder="Lien URL" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none" value={data.url} onChange={e => setData({...data, url: e.target.value})} /></div>}
          <div className="flex gap-4 pt-4 border-t mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Annuler</button>
            <button type="submit" className="flex-1 bg-[#00aeb7] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#008c93]">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CategoryModal = ({ show, onClose, onSave, data, setData }: ModalProps) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Tags className="text-[#962588]" /> Nouvelle Catégorie</h2>
        <form onSubmit={onSave} className="space-y-6">
          <input type="text" placeholder="Nom" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-400">Annuler</button>
            <button type="submit" className="w-full bg-[#962588] text-white py-4 rounded-2xl font-bold shadow-lg">Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const FormationModal = ({ show, onClose, onSave, data, setData, categories }: any) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><FileText className="text-[#00aeb7]" /> Nouveau Parcours</h2>
        <form onSubmit={onSave} className="space-y-6">
          <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none" value={data.category_id} onChange={e => setData({...data, category_id: e.target.value})}>
            <option value="">Sélectionner une catégorie...</option>
            {categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="text" placeholder="Titre" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-400">Annuler</button>
            <button type="submit" className="w-full bg-[#00aeb7] text-white py-4 rounded-2xl font-bold shadow-lg">Créer</button>
          </div>
        </form>
      </div>
    </div>
  );
};