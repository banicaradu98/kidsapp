"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

interface Props {
  /** Controlled mode — parent manages state */
  value?: string;
  onChange?: (html: string) => void;
  /** Uncontrolled mode — for native <form> with server actions */
  defaultValue?: string;
  name?: string;
  placeholder?: string;
  minHeight?: number;
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // keep focus in editor
        onClick();
      }}
      className={`h-7 px-2 rounded text-sm font-bold transition-colors ${
        active
          ? "bg-[#ff5a2e] text-white"
          : "text-gray-600 hover:bg-orange-50 hover:text-[#ff5a2e]"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  defaultValue,
  name,
  placeholder = "Scrie ceva...",
  minHeight = 120,
}: Props) {
  const initialContent = value ?? defaultValue ?? "";
  const hiddenRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent || undefined,
    editorProps: {
      attributes: {
        class: "outline-none",
        // Emoji font stack direct pe contenteditable — fără să depindem de moștenire CSS
        style: [
          "font-family: var(--font-dm-sans), 'DM Sans', -apple-system, BlinkMacSystemFont,",
          "'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol',",
          "'Apple Color Emoji', 'Noto Color Emoji', system-ui, sans-serif",
        ].join(" "),
      },
      // Pass-through la paste: ProseMirror să nu normalizeze/strip-uiască nimic
      transformPastedText: (text: string) => text,
      transformPastedHTML: (html: string) => html,
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange?.(html);
      if (hiddenRef.current) hiddenRef.current.value = html;
    },
  });

  // Sync external value changes (e.g. parent resets form)
  useEffect(() => {
    if (!editor || value === undefined) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  // Sync hidden input initial value
  useEffect(() => {
    if (hiddenRef.current && editor) {
      hiddenRef.current.value = editor.getHTML();
    }
  }, [editor]);

  if (!editor) return null;

  function addLink() {
    const prev = editor?.getAttributes("link").href ?? "";
    const url = window.prompt("URL link:", prev);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  function addTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#ff5a2e] focus-within:ring-2 focus-within:ring-[#ff5a2e]/20 transition-all bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-orange-50 border-b border-gray-200">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <span className="underline">U</span>
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Titlu H2"
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Titlu H3"
        >
          H3
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Aliniere stânga"
        >
          ≡
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Aliniere centru"
        >
          ≡
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Aliniere dreapta"
        >
          ≡
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Listă puncte"
        >
          • —
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Listă numerotată"
        >
          1.—
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          active={editor.isActive("link")}
          onClick={addLink}
          title="Link"
        >
          🔗
        </ToolbarButton>

        <ToolbarButton
          active={false}
          onClick={addTable}
          title="Inserează tabel"
        >
          ⊞
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div
        className="px-4 py-3 text-sm text-gray-700"
        style={{ minHeight }}
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} className="rich-text" />
      </div>

      {name && <input ref={hiddenRef} type="hidden" name={name} />}
    </div>
  );
}
