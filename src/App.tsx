import React, { useState, useEffect, useRef } from 'react';
// Assurez-vous d'avoir fait : npm install three @types/three
import * as THREE from 'three'; 
import { supabase } from './lib/supabase';
import { 
  ArrowRight, CheckCircle2, Loader2, Sparkles, 
  ChevronRight, BedDouble, Bath, Sofa, Utensils,
  Settings, LogOut, Star, Shield, Save, MapPin, Phone, Mail, BookOpen, // Award retiré ici
  FileText, Video, AlertCircle, Trophy, Zap, X, // Crown retiré ici
  MessageCircle, 
  ShieldCheck,   
  // Droplets retiré ici
  Timer, AlertTriangle, // MousePointerClick retiré ici
  ListTodo, Bell, Bot, ChevronUp, ChevronDown
} from 'lucide-react';

// --- TYPES ---
type ViewState = 'landing' | 'create-account' | 'hub' | 'profile' | 'ranking' | 'game-salon' | 'game-chambre' | 'game-sdb' | 'game-cuisine';
// LES 3 NOUVELLES COMPÉTENCES
type Stats = {
  security: number;      // Sécurité 🛡️
  hygiene: number;       // Hygiène ✨
  communication: number; // Communication 💬
};

// --- CONFIGURATION SCÉNARIO SALON (Communication) ---
const EMOTION_IMAGES: Record<string, string> = {
  happy: '/md1.png', neutral: '/md2.png', angry: '/md3.png', sad: '/md4.png'
};

// --- COMPOSANT 1 : LANDING PAGE ---
const LandingView = ({ onSuccess }: { onSuccess: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email) return; setStatus('loading');
    try {
      const { error } = await supabase.from('waiting_list').upsert([{ email }], { onConflict: 'email' });
      if (error) throw error; setStatus('success'); setTimeout(() => onSuccess(email), 1500);
    } catch (error: any) { console.error(error); setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  };
  return (
    <div className="h-screen bg-white text-gray-900 overflow-hidden relative font-sans flex flex-col items-center justify-center text-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-[#962588]/10 blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#00aeb7]/15 blur-[100px] animate-float-delayed"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6">
        <div className="mb-10 animate-fade-in-down"><img src="/logo-elpi.png" alt="Logo Elpi" className="h-32 mx-auto drop-shadow-md" /></div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up text-gray-900">La formation professionnelle <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#962588] to-[#00aeb7]">réinventée pour vous</span></h1>
        <div className="w-full max-w-md mx-auto animate-fade-in-up">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="relative flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-xl">
              <input type="email" placeholder="votre@email.com" className="flex-1 bg-transparent text-gray-900 px-4 py-3 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'success'} />
              <button type="submit" disabled={status === 'loading' || status === 'success'} className={`px-6 py-3 rounded-md font-bold transition-all flex items-center text-white shadow-md ${status === 'success' ? 'bg-[#56b881]' : 'bg-[#962588] hover:bg-[#7e1d72]'}`}>{status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : status === 'success' ? <CheckCircle2 className="w-5 h-5 ml-2" /> : <>M'inscrire <ArrowRight className="w-5 h-5 ml-2" /></>}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT 2 : CRÉATION DE COMPTE ---
const CreateAccountView = ({ email, onComplete }: { email: string, onComplete: (name: string, avatar: string) => void }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('/01.png');
  const avatars = ['/01.png', '/02.png', '/03.png', '/04.png', '/05.png', '/06.png', '/07.png', '/08.png', '/11.png', '/12.png', '/13.png', '/14.png', '/15.png', '/16.png', '/17.png', '/18.png'];

  return (
    <div className="h-screen bg-[#F0F4F8] flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-2xl w-full text-center animate-fade-in-up border border-white/50">
        <h2 className="text-2xl font-bold text-[#962588] mb-2">Bienvenue chez ELPI !</h2>
        {/* C'est cette ligne qui corrige l'erreur en utilisant la variable email : */}
        <p className="text-gray-500 mb-6 text-sm">Votre espace est prêt pour : <span className="font-bold text-gray-800">{email}</span></p>
        
        <div className="space-y-6 text-left mt-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre Prénom" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-3">Avatar</label><div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-64 overflow-y-auto custom-scrollbar shadow-inner"><div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">{avatars.map((src) => (<button key={src} onClick={() => setSelectedAvatar(src)} className={`relative rounded-full p-1 transition-all ${selectedAvatar === src ? 'ring-4 ring-[#00aeb7] scale-110 z-10 bg-white' : 'opacity-80'}`}><img src={src} alt="Avatar" className="w-full aspect-square rounded-full object-cover" /></button>))}</div></div></div>
          <button onClick={() => onComplete(name || 'Julie', selectedAvatar)} className="w-full bg-gradient-to-r from-[#f4a938] to-[#e09b32] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center">Commencer <ChevronRight className="ml-2 w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT JEU 1 : VISUAL NOVEL (SALON - UI CORRIGÉE) ---
const VisualNovelView = ({ onClose, onUpdateStats, currentStats }: { onClose: () => void, onUpdateStats: (impact: Partial<Stats>) => void, currentStats: Stats }) => {
  const [scenario, setScenario] = useState<any[]>([]);
  const [currentStepId, setCurrentStepId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false); // Pour savoir si on est en mode secours

  // Scénario de secours (Amélioré un peu en attendant les crédits)
  const FALLBACK_SCENARIO = [
    {
      id: 1, speaker: "Mme Durand", emotion: "sad", 
      text: "(Regarde par la fenêtre) Ils m'ont oublié... Personne ne vient me chercher. Je suis abandonnée ici.",
      choices: [
        { text: "Mais non, je suis là moi. Vous n'êtes pas seule.", type: "empathic", impact: { communication: +10 }, next: 2 },
        { text: "Cessez de dire des bêtises, votre fille vient dimanche.", type: "authoritarian", impact: { communication: -10 }, next: 3 },
        { text: "Regardez la télé, ça vous changera les idées.", type: "avoidant", impact: { communication: -5 }, next: 3 }
      ]
    },
    { id: 2, speaker: "Mme Durand", emotion: "happy", text: "C'est gentil... Vous restez un peu avec moi ?", choices: [], end: true },
    { id: 3, speaker: "Mme Durand", emotion: "angry", text: "Vous ne comprenez rien ! Laissez-moi tranquille !", choices: [], end: true }
  ];

  useEffect(() => {
    const fetchScenario = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('generate-scenario', {
          body: { gameType: 'salon' }
        });
        if (error || !data) throw new Error("Erreur IA");
        setScenario(data);
        setIsFallback(false);
      } catch (err) {
        console.error("Échec IA Salon, utilisation secours", err);
        setScenario(FALLBACK_SCENARIO);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchScenario();
  }, []);

  const currentStep = scenario.find(s => s.id === currentStepId);

  const handleChoice = (nextId: number, impact?: Partial<Stats>) => {
    if (impact) onUpdateStats(impact);
    if (currentStep?.end || !nextId) onClose(); 
    else setCurrentStepId(nextId);
  };

  if (loading) return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-[#962588]" />
      <p className="text-xl font-medium animate-pulse">L'IA analyse le dossier patient...</p>
    </div>
  );

  if (!currentStep) return null;

  return (
    <div className="h-screen bg-gray-900 font-sans relative flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0"><div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div><img src="/salon.png" alt="Salon" className="w-full h-full object-cover" /></div>
      <button onClick={onClose} className="absolute top-6 right-6 z-50 bg-white/20 p-2 rounded-full text-white"><X className="w-6 h-6" /></button>
      
      {/* HUD STATS COMPLET */}
      <div className="absolute top-6 left-6 z-50 flex flex-col gap-2">
        <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20"><ShieldCheck className="w-4 h-4 text-blue-400" /><div className="w-24 h-2 bg-gray-700 rounded-full"><div className="h-full bg-blue-500 transition-all" style={{ width: `${currentStats.security}%` }}></div></div></div>
        <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20"><Sparkles className="w-4 h-4 text-yellow-400" /><div className="w-24 h-2 bg-gray-700 rounded-full"><div className="h-full bg-yellow-500 transition-all" style={{ width: `${currentStats.hygiene}%` }}></div></div></div>
        <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20"><MessageCircle className="w-4 h-4 text-purple-400" /><div className="w-24 h-2 bg-gray-700 rounded-full"><div className="h-full bg-purple-500 transition-all" style={{ width: `${currentStats.communication}%` }}></div></div></div>
      </div>

      {/* Indication Mode Dégradé (si pas de crédit IA) */}
      {isFallback && (
        <div className="absolute bottom-4 left-4 z-50 bg-red-500/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          ⚠️ Mode hors-ligne (IA indisponible)
        </div>
      )}

      <div className={`z-10 mt-auto mb-8 transition-all duration-500 transform ${currentStep.emotion === 'angry' ? 'scale-110' : 'scale-100'}`}>
        <div className="w-48 h-48 md:w-72 md:h-72 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 mx-auto">
          <img src={EMOTION_IMAGES[currentStep.emotion] || '/md2.png'} alt="Personnage" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="z-20 w-full max-w-4xl px-4 pb-8 mt-auto mb-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-fade-in-up">
          <div className="bg-[#962588] text-white px-8 py-3 font-bold text-xl inline-block rounded-br-2xl">{currentStep.speaker}</div>
          <div className="p-6 md:p-8">
            <p className="text-xl md:text-2xl text-gray-800 font-medium mb-8">"{currentStep.text}"</p>
            <div className="space-y-3">
              {currentStep.end ? (
                <button onClick={() => onClose()} className="w-full text-center p-4 rounded-xl bg-[#962588] text-white font-bold hover:bg-[#7e1d72]">Terminer l'échange</button>
              ) : (
                currentStep.choices?.map((choice: any, idx: number) => (
                  <button key={idx} onClick={() => handleChoice(choice.next, choice.impact)} className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-[#E6F3F5] border-2 border-transparent hover:border-[#00aeb7] transition-all group flex items-center">
                    <div className="bg-white border border-gray-200 text-gray-500 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#00aeb7] group-hover:text-white shrink-0">{String.fromCharCode(65 + idx)}</div>
                    <span className="text-gray-700 font-medium group-hover:text-[#00aeb7]">{choice.text}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT JEU 2 : VUE 360 (CHAMBRE - SÉCURITÉ) ---
const Room360View = ({ onClose, onUpdateStats }: { onClose: () => void, onUpdateStats: (impact: Partial<Stats>) => void }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hazardsFound, setHazardsFound] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); 
  const hazards = [
    { id: 'rug', name: "Tapis Plié", position: new THREE.Vector3(-106, -315, -221) }, 
    { id: 'meds', name: "Médicaments", position: new THREE.Vector3(71, -24, 392) },
    { id: 'bed', name: "Lit trop haut", position: new THREE.Vector3(-311, 47, 245) }
  ];

  // Logiciel 3D (Three.js) identique mais pointant sur sécurité
  useEffect(() => {
    if (timeLeft > 0 && hazardsFound.length < 3) { const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); return () => clearTimeout(timerId); }
  }, [timeLeft, hazardsFound]);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const roomGroup = new THREE.Group();
    scene.add(roomGroup);
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); 
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/chambre.png', (texture) => { texture.colorSpace = THREE.SRGBColorSpace; const material = new THREE.MeshBasicMaterial({ map: texture }); const sphere = new THREE.Mesh(geometry, material); roomGroup.add(sphere); });

    const hazardMeshes: THREE.Mesh[] = [];
    hazards.forEach(h => {
      const hGeo = new THREE.SphereGeometry(25, 32, 32);
      const hMat = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0, transparent: true }); 
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.copy(h.position);
      hMesh.userData = { id: h.id };
      roomGroup.add(hMesh); hazardMeshes.push(hMesh);
    });
    roomGroup.rotation.y = Math.PI / 2; 

    // Gestion Souris simplifiée pour la démo
    let isDragging = false; let startX = 0, startY = 0; let lon = 0, lat = 0; let startLon = 0, startLat = 0;
    const onDown = (e: MouseEvent | TouchEvent) => {
        isDragging = true; 
        startX = 'touches' in e ? e.touches[0].clientX : e.clientX; 
        startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        startLon = lon; startLat = lat;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
        lon = (startX - x) * 0.1 + startLon;
        lat = (y - startY) * 0.1 + startLat;
        lat = Math.max(-85, Math.min(85, lat));
    };
    const onUp = () => { isDragging = false; };

    const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
    const onClick = (e: MouseEvent) => {
        if (isDragging) return; 
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(hazardMeshes);
        if (intersects.length > 0) {
            const hit = intersects[0].object as THREE.Mesh;
            const id = hit.userData.id;
            if (!hazardsFound.includes(id)) {
                setHazardsFound(prev => [...prev, id]);
                hit.material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
            }
        }
    };

    window.addEventListener('mousedown', onDown); window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
    window.addEventListener('touchstart', onDown); window.addEventListener('touchmove', onMove); window.addEventListener('touchend', onUp);
    window.addEventListener('click', onClick);

    const animate = () => {
        requestAnimationFrame(animate);
        const phi = THREE.MathUtils.degToRad(90 - lat);
        const theta = THREE.MathUtils.degToRad(lon);
        camera.lookAt(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta));
        renderer.render(scene, camera);
    };
    animate();

    return () => { if (mountRef.current) mountRef.current.innerHTML = ''; window.removeEventListener('mousedown', onDown); window.removeEventListener('click', onClick); };
  }, [hazardsFound]); 

  useEffect(() => { if (hazardsFound.length === 3) onUpdateStats({ security: 30 }); }, [hazardsFound]);

  return (
    <div className="fixed inset-0 z-50 bg-black cursor-move">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-black/60 text-white p-4 rounded-xl backdrop-blur-md border border-white/20 pointer-events-none select-none">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /> Sécurité : Risques</h3>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2"><Timer className="w-4 h-4" /><span className="font-mono text-xl">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span></div>
          <div className="text-sm font-bold text-green-400">{hazardsFound.length} / 3 trouvés</div>
        </div>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white pointer-events-auto"><X className="w-6 h-6" /></button>
      {hazardsFound.length === 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white p-8 rounded-3xl text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Zone Sécurisée !</h2>
            <button onClick={onClose} className="bg-[#00aeb7] text-white px-8 py-3 rounded-xl font-bold mt-4">Accueil</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPOSANT JEU 3 : SALLE DE BAIN (HYGIÈNE - POINT & CLICK 2D) ---
const BathroomGameView = ({ onClose, onUpdateStats }: { onClose: () => void, onUpdateStats: (impact: Partial<Stats>) => void }) => {
  const [errorsFound, setErrorsFound] = useState<string[]>([]);
  
  // === CONFIGURATION DES ZONES SDB (Pourcentages basés sur sdb.jpg) ===
  const hygieneErrors = [
    // Serviette sale (En bas à gauche, beige/jaune)
    { id: 'towel', style: { top: '75%', left: '15%', width: '20%', height: '15%' } }, 
    // Rasoir / Objets lavabo (Sur le rebord du lavabo à gauche)
    { id: 'razor', style: { top: '36%', left: '18%', width: '15%', height: '8%' } },   
    // Flaque d'eau (Au centre sur le carrelage)
    { id: 'water', style: { top: '65%', left: '42%', width: '25%', height: '15%' } },   
  ];

  const handleErrorClick = (id: string) => {
    if (!errorsFound.includes(id)) {
      setErrorsFound(prev => [...prev, id]);
    }
  };

  // Outil de calibrage (gardé pour vérification au cas où)
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const leftPerc = Math.round((x / rect.width) * 100);
    const topPerc = Math.round((y / rect.height) * 100);
    console.log(`Position cliquée : top: '${topPerc}%', left: '${leftPerc}%'`);
  };

  useEffect(() => { if (errorsFound.length === 3) onUpdateStats({ hygiene: 30 }); }, [errorsFound]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700" onClick={handleImageClick}>
        <img src="/sdb.png" alt="Salle de Bain" className="w-full h-full object-cover" />
        
        {/* Zones interactives */}
        {hygieneErrors.map((err) => (
          <button
            key={err.id}
            onClick={(e) => { e.stopPropagation(); handleErrorClick(err.id); }}
            className={`absolute border-2 transition-all duration-300 ${errorsFound.includes(err.id) ? 'border-green-500 bg-green-500/30' : 'border-transparent hover:bg-white/10'}`} 
            style={err.style}
          >
            {errorsFound.includes(err.id) && <CheckCircle2 className="w-full h-full text-green-500 p-1" />}
          </button>
        ))}

        {/* HUD */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg pointer-events-none">
          <h3 className="font-bold text-[#962588] flex items-center gap-2"><Sparkles className="w-4 h-4" /> Hygiène : Chasse aux erreurs</h3>
          <p className="text-sm text-gray-600">{errorsFound.length} / 3 erreurs trouvées</p>
        </div>
      </div>

      <button onClick={onClose} className="absolute top-6 right-6 bg-white/20 p-2 rounded-full text-white hover:bg-white/30"><X className="w-6 h-6" /></button>

      {/* Victoire */}
      {errorsFound.length === 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white p-8 rounded-3xl text-center animate-fade-in-up">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Hygiène Impeccable !</h2>
            <p className="text-gray-600">Vous avez repéré toutes les sources de contamination.</p>
            <button onClick={onClose} className="mt-6 bg-[#962588] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7e1d72]">Terminer</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPOSANT JEU 4 : CUISINE (AUTO-START) ---
const KitchenGameView = ({ onClose, onUpdateStats }: { onClose: () => void, onUpdateStats: (impact: Partial<Stats>) => void }) => {
  const [phase, setPhase] = useState<'planning' | 'execution' | 'transmission' | 'feedback'>('planning');
  const [isLoading, setIsLoading] = useState(true); // Commence à true

  // État initial vide ou placeholder, il sera écrasé par l'IA
  const [tasks, setTasks] = useState<any[]>([]);
  const [scenarioNotifications, setScenarioNotifications] = useState<string[]>([]);
  
  const [notifications, setNotifications] = useState<string[]>([]);
  const [report, setReport] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");

  // Lancement automatique au montage du composant
  useEffect(() => {
    generateNewScenario();
  }, []);

  const generateNewScenario = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-scenario', {
        body: { gameType: 'kitchen-meal' } 
      });
      if (error || !data) throw new Error("Erreur IA");

      setTasks(data.tasks);
      setScenarioNotifications(data.notifications);
    } catch (err) {
      console.error("Erreur IA Cuisine, fallback", err);
      // Fallback manuel si l'IA échoue
      setTasks([
        { id: 1, name: "Laver les mains", priority: "high" },
        { id: 2, name: "Vérifier DLC", priority: "high" },
        { id: 3, name: "Mixer repas M. Paul", priority: "medium" },
        { id: 4, name: "Servir Mme Durand", priority: "medium" }
      ]);
      setScenarioNotifications(["⚠️ Frigo à 12°C", "🤢 Refus de manger"]);
    } finally {
      setIsLoading(false);
    }
  };

  const moveTask = (idx: number, dir: -1 | 1) => {
    if ((idx === 0 && dir === -1) || (idx === tasks.length - 1 && dir === 1)) return;
    const newTasks = [...tasks];
    const temp = newTasks[idx];
    newTasks[idx] = newTasks[idx + dir];
    newTasks[idx + dir] = temp;
    setTasks(newTasks);
  };

  const startSimulation = () => {
    setPhase('execution');
    setTimeout(() => setNotifications(prev => [...prev, scenarioNotifications[0] || "Imprévu 1"]), 2000);
    setTimeout(() => setNotifications(prev => [...prev, scenarioNotifications[1] || "Imprévu 2"]), 5000);
    setTimeout(() => setPhase('transmission'), 8000);
  };

  const analyzeReport = () => {
    // ... (Logique analyse identique au code précédent) ...
    let feedback = "Analyse IA :\n";
    let score = 0;
    if (report.length > 20) { feedback += "✅ Bonne longueur.\n"; score += 10; }
    else feedback += "⚠️ Trop court.\n";
    setAiFeedback(feedback);
    onUpdateStats({ communication: score, hygiene: 10 });
    setPhase('feedback');
  };

  // --- RENDU ---
  if (isLoading) return (
    <div className="fixed inset-0 z-50 bg-white/90 flex flex-col items-center justify-center">
      <Loader2 className="w-16 h-16 text-[#00aeb7] animate-spin mb-4" />
      <h3 className="text-xl font-bold text-gray-700">L'IA prépare la cuisine...</h3>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#F0F4F8] flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[#962588] p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2"><ListTodo className="w-6 h-6" /> Service du Repas (Généré par IA)</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          {phase === 'planning' && (
            <div className="space-y-4">
              <p className="text-gray-600">L'IA a généré cette situation unique. Organisez-vous :</p>
              {tasks.map((task, idx) => (
                <div key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="font-medium text-gray-700">{idx + 1}. {task.name} <span className="text-xs text-gray-400">({task.priority})</span></span>
                  <div className="flex gap-3">
                    <button onClick={() => moveTask(idx, -1)} disabled={idx === 0} className="p-2 rounded-full border border-purple-100 text-[#962588] hover:bg-purple-50"><ChevronUp className="w-5 h-5" /></button>
                    <button onClick={() => moveTask(idx, 1)} disabled={idx === tasks.length - 1} className="p-2 rounded-full border border-purple-100 text-[#962588] hover:bg-purple-50"><ChevronDown className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
              <button onClick={startSimulation} className="w-full bg-[#00aeb7] text-white py-3 rounded-xl font-bold mt-4">Lancer le service</button>
            </div>
          )}
          
          {phase === 'execution' && (
            <div className="text-center space-y-6">
              <Loader2 className="w-16 h-16 text-[#00aeb7] animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-gray-700">Service en cours...</h3>
              <div className="space-y-2">
                {notifications.map((notif, i) => (
                  <div key={i} className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 flex items-center gap-2 animate-fade-in-up">
                    <Bell className="w-4 h-4" /> {notif}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'transmission' && (
             <div className="space-y-4">
               <h3 className="font-bold text-gray-800">Transmission :</h3>
               <textarea className="w-full h-32 p-3 border rounded-xl" value={report} onChange={(e) => setReport(e.target.value)} placeholder="Rapportez les incidents..." />
               <button onClick={analyzeReport} className="w-full bg-[#962588] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Bot className="w-5 h-5"/> Analyser</button>
             </div>
          )}

          {phase === 'feedback' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl text-sm whitespace-pre-line">{aiFeedback}</div>
              <button onClick={onClose} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold">Retour</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT 3 : LE HUB ---
const GameHubView = ({ user, onNavigate, onStartGameSalon, onStartGameChambre, onStartGameSdb, onStartGameCuisine, stats }: any) => {
  return (
    <div className="h-screen bg-[#E6F3F5] font-sans overflow-hidden relative flex flex-col justify-center items-center">
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[5%] -left-[150px] w-[120px] opacity-50 animate-cloud-slow" style={{animationDelay: '-10s'}}><img src="/nuage1.png" alt="" className="w-full brightness-110" /></div>
        <div className="absolute top-[8%] -left-[400px] w-[100px] opacity-40 animate-cloud-slow" style={{animationDelay: '-60s'}}><img src="/nuage2.png" alt="" className="w-full brightness-110" /></div>
        <div className="absolute top-[30%] -left-[400px] w-[450px] opacity-30 animate-cloud-fast" style={{animationDelay: '-2s'}}><img src="/nuage3.png" alt="" className="w-full brightness-110" /></div>
        <div className="absolute top-[15%] -left-[100px] w-16 opacity-80 animate-fly-1" style={{animationDelay: '-5s'}}><img src="/bird1.png" alt="" className="w-full" /></div>
      </div>

      <div className="absolute top-4 right-4 z-50 md:w-auto w-[92%] md:left-auto left-4">
        <div className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-2xl p-3 shadow-xl flex items-center gap-4 animate-fade-in-down">
          <div className="relative shrink-0"><div className="absolute inset-0 bg-gradient-to-br from-[#00aeb7] to-[#962588] rounded-full blur-sm opacity-50"></div><img src={user.avatar} alt="Profile" className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-md z-10" /></div>
          <div className="flex-1 pr-2 min-w-[160px]">
            <h3 className="font-extrabold text-lg text-gray-800 leading-tight">{user.name}</h3>
            <div className="space-y-1.5 mt-1.5">
              <div className="flex items-center gap-2"><span className="text-[9px] font-bold text-blue-500 w-16 uppercase tracking-wide flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Sécurité</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100"><div className="h-full bg-gradient-to-r from-blue-300 to-blue-500 w-[40%] rounded-full transition-all duration-500" style={{width: `${stats.security}%`}}></div></div></div>
              <div className="flex items-center gap-2"><span className="text-[9px] font-bold text-yellow-500 w-16 uppercase tracking-wide flex items-center gap-1"><Sparkles className="w-3 h-3" /> Hygiène</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100"><div className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 w-[60%] rounded-full transition-all duration-500" style={{width: `${stats.hygiene}%`}}></div></div></div>
              <div className="flex items-center gap-2"><span className="text-[9px] font-bold text-purple-500 w-16 uppercase tracking-wide flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Comm.</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100"><div className="h-full bg-gradient-to-r from-purple-300 to-purple-500 w-[60%] rounded-full transition-all duration-500" style={{width: `${stats.communication}%`}}></div></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center relative z-10 w-full px-4">
        <div className="relative w-full max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-500 animate-scale-slow">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-40 w-full text-center">
             <div className="inline-flex items-center justify-center gap-3 bg-[#FFE8CC]/95 backdrop-blur-md px-8 py-3 rounded-full border-2 border-white shadow-xl animate-fade-in-up">
               <img src="/icone-maison.png" alt="" className="w-8 h-8 drop-shadow-sm" />
               <span className="text-[#8B4513] font-extrabold text-2xl tracking-tight">La Maison de Suzie</span>
             </div>
          </div>
          <img src="/maison.png" alt="Maison de Suzie" className="w-full drop-shadow-2xl z-0 relative" />
          
          <div className="absolute top-[25%] left-[10%] right-[10%] bottom-[5%] grid grid-cols-2 grid-rows-2 gap-4 z-30 p-4">
            <button onClick={onStartGameChambre} className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none transform -translate-y-4 -translate-x-2 cursor-pointer">
              <div className="p-3.5 rounded-full bg-blue-500 text-white shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 border-white transition-all duration-300 group-hover:bg-blue-600 animate-pulse"><BedDouble className="w-8 h-8 drop-shadow-md" /></div>
              <span className="mt-2 font-bold text-white text-sm shadow-[0_0_15px_rgba(255,255,255,0.8)] bg-black/60 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm group-hover:bg-[#00aeb7]">Chambre</span>
            </button>
            <button onClick={onStartGameSdb} className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none transform translate-x-2 -translate-y-2">
              <div className="p-3.5 rounded-full bg-yellow-500 text-white shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 border-white transition-all duration-300 group-hover:bg-yellow-600"><Bath className="w-8 h-8 drop-shadow-md" /></div>
              <span className="mt-2 font-bold text-white text-sm shadow-[0_0_15px_rgba(255,255,255,0.8)] bg-black/60 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">Salle de Bain</span>
            </button>
            <button onClick={onStartGameSalon} className="group flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none transform translate-y-2 -translate-x-2 cursor-pointer">
              <div className="p-3.5 rounded-full bg-purple-600 text-white shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 border-white transition-all duration-300 group-hover:bg-purple-700 animate-pulse"><Sofa className="w-8 h-8 drop-shadow-md" /></div>
              <span className="mt-2 font-bold text-white text-sm shadow-[0_0_15px_rgba(255,255,255,0.8)] bg-black/60 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm group-hover:bg-[#962588]">Salon</span>
            </button>
            <button onClick={onStartGameCuisine} className="group flex flex-col items-center justify-center transform translate-y-2 translate-x-2 transition hover:scale-110">
      <div className="p-3.5 rounded-full bg-green-600 text-white border-4 border-white shadow-lg group-hover:bg-green-700"><Utensils className="w-8 h-8 drop-shadow-md" /></div>
      <span className="mt-2 font-bold text-white text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">Cuisine</span>
  </button>
          </div>
        </div>
      </div>
      <NavigationDock active="hub" onNavigate={onNavigate} />
    </div>
  );
};

// --- COMPOSANT 4 : PROFIL ---
const ProfileView = ({ user, onNavigate }: { user: { name: string, email: string, avatar: string }, onNavigate: (view: ViewState) => void }) => {
  return (
    <div className="h-screen bg-[#F0F4F8] font-sans overflow-hidden relative flex flex-col">
      <div className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10 shrink-0">
        <h2 className="text-2xl font-extrabold text-[#962588] flex items-center gap-2"><Settings className="w-6 h-6" /> Mon Compte</h2>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition"><LogOut className="w-4 h-4" /> Se déconnecter</button>
      </div>
      <div className="flex-grow w-full max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden mb-24">
        <div className="md:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center border border-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-[#00aeb7] to-[#962588] opacity-10"></div>
            <div className="relative">
              <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-r from-[#00aeb7] to-[#962588] mb-3 shadow-lg"><img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full border-4 border-white" /></div>
              <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
              <p className="text-gray-500 text-xs mb-3">{user.email || 'email@exemple.com'}</p>
              <div className="flex justify-center gap-2"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-wide">Niveau 3</span><span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold border border-purple-100 uppercase tracking-wide">Explorateur</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"><div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-1"><Star className="w-4 h-4 fill-current" /></div><span className="text-xl font-bold text-gray-800">1,250</span><span className="text-[10px] text-gray-400 font-medium uppercase">Points XP</span></div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-1"><Shield className="w-4 h-4" /></div><span className="text-xl font-bold text-gray-800">4</span><span className="text-[10px] text-gray-400 font-medium uppercase">Badges</span></div>
          </div>
        </div>
        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg border border-white/50 relative flex flex-col overflow-hidden">
           <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center"><h4 className="text-lg font-bold text-gray-700 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#00aeb7]" /> Mes Informations</h4><button className="bg-[#962588] hover:bg-[#7e1d72] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-md"><Save className="w-4 h-4" /> Enregistrer</button></div>
           <div className="p-6 overflow-y-auto custom-scrollbar flex-grow"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nom</label><input type="text" defaultValue="Dupont" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Prénom</label><input type="text" defaultValue={user.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div className="space-y-2"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label><div className="relative"><Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input type="email" defaultValue={user.email} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Téléphone</label><div className="relative"><Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input type="tel" placeholder="06 12 34 56 78" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div></div><div className="md:col-span-2 grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Code Postal</label><input type="text" placeholder="59000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Ville</label><input type="text" placeholder="Lille" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Adresse Postale</label><div className="relative"><MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" /><input type="text" placeholder="12 rue de la Formation" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-[#00aeb7] outline-none" /></div></div><div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Formation Suivie</label><div className="relative"><BookOpen className="absolute left-3 top-2.5 w-5 h-5 text-[#962588]" /><select className="w-full bg-purple-50 border border-purple-100 rounded-xl pl-10 pr-4 py-2 text-purple-900 font-medium focus:ring-2 focus:ring-[#962588] outline-none appearance-none cursor-pointer"><option>Assistant de vie aux familles</option><option>Titre Professionnel ADVF</option><option>Formation Continue - Petite Enfance</option></select><ChevronRight className="absolute right-4 top-3 w-4 h-4 text-purple-400 rotate-90" /></div></div></div></div>
        </div>
      </div>
      <NavigationDock active="profile" onNavigate={onNavigate} />
    </div>
  );
};

// --- COMPOSANT 5 : RANKING (MODE MIXTE : BADGES GAUCHE + LISTE DROITE) ---
const RankingView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const badges = [
    { title: "SÉCURITÉ", icon: <ShieldCheck className="w-6 h-6 text-blue-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: 2, color: "blue" },
    { title: "HYGIÈNE", icon: <Sparkles className="w-6 h-6 text-yellow-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: 1, color: "yellow" },
    { title: "COMMUNICATION", icon: <MessageCircle className="w-6 h-6 text-purple-500" />, levels: ["Débutant", "Apprenti", "Confirmé", "Expert"], current: 3, color: "purple" }
  ];

  const skills = [
    { name: "Entretien du linge", status: "acquired", score: 100 },
    { name: "Préparation des repas", status: "acquired", score: 95 },
    { name: "Gestes de premiers secours", status: "review", score: 45 },
    { name: "Accompagnement mobilité", status: "progress", score: 70 },
    { name: "Communication bienveillante", status: "acquired", score: 88 },
  ];

  return (
    <div className="h-screen bg-[#F0F4F8] font-sans overflow-hidden relative flex flex-col">
      <div className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10 shrink-0"><h2 className="text-2xl font-extrabold text-[#962588] flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" /> Mes Compétences</h2><div className="flex gap-2"><span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Zap className="w-3 h-3 fill-current" /> 12 Jours consécutifs</span></div></div>
      <div className="flex-grow w-full max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden mb-24">
        
        {/* COLONNE GAUCHE : Nouveaux Badges à Niveaux */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
           {badges.map((badge, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4"><div className={`p-3 rounded-full bg-${badge.color}-100`}>{badge.icon}</div><h3 className="font-bold text-gray-800 text-lg">{badge.title}</h3></div>
                <div className="grid grid-cols-4 gap-2 text-center">{badge.levels.map((level, i) => (<div key={i} className={`flex flex-col items-center gap-2 ${i < badge.current ? 'opacity-100' : 'opacity-30 grayscale'}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${i < badge.current ? `bg-${badge.color}-100 border-${badge.color}-500 text-${badge.color}-700` : 'bg-gray-100 border-gray-200 text-gray-400'}`}>{i === 3 ? '👑' : i === 2 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div><span className="text-[10px] font-bold uppercase text-gray-600">{level}</span></div>))}</div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden"><div className={`h-full bg-${badge.color}-500 transition-all duration-1000 ease-out`} style={{width: `${(badge.current / 4) * 100}%`}}></div></div>
              </div>
           ))}
           {/* Coach Suzie (Restored) */}
           <div className="bg-[#FFE8CC] p-8 rounded-3xl border border-[#FFD6A5] flex items-center gap-4 relative overflow-hidden">
             <div className="w-16 h-16 bg-white rounded-full flex-shrink-0 border-2 border-orange-300 overflow-hidden"><img src="/02.png" alt="Coach Suzie" className="w-full h-full object-cover" /></div>
             <div><h4 className="font-bold text-[#8B4513]">Le conseil de Suzie</h4><p className="text-xs text-[#8B4513]/80 leading-relaxed">"Continue tes efforts en hygiène, tu es bientôt au niveau Apprenti !"</p></div>
           </div>
        </div>

        {/* COLONNE DROITE : Liste des Formations (Restored) */}
        <div className="bg-white rounded-3xl shadow-lg border border-white/50 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50"><h4 className="text-lg font-bold text-gray-700 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#962588]" /> Suivi des Compétences</h4></div>
          <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-4">
            {skills.map((skill, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition bg-white">
                <div className="flex justify-between items-center mb-2"><span className="font-bold text-gray-700">{skill.name}</span>{skill.status === 'acquired' && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Acquis</span>}{skill.status === 'progress' && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> En cours</span>}{skill.status === 'review' && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> À revoir</span>}</div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3"><div className={`h-full rounded-full ${skill.status === 'acquired' ? 'bg-green-500' : skill.status === 'progress' ? 'bg-orange-400' : 'bg-red-500'}`} style={{width: `${skill.score}%`}}></div></div>
                {skill.status === 'review' && (<div className="flex gap-2 mt-2 pt-2 border-t border-gray-50"><button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"><FileText className="w-3 h-3" /> Fiche PDF</button><button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"><Video className="w-3 h-3" /> Revoir la Visio</button></div>)}
              </div>
            ))}
            <div className="pt-4 pb-4"><button className="w-full bg-gradient-to-r from-[#962588] to-[#701a65] text-white py-4 rounded-xl font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition flex items-center justify-center gap-3"><Trophy className="w-6 h-6" /> Prêt pour le test final ?</button></div>
          </div>
        </div>

      </div>
      <NavigationDock active="ranking" onNavigate={onNavigate} />
    </div>
  );
};

// --- NAVIGATION DOCK ---
const NavigationDock = ({ active, onNavigate }: any) => (
  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 flex justify-center">
    <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-xl border border-white p-2 flex justify-around w-full">
      <NavBtn icon="/icone-maison.png" label="Hub" active={active === 'hub'} onClick={() => onNavigate('hub')} />
      <NavBtn icon="/icone-perso.png" label="Profil" active={active === 'profile'} onClick={() => onNavigate('profile')} />
      <NavBtn icon="/icone-coupe.png" label="Compétences" active={active === 'ranking'} onClick={() => onNavigate('ranking')} />
    </div>
  </div>
);

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-all ${active ? '-translate-y-4 scale-110' : 'opacity-60'}`}>
    <div className={`p-2 rounded-full ${active ? 'bg-gradient-to-b from-[#f4a938] to-[#d68c20] shadow-lg border-4 border-white' : ''}`}>
      {/* MODIFICATION ICI : w-12 h-12 au lieu de w-8 h-8 */}
      <img src={icon} className={`w-12 h-12 ${active ? 'brightness-0 invert' : ''}`} alt={label} />
    </div>
    {active && <span className="text-xs font-bold text-orange-600 absolute -bottom-6">{label}</span>}
  </button>
);

// --- APP PRINCIPALE ---
function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [userData, setUserData] = useState({ email: '', name: '', avatar: '' });
  const [stats, setStats] = useState<Stats>({ security: 40, hygiene: 20, communication: 60 });

  const handleLandingSuccess = (email: string) => { setUserData(prev => ({ ...prev, email })); setCurrentView('create-account'); };
  const handleAccountCreated = (name: string, avatar: string) => { setUserData(prev => ({ ...prev, name, avatar })); setCurrentView('hub'); };
  const updateStats = (impact: Partial<Stats>) => {
    setStats(prev => ({
      security: Math.min(100, Math.max(0, prev.security + (impact.security || 0))),
      hygiene: Math.min(100, Math.max(0, prev.hygiene + (impact.hygiene || 0))),
      communication: Math.min(100, Math.max(0, prev.communication + (impact.communication || 0))),
    }));
  };

  return (
    <>
      {currentView === 'landing' && <LandingView onSuccess={handleLandingSuccess} />}
      {currentView === 'create-account' && <CreateAccountView email={userData.email} onComplete={handleAccountCreated} />}
      {currentView === 'hub' && <GameHubView user={userData} onNavigate={setCurrentView} onStartGameSalon={() => setCurrentView('game-salon')} onStartGameChambre={() => setCurrentView('game-chambre')} onStartGameSdb={() => setCurrentView('game-sdb')} stats={stats} onStartGameCuisine={() => setCurrentView('game-cuisine')} />}
      {currentView === 'profile' && <ProfileView user={userData} onNavigate={setCurrentView} />}
      {currentView === 'ranking' && <RankingView onNavigate={setCurrentView} />}
      {currentView === 'game-salon' && <VisualNovelView onClose={() => setCurrentView('hub')} onUpdateStats={updateStats} currentStats={stats} />}
      {currentView === 'game-chambre' && <Room360View onClose={() => setCurrentView('hub')} onUpdateStats={updateStats} />}
      {currentView === 'game-sdb' && <BathroomGameView onClose={() => setCurrentView('hub')} onUpdateStats={updateStats} />}
      {currentView === 'game-cuisine' && <KitchenGameView onClose={() => setCurrentView('hub')} onUpdateStats={updateStats} />}
      <style>{`
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-scale-slow { animation: scale 10s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cloud-move { 0% { transform: translateX(-100vw); } 100% { transform: translateX(100vw); } }
        .animate-cloud-slow { animation: cloud-move 120s linear infinite; }
        .animate-cloud-medium { animation: cloud-move 80s linear infinite; }
        .animate-cloud-fast { animation: cloud-move 40s linear infinite; }
        @keyframes fly { 0% { transform: translateX(-10vw) translateY(0); } 50% { transform: translateX(50vw) translateY(-5vh); } 100% { transform: translateX(110vw) translateY(0); } }
        .animate-fly-1 { animation: fly 25s linear infinite; }
        .animate-fly-2 { animation: fly 35s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
      `}</style>
    </>
  );
}
export default App;