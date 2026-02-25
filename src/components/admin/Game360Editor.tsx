import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Save, Info, Shield, Droplets, MessageCircle, Upload, ArrowLeft, Target, Loader2, ImageOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const Game360Editor = ({ config, onSave, onBack }: { config: any, onSave: (data: any) => void, onBack: () => void }) => {
  const [title, setTitle] = useState(config?.title || "");
  const [imageUrl, setImageUrl] = useState(config?.config_json?.imageUrl || "");
  const [hotspots, setHotspots] = useState<any[]>(config?.config_json?.hotspots || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config) {
      setTitle(config.title || "");
      setImageUrl(config.config_json?.imageUrl || "");
      setHotspots(config.config_json?.hotspots || []);
    }
  }, [config]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `360-backgrounds/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('game-assets').upload(filePath, file);
    if (!uploadError) {
      const { data } = supabase.storage.from('game-assets').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const addHotspot = (e: React.MouseEvent) => {
    if (!containerRef.current || !imageUrl || isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newH = { id: crypto.randomUUID(), x, y, title: "Nouveau point", description: "", impact: { security: 0, hygiene: 0, communication: 0 } };
    setHotspots([...hotspots, newH]);
    setSelectedId(newH.id);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setHotspots(hotspots.map(h => h.id === selectedId ? { ...h, x, y } : h));
  };

  const updateHotspot = (id: string, field: string, value: any) => {
    setHotspots(hotspots.map(h => {
      if (h.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { ...h, [parent]: { ...h[parent], [child]: value } };
        }
        return { ...h, [field]: value };
      }
      return h;
    }));
  };

  const selectedHotspot = hotspots.find(h => h.id === selectedId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 gap-6">
        <div className="flex-1 w-full">
          <button onClick={onBack} className="flex items-center gap-2 text-[#00aeb7] font-black text-[10px] uppercase tracking-widest mb-4 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={14} /> Retour à la liste
          </button>
          <input type="text" className="text-2xl font-black text-slate-800 bg-slate-50 border-none rounded-2xl w-full p-4 focus:ring-2 focus:ring-[#00aeb7] outline-none" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de la vue 360°" />
        </div>
        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-black text-xs flex items-center gap-2 transition-all uppercase tracking-widest">
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          {imageUrl ? "Changer l'image" : "Uploader Image 360"}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative aspect-video group select-none">
            {/* CORRECTION : On vérifie imageUrl avant de rendre l'image */}
            {imageUrl ? (
              <div ref={containerRef} className="relative w-full h-full cursor-crosshair" onClick={addHotspot} onMouseMove={handleDrag} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}>
                <img src={imageUrl} alt="360 view" className="w-full h-full object-cover pointer-events-none opacity-90" />
                {hotspots.map((h) => (
                  <div key={h.id} className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all shadow-lg cursor-move ${selectedId === h.id ? 'bg-[#00aeb7] border-white scale-125 z-30 ring-4 ring-[#00aeb7]/20' : 'bg-white/80 border-[#00aeb7] z-20 hover:scale-110'}`} style={{ left: `${h.x}%`, top: `${h.y}%` }} onMouseDown={(e) => { e.stopPropagation(); setSelectedId(h.id); setIsDragging(true); }}>
                    <div className={`w-2 h-2 rounded-full ${selectedId === h.id ? 'bg-white' : 'bg-[#00aeb7]'}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <ImageOff size={48} className="opacity-20" />
                <p className="font-bold text-xs uppercase tracking-widest">Veuillez uploader une image panoramique</p>
              </div>
            )}
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] text-white font-black uppercase tracking-[0.2em] border border-white/20 shadow-xl pointer-events-none">Cliquez pour créer • Glissez pour déplacer</div>
          </div>
        </div>

        <div className="space-y-6">
          {selectedHotspot ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Édition du Point</h4>
                <button onClick={() => { setHotspots(hotspots.filter(h => h.id !== selectedId)); setSelectedId(null); }} className="text-red-400 hover:text-red-600 transition-colors p-2"><Trash2 size={18} /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Titre du point</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#00aeb7]" value={selectedHotspot.title} onChange={(e) => updateHotspot(selectedHotspot.id, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Description pédagogique</label>
                  <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm h-32 focus:ring-2 focus:ring-[#00aeb7] resize-none italic font-medium" value={selectedHotspot.description} onChange={(e) => updateHotspot(selectedHotspot.id, 'description', e.target.value)} />
                </div>
                <div className="space-y-3 pt-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Impacts ELPI</h5>
                  <ImpactInput icon={<Shield size={14}/>} color="text-blue-500" label="Sécurité" value={selectedHotspot.impact?.security} onChange={(v:any) => updateHotspot(selectedHotspot.id, 'impact.security', parseInt(v))} />
                  <ImpactInput icon={<Droplets size={14}/>} color="text-green-500" label="Hygiène" value={selectedHotspot.impact?.hygiene} onChange={(v:any) => updateHotspot(selectedHotspot.id, 'impact.hygiene', parseInt(v))} />
                  <ImpactInput icon={<MessageCircle size={14}/>} color="text-purple-500" label="Dialogue" value={selectedHotspot.impact?.communication} onChange={(v:any) => updateHotspot(selectedHotspot.id, 'impact.communication', parseInt(v))} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
              <Target size={32} className="text-slate-200" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">Sélectionnez un point sur l'image pour le configurer.</p>
            </div>
          )}
        </div>
      </div>
      <button onClick={() => onSave({ title, config_json: { imageUrl, hotspots } })} className="fixed bottom-10 right-10 z-50 bg-[#00aeb7] text-white px-10 py-6 rounded-full font-black shadow-2xl hover:bg-[#008c93] hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"><Save size={20} /> Enregistrer</button>
    </div>
  );
};

const ImpactInput = ({ icon, color, label, value, onChange }: any) => (
  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
    <div className="flex items-center gap-3"><div className={`${color} bg-white p-2.5 rounded-xl shadow-sm border border-slate-100`}>{icon}</div><span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{label}</span></div>
    <input type="number" className="w-16 p-2 text-xs font-black border-none bg-white rounded-xl text-center shadow-sm focus:ring-2 focus:ring-[#00aeb7]" value={value || 0} onChange={(e) => onChange(e.target.value)} />
  </div>
);