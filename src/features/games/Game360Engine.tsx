import React, { useState, useRef } from 'react';
import { 
  Target, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  ImageOff,
  MoveHorizontal
} from 'lucide-react';
import { GameResults } from './GameResults';

interface Game360EngineProps {
  scenario: any;
  onClose: () => void;
}

export const Game360Engine = ({ scenario, onClose }: Game360EngineProps) => {
  // Extraction sécurisée depuis config_json
  const config = scenario?.config_json || {};
  const imageUrl = config.imageUrl || "";
  const hotspots = config.hotspots || [];
  
  // ÉTATS DU JEU
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [lastFound, setLastFound] = useState<any>(null);
  const [scores, setScores] = useState({ security: 0, hygiene: 0, communication: 0 });
  const [showResults, setShowResults] = useState(false);

  // ÉTATS DE NAVIGATION
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: any) => {
    if (!viewerRef.current) return;
    setIsDragging(true);
    const x = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
    setStartX(x - viewerRef.current.offsetLeft);
    setScrollLeft(viewerRef.current.scrollLeft);
  };

  const handleDragMove = (e: any) => {
    if (!isDragging || !viewerRef.current) return;
    e.preventDefault();
    const x = e.pageX || (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
    const walk = (x - viewerRef.current.offsetLeft - startX) * 1.5; 
    viewerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handlePointClick = (e: React.MouseEvent, h: any) => {
    e.stopPropagation();
    if (foundIds.includes(h.id)) return;

    // Mise à jour des scores ELPI
    setScores(prev => ({
      security: prev.security + (h.impact?.security || 0),
      hygiene: prev.hygiene + (h.impact?.hygiene || 0),
      communication: prev.communication + (h.impact?.communication || 0),
    }));

    setFoundIds(prev => [...prev, h.id]);
    setLastFound(h);
  };

  if (showResults) {
    return <GameResults scenario={scenario} finalScores={scores} onFinish={onClose} />;
  }

  const allFound = hotspots.length > 0 && foundIds.length === hotspots.length;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-1000 font-sans px-4">
      
      <div className="relative group">
        <div 
          ref={viewerRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={() => setIsDragging(false)}
          className={`relative bg-slate-900 rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl aspect-[21/9] select-none cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-inner' : ''}`}
        >
          {/* VÉRIFICATION DE L'IMAGE POUR ÉVITER L'ÉCRAN NOIR */}
          {imageUrl && imageUrl.trim() !== "" ? (
            <div className="relative h-full w-[200%] md:w-[150%]">
              <img 
                src={imageUrl} 
                alt="360 view" 
                className="h-full w-full object-cover opacity-90 pointer-events-none transition-opacity duration-700"
                onLoad={(e: any) => e.target.style.opacity = '1'}
              />

              {hotspots.map((h: any) => (
                <button
                  key={h.id}
                  onClick={(e) => handlePointClick(e, h)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-4 transition-all flex items-center justify-center shadow-2xl
                    ${foundIds.includes(h.id) ? 'bg-green-500 border-white scale-110' : 'bg-white/20 border-white/40 hover:bg-white/60 hover:scale-125'}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  {foundIds.includes(h.id) ? (
                    <CheckCircle2 className="text-white" size={28} />
                  ) : (
                    <Target className="text-white/60" size={28} />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <ImageOff size={48} className="opacity-20" />
              <p className="font-black text-xs uppercase tracking-widest italic">Panorama en attente de configuration</p>
            </div>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 flex items-center gap-3 text-white shadow-2xl pointer-events-none">
            <MoveHorizontal size={20} className="text-[#00aeb7]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Glissez pour explorer la pièce</span>
          </div>
        </div>

        <div className="absolute -top-4 -right-4 bg-[#962588] px-6 py-3 rounded-2xl text-white shadow-xl border-4 border-white flex items-center gap-3">
          <div className="flex gap-1.5">
            {hotspots.map((h: any) => (
              <div key={h.id} className={`w-2.5 h-2.5 rounded-full border border-white/20 transition-all ${foundIds.includes(h.id) ? 'bg-green-400 scale-125' : 'bg-white/30'}`} />
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest border-l border-white/20 pl-3">
            {foundIds.length} / {hotspots.length} Trouvés
          </span>
        </div>
      </div>

      <div className="h-40">
        {lastFound ? (
          <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100 flex items-center gap-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-[#E6F3F5] text-[#00aeb7] p-5 rounded-3xl border-2 border-white shadow-inner">
              <Info size={40} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-1">{lastFound.title}</h4>
              <p className="text-slate-500 italic font-medium text-lg leading-tight">{lastFound.description}</p>
            </div>
            {allFound && (
              <button onClick={() => setShowResults(true)} className="bg-[#962588] text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#7e1d72] hover:scale-105 transition-all flex items-center gap-3 border-b-4 border-[#7e1d72]">
                Terminer l'analyse <ArrowRight size={20} />
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/5 border-4 border-dashed border-white/20 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center gap-3">
            <Target size={32} className="text-white opacity-20" />
            <p className="text-white font-bold uppercase tracking-[0.3em] text-xs opacity-40 italic">Analysez l'environnement de Suzie</p>
          </div>
        )}
      </div>
    </div>
  );
};