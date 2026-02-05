// src/components/Room360View.tsx
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Timer, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { Stats } from '../types';

export const Room360View = ({ onClose, onUpdateStats }: { onClose: () => void, onUpdateStats: (impact: Partial<Stats>) => void }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hazardsFound, setHazardsFound] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); 
  
  // VOS COORDONNÉES EXACTES
  const hazards = [
    { id: 'rug', name: "Tapis Plié", position: new THREE.Vector3(-106, -315, -221) }, 
    { id: 'meds', name: "Médicaments", position: new THREE.Vector3(71, -24, 392) },
    { id: 'bed', name: "Lit trop haut", position: new THREE.Vector3(-311, 47, 245) }
  ];

  // --- TIMER ---
  useEffect(() => {
    if (timeLeft > 0 && !gameOver && hazardsFound.length < 3) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, hazardsFound]);

  // --- SCÈNE 3D ---
  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Initialisation
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Pour que ce soit net
    mountRef.current.appendChild(renderer.domElement);

    // 2. Création de la sphère 360
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Inverser l'échelle sur l'axe X pour voir l'image de l'intérieur
    geometry.scale(-1, 1, 1); 
    
    const texture = new THREE.TextureLoader().load('/chambre.png');
    texture.colorSpace = THREE.SRGBColorSpace; // Meilleures couleurs
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 3. Ajout des zones de danger (Sphères invisibles mais cliquables)
    const hazardMeshes: THREE.Mesh[] = [];
    hazards.forEach(h => {
      const hGeo = new THREE.SphereGeometry(4, 32, 32); // Taille de la zone de clic
      // DEBUG : Mettre opacity à 0.3 pour voir les zones rouges et les régler. Mettre à 0 pour le jeu final.
      const hMat = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        opacity: 0.0, // <--- METTRE A 0.3 POUR VOIR LES BULLES ROUGES, 0 POUR CACHER
        transparent: true,
        side: THREE.DoubleSide
      }); 
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.copy(h.position);
      hMesh.userData = { id: h.id, name: h.name };
      scene.add(hMesh);
      hazardMeshes.push(hMesh);
    });

    // 4. Gestion de la Souris (Mouse & Touch)
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startMouse.current = { x: clientX, y: clientY };
      savedLong.current = long.current;
      savedLat.current = lat.current;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // Calcul de la rotation
      long.current = (startMouse.current.x - clientX) * 0.1 + savedLong.current;
      lat.current = (clientY - startMouse.current.y) * 0.1 + savedLat.current;
      
      // Limiter la vue haut/bas pour ne pas se tordre le cou
      lat.current = Math.max(-85, Math.min(85, lat.current));
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    // 5. Gestion du Clic (Raycaster)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      // On ne valide pas le clic si on était en train de glisser (drag)
      if (isDragging.current) return;

      // Calcul position souris normalisée (-1 à +1)
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hazardMeshes);

      if (intersects.length > 0) {
        const hitObj = intersects[0].object as THREE.Mesh;
        const hitId = hitObj.userData.id;

        if (!hazardsFound.includes(hitId)) {
          setHazardsFound(prev => {
            const newList = [...prev, hitId];
            return newList;
          });
          // Feedback visuel : la zone devient verte et visible
          hitObj.material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.6, transparent: true });
        }
      }
    };

    // Listeners sur le document pour ne pas perdre le focus si on sort de la fenêtre
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    // Tactile
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('touchmove', onPointerMove);
    document.addEventListener('touchend', onPointerUp);
    
    // Clic sur le canvas seulement
    mountRef.current.addEventListener('click', onClick);

    // 6. Boucle d'animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Mathématiques pour convertir Longitude/Latitude en vecteur 3D
      const phi = THREE.MathUtils.degToRad(90 - lat.current);
      const theta = THREE.MathUtils.degToRad(long.current);

      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.cos(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    animate();

    // Nettoyage
    const container = mountRef.current;
    return () => {
      if (container) container.removeChild(renderer.domElement);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
      if (container) container.removeEventListener('click', onClick);
    };
  }, [hazardsFound]); // Dépendance hazardsFound pour mettre à jour les couleurs

  // Condition de victoire
  useEffect(() => {
    if (hazardsFound.length === 3) {
      onUpdateStats({ security: 30 });
    }
  }, [hazardsFound]);

  return (
    <div className="fixed inset-0 z-50 bg-black cursor-move">
      {/* CONTENEUR 3D */}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* HUD (Interface) - Ajout de pointer-events-none pour ne pas bloquer la souris ! */}
      <div className="absolute top-4 left-4 bg-black/60 text-white p-4 rounded-xl backdrop-blur-md border border-white/20 pointer-events-none select-none">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" /> Chasse aux risques
        </h3>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span className={`font-mono text-xl ${timeLeft < 30 ? 'text-red-400 animate-pulse' : ''}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-sm font-bold text-green-400">{hazardsFound.length} / 3 trouvés</div>
        </div>
        <ul className="text-sm space-y-1 opacity-80">
          <li className={hazardsFound.includes('rug') ? 'text-green-400 line-through font-bold' : ''}>
            - {hazardsFound.includes('rug') ? '✅' : '⬜'} Risque de chute
          </li>
          <li className={hazardsFound.includes('meds') ? 'text-green-400 line-through font-bold' : ''}>
            - {hazardsFound.includes('meds') ? '✅' : '⬜'} Intoxication
          </li>
          <li className={hazardsFound.includes('bed') ? 'text-green-400 line-through font-bold' : ''}>
            - {hazardsFound.includes('bed') ? '✅' : '⬜'} Ergonomie lit
          </li>
        </ul>
      </div>

      {/* BOUTON QUITTER (Doit rester cliquable donc pointer-events-auto) */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40 transition pointer-events-auto z-50"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      
      {/* ECRAN DE VICTOIRE */}
      {hazardsFound.length === 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white p-8 rounded-3xl text-center animate-fade-in-up shadow-2xl max-w-sm mx-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Zone Sécurisée !</h2>
            <p className="text-gray-600 mb-6">Bravo ! Vous avez identifié tous les dangers en {120 - timeLeft} secondes.</p>
            <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800 font-medium">
              +30 Points Sécurité
            </div>
            <button 
              onClick={onClose} 
              className="w-full bg-[#00aeb7] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#008b92] transform hover:scale-105 transition shadow-lg"
            >
              Retour au Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};