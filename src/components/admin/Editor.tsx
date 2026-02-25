import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, 
  ListOrdered, Heading1, Heading2, Quote, Undo, Redo 
} from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btnClass = (active: boolean) => 
    `p-2 rounded transition-colors ${active ? 'bg-[#00aeb7] text-white' : 'hover:bg-slate-200 text-slate-600'}`;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><UnderlineIcon size={18} /></button>
      <div className="w-px h-6 bg-slate-300 mx-1 align-middle self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18} /></button>
      <div className="w-px h-6 bg-slate-300 mx-1 align-middle self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18} /></button>
      <div className="ml-auto flex gap-1">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 hover:text-[#00aeb7] transition-colors"><Undo size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 hover:text-[#00aeb7] transition-colors"><Redo size={18} /></button>
      </div>
    </div>
  );
};

export const Editor = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#00aeb7] transition-all bg-white">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[250px] max-h-[500px] overflow-y-auto prose prose-slate max-w-none focus:outline-none" 
      />
    </div>
  );
};