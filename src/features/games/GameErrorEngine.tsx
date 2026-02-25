import React, { useState, useRef } from 'react';
import { Target, CheckCircle2, Play, Zap, VideoOff } from 'lucide-react';
import { GameResults } from './GameResults';

export const GameErrorEngine = ({ scenario, onClose }: any) => {
  const { videoUrl, errors = [] } = scenario.config_json || {};
  
  // Mapping des images de fond par pièce
  const roomBackgrounds: Record<string, string> = {
    'salon': '/salon.png',
    'cuisine': '/cuisine.png',
    'chambre': '/chambre.png',
    'salle de bain': '/sdb.png'
  };

  const bgImage = roomBackgrounds[scenario.game_type?.toLowerCase()] || '/salon.png';

  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scores, setScores] = useState({ security: 0, hygiene: 0, communication: 0 });
  const [showResults, setShowResults] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSceneClick = (e: React.MouseEvent, err: any) => {
    e.stopPropagation();
    if (foundIds.includes(err.id)) return;
    setScores(prev => ({
      security: prev.security + (err.impact?.security || 0),
      hygiene: prev.hygiene + (err.impact?.hygiene || 0),
      communication: prev.communication + (err.impact?.communication || 0),
    }));
    setFoundIds(prev => [...prev, err.id]);
  };

  if (showResults) return <GameResults scenario={scenario} finalScores={scores} onFinish={onClose} />;

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
      
      {/* IMAGE DE FOND DYNAMIQUE */}
      <div className="fixed inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover" alt="Lieu" />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto p-6 flex flex-col gap-6">
        
        {/* HUD */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-2xl">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg"><Target size={24}/></div>
            <div>
              <h2 className="font-black uppercase tracking-tighter text-lg leading-none">{scenario.title}</h2>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Vigilance Vidéo : {scenario.game_type}</p>
            </div>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-4 border border-white/10">
            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
              <CheckCircle2 size={18} className="text-green-400" />
              <span className="tabular-nums">{foundIds.length} / {errors.length}</span>
            </div>
            <div className="tabular-nums text-[#00aeb7]">{Math.floor(currentTime)}s</div>
          </div>
        </div>

        {/* LECTEUR VIDÉO */}
        <div className="bg-black rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white/10 relative aspect-video group">
          {videoUrl ? (
            <div className="relative w-full h-full">
              <video 
                ref={videoRef} 
                src={videoUrl} 
                className="w-full h-full object-contain" 
                onTimeUpdate={(e: any) => setCurrentTime(e.target.currentTime)} 
                onEnded={() => setShowResults(true)} 
              />
              {errors.map((err: any) => {
                const isVisible = currentTime >= err.startTime && currentTime <= err.endTime;
                if (!isVisible) return null;
                return (
                  <button key={err.id} onClick={(e) => handleSceneClick(e, err)} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all flex items-center justify-center ${foundIds.includes(err.id) ? 'bg-green-500 border-4 border-white scale-110 shadow-lg' : 'bg-transparent hover:bg-white/10 opacity-0 hover:opacity-100 hover:border-white/40 border-2 border-transparent'}`} style={{ left: `${err.x}%`, top: `${err.y}%`, width: `${err.size}px`, height: `${err.size}px` }}>
                    {foundIds.includes(err.id) ? <CheckCircle2 className="text-white" size={err.size / 2} /> : <Zap className="text-white/20 animate-pulse" size={err.size / 3} />}
                  </button>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                 {!isPlaying && <button onClick={() => { videoRef.current?.play(); setIsPlaying(true); }} className="bg-white/20 backdrop-blur-xl p-8 rounded-full text-white shadow-2xl hover:scale-110 transition-all border-4 border-white/30 pointer-events-auto"><Play size={48} fill="currentColor" /></button>}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <VideoOff size={48} className="opacity-20" />
              <p className="font-black text-xs uppercase tracking-widest italic">Séquence en attente...</p>
            </div>
          )}
        </div>

        <div className="bg-white/5 border-4 border-dashed border-white/20 rounded-[3rem] p-10 text-center flex flex-col items-center justify-center gap-3">
          <Target size={32} className="text-white opacity-20" />
          <p className="text-white font-bold uppercase tracking-[0.3em] text-[10px] opacity-40">Analysez la scène et identifiez les erreurs en temps réel</p>
        </div>
      </div>
    </div>
  );
};