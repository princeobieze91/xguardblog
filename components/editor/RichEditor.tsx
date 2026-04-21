"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Minus, Undo, Redo, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ content, onChange, placeholder = "Start writing your article..." }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary-500 hover:underline" } }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose-xguard min-h-[400px] outline-none p-6 focus:outline-none" },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const tools: Array<{ icon: React.ReactNode; action: () => void; active?: boolean; title: string }> = [
    { icon: <Bold className="w-4 h-4" />,          title: "Bold",          action: () => editor.chain().focus().toggleBold().run(),        active: editor.isActive("bold") },
    { icon: <Italic className="w-4 h-4" />,        title: "Italic",        action: () => editor.chain().focus().toggleItalic().run(),      active: editor.isActive("italic") },
    { icon: <Strikethrough className="w-4 h-4" />, title: "Strikethrough", action: () => editor.chain().focus().toggleStrike().run(),      active: editor.isActive("strike") },
    { icon: <Code className="w-4 h-4" />,          title: "Code",          action: () => editor.chain().focus().toggleCode().run(),        active: editor.isActive("code") },
    { icon: <LinkIcon className="w-4 h-4" />,      title: "Link",          action: addLink,                                               active: editor.isActive("link") },
    { icon: <List className="w-4 h-4" />,          title: "Bullet List",   action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: <ListOrdered className="w-4 h-4" />,   title: "Ordered List",  action: () => editor.chain().focus().toggleOrderedList().run(),active: editor.isActive("orderedList") },
    { icon: <Quote className="w-4 h-4" />,         title: "Blockquote",    action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { icon: <Minus className="w-4 h-4" />,         title: "Divider",       action: () => editor.chain().focus().setHorizontalRule().run() },
    { icon: <Undo className="w-4 h-4" />,          title: "Undo",          action: () => editor.chain().focus().undo().run() },
    { icon: <Redo className="w-4 h-4" />,          title: "Redo",          action: () => editor.chain().focus().redo().run() },
  ];

  const headings: Array<{ label: string; level: 1 | 2 | 3 }> = [
    { label: "H1", level: 1 }, { label: "H2", level: 2 }, { label: "H3", level: 3 },
  ];

  return (
    <div className="card-flat rounded-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-dark-100 dark:border-dark-700 bg-dark-50 dark:bg-dark-800">
        {headings.map(({ label, level }) => (
          <button
            key={label}
            type="button"
            title={`Heading ${level}`}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            className={cn("px-2 py-1 rounded text-xs font-bold transition-colors", editor.isActive("heading", { level }) ? "bg-primary-500 text-white" : "text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700")}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-5 bg-dark-200 dark:bg-dark-600 mx-1" />
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            title={tool.title}
            onClick={tool.action}
            className={cn("p-1.5 rounded transition-colors", tool.active ? "bg-primary-500 text-white" : "text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700")}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <EditorContent editor={editor} />

      {/* Word/char count */}
      <div className="px-6 py-2 border-t border-dark-100 dark:border-dark-700 text-xs text-dark-400 flex gap-4">
        <span>{editor.storage.characterCount.words()} words</span>
        <span>{editor.storage.characterCount.characters()} characters</span>
      </div>
    </div>
  );
}
