"use client";

import { useEffect, useRef } from "react";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

import { useMutation } from "@apollo/client/react";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Link2,
  ImageIcon,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
} from "lucide-react";
import { UPLOAD_IMAGE } from "@/app/graphQL/astroHiring";

export default function TapEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
}) {
  const fileRef = useRef(null);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),

      Underline,

     Link.configure({
  openOnClick: true,
  autolink: true,
  defaultProtocol: "https",
  HTMLAttributes: {
    target: "_blank",
    rel: "noopener noreferrer",
    class: "text-blue-600 underline",
  },
}),

      Image.configure({
        inline: false,
      }),

      TextStyle,

      Color.configure(),
      Highlight.configure(),

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
          "bulletList",
          "orderedList",
          "listItem",
        ],
      }),

      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm lg:prose max-w-none min-h-[150px] px-2 py-4 focus:outline-none",
      },
    },

    immediatelyRender: false,

    content: value,

    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();

    if (current !== (value || "")) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const res = await uploadImage({
        variables: {
          file,
        },
      });

      const url = res.data.uploadImage.url;

      editor?.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error(err);
    }
    e.target.value = "";
  };

const insertLink = () => {
  const url = window.prompt("Enter URL");

  if (url === null) return;

  if (url.trim() === "") {
    editor.chain().focus().unsetLink().run();
    return;
  }

 let finalUrl = url.trim();

if (
  !finalUrl.startsWith("http://") &&
  !finalUrl.startsWith("https://")
) {
  finalUrl = `https://${finalUrl}`;
}

editor?.chain().focus().extendMarkRange("link")?.setLink({href: finalUrl,target: "_blank",rel: "noopener noreferrer",}).run();
};

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileRef}
        onChange={handleImageUpload}
      />

      {editor && (
        <Toolbar editor={editor} fileRef={fileRef} insertLink={insertLink} />
      )}

      <EditorContent
        editor={editor}
        className="border rounded-b-xl bg-white tiptap"
      />
    </div>
  );
}
const Toolbar = ({ editor, fileRef, insertLink }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      bold: ctx.editor.isActive("bold"),
      italic: ctx.editor.isActive("italic"),
      underline: ctx.editor.isActive("underline"),
      strike: ctx.editor.isActive("strike"),
      bullet: ctx.editor.isActive("bulletList"),
      ordered: ctx.editor.isActive("orderedList"),
      quote: ctx.editor.isActive("blockquote"),
      highlight: ctx.editor.isActive("highlight"),
    }),
  });

  const stop = (e) => e.preventDefault();

  const getHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) return `h${i}`;
    }
    return "paragraph";
  };

  const changeHeading = (e) => {
    const value = e.target.value;

    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
      return;
    }

    editor
      .chain()
      .focus()
      .toggleHeading({ level: Number(value.replace("h", "")) })
      .run();
  };

  const btn = (active) =>
    `h-6 w-9 rounded-md flex items-center justify-center transition
    ${active ? "bg-purple-600 text-white" : "hover:bg-gray-200 text-gray-700"}`;

  return (
    <div className="flex flex-wrap gap-2 border rounded-t-xl bg-gray-100 p-2">
      {/* Undo */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().undo().run()}
        className={btn(false)}
      >
        <Undo2 size={16} />
      </button>

      {/* Redo */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().redo().run()}
        className={btn(false)}
      >
        <Redo2 size={16} />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Bold */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editorState.bold)}
      >
        <Bold size={16} />
      </button>

      {/* Italic */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editorState.italic)}
      >
        <Italic size={16} />
      </button>

      {/* Underline */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editorState.underline)}
      >
        <UnderlineIcon size={16} />
      </button>

      {/* Strike */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btn(editorState.strike)}
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Heading */}
      <select
        value={getHeading()}
        onChange={changeHeading}
        className="border rounded px-2 h-9 bg-white"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Bullet */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editorState.bullet)}
      >
        <List size={16} />
      </button>

      {/* Ordered */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editorState.ordered)}
      >
        <ListOrdered size={16} />
      </button>

      {/* Quote */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editorState.quote)}
      >
        <Quote size={16} />
      </button>

      {/* Divider */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn(false)}
      >
        <Minus size={16} />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Link */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={insertLink}
        className={btn(false)}
      >
        <Link2 size={16} />
      </button>

      {/* Image */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => fileRef.current.click()}
        className={btn(false)}
      >
        <ImageIcon size={16} />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Highlight */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor?.chain().focus().toggleHighlight().run()}
        className={btn(editorState.highlight)}
      >
        <Highlighter size={16} />
      </button>

      {/* Color */}
      <input
        type="color"
        onMouseDown={stop}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="w-9 h-9 cursor-pointer border rounded"
      />

      <div className="w-px bg-gray-300 mx-1" />

      {/* Align Left */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        className={btn(false)}
      >
        <AlignLeft size={16} />
      </button>

      {/* Center */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btn(false)}
      >
        <AlignCenter size={16} />
      </button>

      {/* Right */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        className={btn(false)}
      >
        <AlignRight size={16} />
      </button>

      {/* Justify */}
      <button
        type="button"
        onMouseDown={stop}
        onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        className={btn(false)}
      >
        <AlignJustify size={16} />
      </button>
    </div>
  );
};
