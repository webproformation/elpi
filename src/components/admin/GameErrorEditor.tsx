import { useState, useEffect, useRef } from 'react';
import { 
  Trash2, Save, Upload, Target, Loader2, VideoOff, 
  Clock, Maximize2, Link2, Play, Pause 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GameErrorEditorProps {
  config: any;
  contents?: any[];
  onSave: (data: any) => void;
  // Note: onBack supprimé car non utilisé dans ce composant
}

export const GameErrorEditor = ({ config, contents = [], onSave }: GameErrorEditorProps) => {
  const [title, setTitle] = useState(config?.title || "");
  const [videoUrl, setVideoUrl] = useState(config?.config_json?.videoUrl || "");
  const [errors, setErrors] = useState<any[]>(config?.config_json?.errors || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config) {
      setTitle(config.title || "");
      setVideoUrl(config.config_json?.videoUrl || "");
      setErrors(config.config_json?.errors || []);
    }
  }, [config]);

  const sanitizeFileName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.\-_]/g, '');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    
    const file = e.target.files[0];
    const cleanName = sanitizeFileName(file.name);
    const fileName = `${Date.now()}-${cleanName}`;

    try {
      const { error: upErr } = await supabase.storage
        .from('game-assets')
        .upload(`videos/${fileName}`, file);

      if (upErr) throw upErr;

      const { data } = supabase.storage
        .from('game-assets')
        .getPublicUrl(`videos/${fileName}`);

      if (data?.publicUrl) {
        setVideoUrl(data.publicUrl);
      }
    } catch (err: any) {
      console.error("Erreur Upload:", err.message);
      alert("Erreur lors de l'upload : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addErrorZone = (e: React.MouseEvent) => {
    if (!containerRef.current || !videoUrl) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newError = { 
      id: crypto.randomUUID(), 
      x, y, 
      size: 60,
      startTime: Math.max(0, currentTime - 0.5), 
      endTime: currentTime + 1.5, 
      title: "Nouvelle erreur", 
      explanation: "", 
      contentId: "", 
      impact: { security: 0, hygiene: 0 } 
    };
    setErrors([...errors, newError]);
    setSelectedId(newError.id);
  };

  const updateError = (id: string, field: string, value: any) => {
    setErrors(errors.map(err => {
      if (err.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return { ...err, [parent]: { ...err[parent], [child]: value } };
        }
        return { ...err, [field]: value };
      }
      return err;
    }));
  };

  const selectedError = errors.find(e => e.id === selectedId);

  return (
    <div className="space-y-8 pb-24 font-sans animate-in fade-in duration-500">
      
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Titre du scénario vidéo</label>
            <input 
              type="text" 
              className="text-3xl font-black text-slate-800 bg-slate-50 border-none rounded-3xl w-full p-4 focus:ring-4 focus:ring-orange-500/10 outline-none" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Titre..." 
            />
        </div>
        <label className="cursor-pointer bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs flex items-center gap-3 transition-all uppercase tracking-widest shadow-xl hover:bg-black active:scale-95">
          {uploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />} 
          {videoUrl ? "Remplacer la vidéo" : "Uploader la vidéo MP4"}
          <input type="file" className="hidden" accept="video/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white relative aspect-video">
            {videoUrl ? (
              <div ref={containerRef} className="relative w-full h-full cursor-crosshair" onClick={addErrorZone}>
                <video 
                  ref={videoRef} 
                  src={videoUrl} 
                  className="w-full h-full object-contain" 
                  onTimeUpdate={(e: any) => setCurrentTime(e.target.currentTime)} 
                />
                
                {errors.filter(err => currentTime >= err.startTime && currentTime <= err.endTime).map((err) => (
                  <div 
                    key={err.id} 
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex items-center justify-center transition-all shadow-xl pointer-events-none 
                      ${selectedId === err.id ? 'border-orange-500 bg-orange-500/20 scale-110 z-30' : 'border-white/50 bg-white/10 z-20'}`} 
                    style={{ left: `${err.x}%`, top: `${err.y}%`, width: `${err.size}px`, height: `${err.size}px` }}
                  >
                    <Target size={err.size / 3} className="text-white opacity-50" />
                  </div>
                ))}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-6 border border-white/10 shadow-2xl">
                   <button 
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (videoRef.current?.paused) {
                          videoRef.current.play();
                          setIsPlaying(true);
                        } else {
                          videoRef.current?.pause();
                          setIsPlaying(false);
                        }
                      }} 
                      className="text-white hover:text-orange-400 transition-colors"
                   >
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                   </button>
                   <div className="text-[10px] font-black text-white tabular-nums uppercase tracking-widest">
                      {Math.floor(currentTime)}s / {videoRef.current ? Math.floor(videoRef.current.duration) : 0}s
                   </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-800">
                <VideoOff size={64} className="opacity-20" />
                <p className="font-black text-xs uppercase tracking-widest">Aucune vidéo sélectionnée</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {selectedError ? (
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-right-4 h-full overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="flex justify-between items-center border-b pb-4">
                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2">
                  <Target size={16} className="text-orange-500" /> Erreur détectée
                </h4>
                <button onClick={() => { setErrors(errors.filter(e => e.id !== selectedId)); setSelectedId(null); }} className="text-red-400 hover:text-red-600 p-2">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Clock size={10}/> Début (sec)</label>
                        <input type="number" step="0.1" className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold" value={selectedError.startTime} onChange={(e) => updateError(selectedError.id, 'startTime', parseFloat(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Clock size={10}/> Fin (sec)</label>
                        <input type="number" step="0.1" className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold" value={selectedError.endTime} onChange={(e) => updateError(selectedError.id, 'endTime', parseFloat(e.target.value))} />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Maximize2 size={10}/> Taille</label>
                    <input type="range" min="40" max="150" className="w-full accent-orange-500" value={selectedError.size} onChange={(e) => updateError(selectedError.id, 'size', parseInt(e.target.value))} />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Titre</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={selectedError.title} onChange={(e) => updateError(selectedError.id, 'title', e.target.value)} />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Explication pédagogique</label>
                    <textarea 
                      className="w-full p-4 bg-slate-50 border-none rounded-xl text-xs h-24 resize-none italic font-medium leading-relaxed shadow-inner" 
                      value={selectedError.explanation} 
                      onChange={(e) => updateError(selectedError.id, 'explanation', e.target.value)} 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Link2 size={10}/> Cours associé</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border-none rounded-xl text-[10px] font-bold outline-none" 
                      value={selectedError.contentId} 
                      onChange={(e) => updateError(selectedError.id, 'contentId', e.target.value)}
                    >
                        <option value="">Sélectionner un contenu...</option>
                        {contents.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Sécurité</label>
                    <input type="number" className="w-full p-2 text-xs font-black border-none bg-slate-50 rounded-xl text-center shadow-inner" value={selectedError.impact?.security || 0} onChange={(e) => updateError(selectedError.id, 'impact.security', parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Hygiène</label>
                    <input type="number" className="w-full p-2 text-xs font-black border-none bg-slate-50 rounded-xl text-center shadow-inner" value={selectedError.impact?.hygiene || 0} onChange={(e) => updateError(selectedError.id, 'impact.hygiene', parseInt(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border-4 border-dashed border-orange-100 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
              <Target size={48} className="text-orange-200" />
              <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">Cliquez sur une zone de la vidéo pour ajouter une erreur.</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => onSave({ title, config_json: { videoUrl, errors } })} 
        className="fixed bottom-10 right-10 z-50 bg-[#962588] text-white px-12 py-6 rounded-full font-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-sm border-b-8 border-black active:border-b-0 active:translate-y-2"
      >
        <Save size={24} /> Enregistrer le Scénario Vidéo
      </button>
    </div>
  );
};