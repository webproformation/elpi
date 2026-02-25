import React from 'react';

interface AccessModalProps {
  user: any;
  categories: any[];
  formations: any[];
  userEnrollments: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export const AccessModal = ({ user, categories, formations, userEnrollments, onToggle, onClose }: AccessModalProps) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Accorder des accès</h2>
        <p className="text-sm text-slate-500 mb-8">Inscrire <b>{user?.first_name || user?.full_name}</b> aux formations :</p>
        <div className="space-y-6 mb-10">
          {categories.map(cat => {
            const catFormations = formations.filter(f => f.category_id === cat.id);
            if (catFormations.length === 0) return null;
            return (
              <div key={cat.id}>
                <h3 className="text-[10px] font-black text-[#00aeb7] uppercase border-b pb-2 mb-4 tracking-widest">{cat.name}</h3>
                <div className="space-y-3">
                  {catFormations.map(f => (
                    <label key={f.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition shadow-sm border border-transparent hover:border-slate-200">
                      <input type="checkbox" className="w-5 h-5 accent-[#00aeb7] rounded-lg" checked={userEnrollments.includes(f.id)} onChange={() => onToggle(f.id)} />
                      <span className="font-bold text-slate-700 text-sm">{f.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="w-full py-5 bg-[#00aeb7] text-white rounded-2xl font-bold shadow-xl hover:bg-[#008c93]">Terminer</button>
      </div>
    </div>
  );
};