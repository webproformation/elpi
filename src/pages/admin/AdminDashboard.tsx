import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../features/auth/AuthContext';

import { AdminLayout } from './AdminLayout';
import { AdminContent } from './AdminContent';
import { UserModal } from '../../components/admin/modals/UserModal';
import { AccessModal } from '../../components/admin/modals/AccessModal';
import { ResultsModal } from '../../components/admin/modals/ResultsModal';
import { ChapterModal, CategoryModal, FormationModal } from '../../components/admin/modals/ContentModals';
import { CharacterModal } from '../../components/admin/modals/CharacterModal';
import { ConfigModal } from '../../components/admin/ConfigModal'; 

export const AdminDashboard = () => {
  const { role, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  
  // Correction TS2322 : Ajout du type <any> pour éviter l'inférence 'never[]'
  const [data, setData] = useState<any>({ 
    users: [], 
    formations: [], 
    categories: [], 
    chapters: [], 
    gameConfigs: [], 
    characters: [] 
  });

  const [selection, setSelection] = useState({ 
    user: null as any, 
    formation: null as any, 
    config: null as any, 
    enrolls: [] as string[] 
  });

  const [loading, setLoading] = useState(false);
  
  // Correction TS2322 : Ajout du type <any>
  const [userStats, setUserStats] = useState<any>({ 
    scores: [], 
    progress: [], 
    badges: [] 
  });

  const [modals, setModals] = useState({ 
    user: false, 
    access: false, 
    results: false, 
    chapter: false, 
    category: false, 
    formation: false, 
    config: false, 
    character: false 
  });

  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [forms, setForms] = useState<any>({
    user: { email: '', password: '', first_name: '', last_name: '', role: 'student', address: '', phone: '' },
    chapter: { title: '', type: 'video' as any, url: '', content: '' },
    category: { name: '' },
    formation: { title: '', category_id: '' },
    character: { 
      first_name: '', 
      last_name: '', 
      description: '', 
      medical_history: '', 
      medications: '', 
      dietary_info: '', 
      assets: { neutral: null, happy: null, angry: null, confused: null } 
    }
  });

  useEffect(() => { if (!authLoading) loadData(); }, [activeTab, selection.formation, authLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: cat } = await supabase.from('categories').select('*').order('name');
      const { data: form } = await supabase.from('formations').select('*, categories(name), contents(id)');
      const { data: usr } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: gCfg } = await supabase.from('game_configs').select('*');
      const { data: chars } = await supabase.from('game_characters').select('*');
      let chaps = [];
      if (activeTab === 'chapters' && selection.formation) {
        const { data: c } = await supabase.from('contents').select('*').eq('formation_id', selection.formation.id).order('created_at');
        chaps = c || [];
      }
      setData({ 
        users: usr || [], 
        formations: form || [], 
        categories: cat || [], 
        chapters: chaps || [], 
        gameConfigs: gCfg || [], 
        characters: chars || [] 
      });
    } catch (err) { console.error("Erreur SQL:", err); }
    setLoading(false);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingUser) {
      const { data: a } = await supabase.auth.signUp({ email: forms.user.email, password: forms.user.password });
      if (a.user) await supabase.from('profiles').update({ ...forms.user, full_name: `${forms.user.first_name} ${forms.user.last_name}` }).eq('id', a.user.id);
    } else {
      await supabase.from('profiles').update({ ...forms.user, full_name: `${forms.user.first_name} ${forms.user.last_name}` }).eq('id', selection.user.id);
    }
    setModals({ ...modals, user: false }); loadData();
  };

  const handleSaveCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const finalAssets: any = { neutral: '', happy: '', angry: '', confused: '' };
    
    // Correction TS2358 : Forcer le type de file pour instanceof
    for (const [key, file] of Object.entries(forms.character.assets as Record<string, any>)) {
      if (file instanceof File) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from('character-assets').upload(fileName, file);
        if (!upErr) {
          const { data: urlData } = supabase.storage.from('character-assets').getPublicUrl(fileName);
          finalAssets[key] = urlData.publicUrl;
        }
      }
    }
    await supabase.from('game_characters').insert([{ ...forms.character, assets: finalAssets }]);
    setModals({ ...modals, character: false }); loadData();
    setLoading(false);
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#00aeb7]" /></div>;

  return (
    <AdminLayout 
      activeTab={activeTab} setActiveTab={setActiveTab} role={role} 
      formationTitle={selection.formation?.title} configTitle={selection.config?.title} 
      onAdd={() => {
        if(activeTab === 'users') { setIsCreatingUser(true); setModals({...modals, user: true}); }
        if(activeTab === 'categories') setModals({...modals, category: true});
        if(activeTab === 'formations') setModals({...modals, formation: true});
        if(activeTab === 'games') setModals({...modals, config: true});
        if(activeTab === 'characters') setModals({...modals, character: true});
        if(activeTab === 'chapters') { setEditingChapterId(null); setModals({...modals, chapter: true}); }
      }}
    >
      <AdminContent 
        activeTab={activeTab} loading={loading} data={data} 
        selection={selection}
        onUserResults={async (u:any) => { 
          setSelection({...selection, user: u}); 
          const { data: s } = await supabase.from('game_scores').select('*').eq('user_id', u.id); 
          const { data: p } = await supabase.from('user_progress').select('content_id').eq('user_id', u.id); 
          const { data: b } = await supabase.from('user_badges').select('*, badges(*)').eq('user_id', u.id); 
          setUserStats({ 
            scores: s || [], 
            progress: p?.map((i:any) => i.content_id) || [], 
            badges: b?.map((i:any) => i.badges) || [] 
          }); 
          setModals({...modals, results: true}); 
        }}
        onUserAccess={async (u:any) => { 
          const { data: e } = await supabase.from('enrollments').select('formation_id').eq('user_id', u.id); 
          setSelection({ ...selection, user: u, enrolls: e?.map((i:any) => i.formation_id) || [] }); 
          setModals({ ...modals, access: true }); 
        }}
        onUserEdit={(u:any) => { 
          setIsCreatingUser(false); 
          setSelection({ ...selection, user: u }); 
          setForms({ ...forms, user: { email: u.email, password: '', first_name: u.first_name || '', last_name: u.last_name || '', role: u.role, address: u.address || '', phone: u.phone || '' } }); 
          setModals({ ...modals, user: true }); 
        }}
        onManageChapters={(f:any) => { setSelection({ ...selection, formation: f }); setActiveTab('chapters'); }}
        onEditScenario={(cfg:any) => { setSelection({ ...selection, config: cfg }); setActiveTab('edit-game'); }}
        onDelete={async (t:string, id:string) => { 
          if(confirm("Supprimer ?")) { 
            await supabase.from(t).delete().eq('id', id); 
            loadData(); 
            if(activeTab === 'edit-game') setActiveTab('games'); 
          } 
        }}
        onEditChapter={(c:any) => { 
          setEditingChapterId(c.id); 
          setForms({ ...forms, chapter: { title: c.title, type: c.type, url: c.url || '', content: c.content || '' } }); 
          setModals({ ...modals, chapter: true }); 
        }}
        onSaveScenario={async (d:any) => { 
          await supabase.from('game_configs').update({ title: d.title, config_json: d.config_json }).eq('id', selection.config.id); 
          alert("Configuration enregistrée !"); 
          setActiveTab('games'); 
          loadData();
        }}
        onBack={() => setActiveTab('games')}
      />
      {modals.user && <UserModal isCreating={isCreatingUser} userData={forms.user} setUserData={(d:any)=>setForms({...forms, user:d})} onSave={handleSaveUser} onClose={()=>setModals({...modals, user:false})} />}
      {modals.access && <AccessModal user={selection.user} categories={data.categories} formations={data.formations} userEnrollments={selection.enrolls} onToggle={async (fid:string) => { if (selection.enrolls.includes(fid)) { await supabase.from('enrollments').delete().eq('user_id', selection.user.id).eq('formation_id', fid); setSelection(prev => ({...prev, enrolls: prev.enrolls.filter(i => i !== fid)})); } else { await supabase.from('enrollments').insert([{ user_id: selection.user.id, formation_id: fid }]); setSelection(prev => ({...prev, enrolls: [...prev.enrolls, fid]})); } }} onClose={()=>setModals({...modals, access:false})} />}
      {modals.results && <ResultsModal user={selection.user} stats={userStats} onClose={()=>setModals({...modals, results:false})} />}
      {modals.character && <CharacterModal show={modals.character} data={forms.character} setData={(d:any)=>setForms({...forms, character:d})} onSave={handleSaveCharacter} onClose={()=>setModals({...modals, character:false})} />}
      {modals.category && <CategoryModal show={modals.category} data={forms.category} setData={(d:any)=>setForms({...forms, category:d})} onSave={async (e:any)=>{e.preventDefault(); await supabase.from('categories').insert([forms.category]); setModals({...modals, category:false}); loadData();}} onClose={()=>setModals({...modals, category:false})} />}
      {modals.formation && <FormationModal show={modals.formation} data={forms.formation} setData={(d:any)=>setForms({...forms, formation:d})} categories={data.categories} onSave={async (e:any)=>{e.preventDefault(); await supabase.from('formations').insert([{...forms.formation, is_published:true}]); setModals({...modals, formation:false}); loadData();}} onClose={()=>setModals({...modals, formation:false})} />}
      {modals.chapter && <ChapterModal show={modals.chapter} data={forms.chapter} setData={(d:any)=>setForms({...forms, chapter:d})} editingId={editingChapterId} onSave={async (e:any)=>{e.preventDefault(); const cData = { ...forms.chapter, formation_id: selection.formation.id }; if (editingChapterId) await supabase.from('contents').update(cData).eq('id', editingChapterId); else await supabase.from('contents').insert([cData]); setModals({...modals, chapter:false}); loadData();}} onClose={()=>setModals({...modals, chapter:false})} />}
      
      {modals.config && <ConfigModal 
        isOpen={modals.config} 
        onSave={async (data: any) => {
          const initialJson = data.mechanic === '360' 
            ? { imageUrl: "", hotspots: [] } 
            : data.mechanic === 'planning'
              ? { tasks: [], incidents: [] }
              : { steps: [{ id: 1, speaker: "Suzie", emotion: "happy", text: "Bonjour !", choices: [] }] };
          
          const { data: nCfg, error } = await supabase.from('game_configs').insert([{
            title: data.title,
            game_type: data.room.toLowerCase(),
            mechanic: data.mechanic,
            config_json: initialJson,
            created_by: profile?.id
          }]).select().single(); 
          
          if(!error) { 
            setSelection({...selection, config: nCfg}); 
            setActiveTab('edit-game'); 
            setModals({...modals, config: false}); 
            loadData(); 
          } 
        }} 
        onClose={()=>setModals({...modals, config:false})} 
      />}
    </AdminLayout>
  );
}; 