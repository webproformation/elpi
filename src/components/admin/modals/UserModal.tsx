import React from 'react';
import { UserPlus, Edit2 } from 'lucide-react';

interface UserModalProps {
  isCreating: boolean;
  userData: any;
  setUserData: (data: any) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const UserModal = ({ isCreating, userData, setUserData, onSave, onClose }: UserModalProps) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-3">
          {isCreating ? <UserPlus className="text-[#00aeb7]" /> : <Edit2 className="text-[#00aeb7]" />}
          {isCreating ? 'Nouvel Apprenant' : 'Fiche Utilisateur'}
        </h2>
        <form onSubmit={onSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <input type="text" placeholder="Prénom" required className="p-4 bg-slate-50 border rounded-2xl outline-none" value={userData.first_name} onChange={e => setUserData({...userData, first_name: e.target.value})} />
            <input type="text" placeholder="Nom" required className="p-4 bg-slate-50 border rounded-2xl outline-none" value={userData.last_name} onChange={e => setUserData({...userData, last_name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <input type="email" placeholder="Email" required disabled={!isCreating} className="p-4 bg-slate-50 border rounded-2xl outline-none" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
            <input type="text" placeholder="Téléphone" className="p-4 bg-slate-50 border rounded-2xl outline-none" value={userData.phone} onChange={e => setUserData({...userData, phone: e.target.value})} />
          </div>
          {isCreating && <input type="password" placeholder="Mot de passe" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />}
          <textarea placeholder="Adresse postale complète" className="w-full p-4 bg-slate-50 border rounded-2xl h-24 outline-none resize-none" value={userData.address} onChange={e => setUserData({...userData, address: e.target.value})} />
          <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
            <option value="student">Apprenant (student)</option>
            <option value="admin">Administrateur (admin)</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <div className="flex gap-4 pt-6 border-t">
            <button type="button" onClick={onClose} className="flex-1 font-bold text-slate-400 py-4 rounded-2xl">Annuler</button>
            <button type="submit" className="flex-1 bg-[#00aeb7] text-white py-4 rounded-2xl font-bold shadow-lg">
              {isCreating ? 'Créer' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};