import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../features/auth/AuthContext';
import { ArrowLeft, Video, FileText, Type, Loader2, CheckCircle2 } from 'lucide-react';

export const FormationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formation, setFormation] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && user) fetchFormation();
  }, [id, user]);

  const fetchFormation = async () => {
    const { data: form } = await supabase.from('formations').select('*').eq('id', id).single();
    const { data: chaps } = await supabase.from('contents').select('*').eq('formation_id', id).order('created_at');
    const { data: progress } = await supabase.from('user_progress').select('content_id').eq('user_id', user?.id);
    
    if (form) setFormation(form);
    if (chaps && chaps.length > 0) {
      setChapters(chaps);
      setCurrentChapter(chaps[0]);
    }
    if (progress) setCompletedChapters(progress.map(p => p.content_id));
  };

  const toggleComplete = async () => {
    if (!currentChapter || !user) return;
    setSaving(true);

    if (completedChapters.includes(currentChapter.id)) {
      await supabase.from('user_progress').delete().eq('user_id', user.id).eq('content_id', currentChapter.id);
      setCompletedChapters(prev => prev.filter(id => id !== currentChapter.id));
    } else {
      await supabase.from('user_progress').insert([{ user_id: user.id, content_id: currentChapter.id }]);
      setCompletedChapters(prev => [...prev, currentChapter.id]);
    }
    setSaving(false);
  };

  if (!formation) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#00aeb7]" /></div>;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="p-6 border-b bg-white">
          <button onClick={() => navigate('/app/catalog')} className="text-xs font-bold text-[#00aeb7] flex items-center gap-1 mb-4 hover:underline">
            <ArrowLeft size={14} /> CATALOGUE
          </button>
          <h1 className="font-extrabold text-slate-800 leading-tight">{formation.title}</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chapters.map((chap, idx) => (
            <button 
              key={chap.id}
              onClick={() => setCurrentChapter(chap)}
              className={`w-full p-4 rounded-xl text-left flex items-center gap-3 transition ${currentChapter?.id === chap.id ? 'bg-white shadow-md border-2 border-[#00aeb7]' : 'hover:bg-slate-200 opacity-70'}`}
            >
              <div className="relative">
                <div className="text-xs font-bold text-slate-400">{idx + 1}</div>
                {completedChapters.includes(chap.id) && <CheckCircle2 size={14} className="absolute -top-2 -right-2 text-green-500 fill-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 line-clamp-1">{chap.title}</p>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 mt-1">
                  {chap.type === 'video' ? <Video size={10}/> : chap.type === 'pdf' ? <FileText size={10}/> : <Type size={10}/>}
                  {chap.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/30">
        {currentChapter ? (
          <div className="max-w-4xl mx-auto p-8 lg:p-16 bg-white min-h-screen shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl font-black text-slate-900 flex-1 pr-4">{currentChapter.title}</h2>
              <button 
                onClick={toggleComplete}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition shadow-lg ${completedChapters.includes(currentChapter.id) ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-[#00aeb7] hover:text-white'}`}
              >
                {completedChapters.includes(currentChapter.id) ? <><CheckCircle2 size={20}/> Terminé</> : 'Marquer comme lu'}
              </button>
            </div>
            
            {currentChapter.type === 'video' && (
              <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black mb-8">
                <iframe src={currentChapter.url.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen />
              </div>
            )}

            {currentChapter.type === 'pdf' && (
              <div className="bg-slate-100 p-12 rounded-3xl border-2 border-dashed border-slate-300 text-center mb-8">
                <FileText size={64} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 font-bold mb-6">Support PDF prêt pour la lecture.</p>
                <a href={currentChapter.url} target="_blank" rel="noreferrer" className="inline-block bg-[#00aeb7] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#008c93]">Ouvrir le PDF</a>
              </div>
            )}

            {currentChapter.type === 'text' && (
              <div className="prose prose-slate prose-lg max-w-none prose-headings:text-[#00aeb7] prose-strong:text-slate-900" dangerouslySetInnerHTML={{ __html: currentChapter.content }} />
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 italic">Chargement du chapitre...</div>
        )}
      </div>
    </div>
  );
};