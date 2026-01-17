"use client";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
// import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function TapEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write something...",
            }),
        ],
        editorProps: {
            attributes: {
               class: "focus:outline-none w-full min-h-[100px] text-sm"

            },
        },
        content:"",
        // onUpdate : ({ editor }) => {      
        //     onChange?.(editor.getHTML());   
            
        // },
                immediatelyRender: false,
    });

    return (
        <div className="flex flex-col gap-1 w-full">
            {editor && <Toolbar editor={editor} />}
            <EditorContent
                editor={editor}
                className="edit-place focus:border-0 focus:ring-0 border border-gray-200 rounded-md p-2 "
            />
        </div>
    );
}

const Toolbar = ({ editor }) => {
    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                isBold: ctx.editor.isActive("bold") ?? false,
                isItalic: ctx.editor.isActive("italic") ?? false,
                isStrike: ctx.editor.isActive("strike") ?? false,
                isUnderline: ctx.editor.isActive("underline") ?? false,
                isParagraph: ctx.editor.isActive('paragraph') ?? false,
                isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
                isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
                isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
                isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
                isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
                isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
                // isBulletList: ctx.editor.isActive('bulletList') ?? false,
                // isOrderedList: ctx.editor.isActive('orderedList') ?? false,
                // isBlockquote: ctx.editor.isActive('blockquote') ?? false,

            };
        },
    });

    const getCurrentHeading = () => {
        for (let level = 1; level <= 6; level++) {
            if (editor.isActive('heading', { level })) {
                return `h${level}`;
            }
        }
        return 'paragraph';
    };

    const handleChange = (e) => {
        const value = e.target.value;

        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else {
            const level = Number(value.replace('h', ''));
            editor.chain().focus().toggleHeading({ level }).run();
        }
    };

    return (
        <div className="flex gap-2 items-center bg-gray-300 border border-gray-200 rounded-md shadow-2xl px-4 py-0.5 w-full">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded-md text-xs font-bold transition  ${editorState.isBold
                    ? "bg-gray-500 text-white"
                    : "bg-transparent text-black hover:bg-gray-100"
                    }`}
            >
                B
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded-md text-xs italic transition ${editorState.isItalic ? "bg-gray-500 text-white" : "hover:bg-gray-100"
                    }`}
            >
                I
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`px-2 py-1 rounded-md text-xs line-through transition ${editorState.isStrike ? "bg-gray-500 text-white" : "hover:bg-gray-100"
                    } `}
            >
                Strike
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 rounded-md text-xs underline transition ${editorState.isUnderline ? "bg-gray-500 text-white" : "hover:bg-gray-100"
                    } `}
            >
                U
            </button>
            <select
                value={getCurrentHeading()}
                onChange={handleChange}
                className="px-2 py-1 text-xs border rounded-md bg-white"
            >
                <option value="paragraph">Select font size</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
            </select>

            {/* <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 rounded-md text-xs underline transition ${editorState.isBulletList ? "bg-gray-500 text-white" : "hover:bg-gray-100"
                    } `}>
                Bullet list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2 py-1 rounded-md text-xs underline transition ${editorState.isOrderedList ? "bg-gray-500 text-white" : "hover:bg-gray-100"
                    } `}>
                Ordered list
            </button>

            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`px-2 py-1 rounded-md text-xs underline transition ${editorState.isBlockquote ? "bg-gray-500 text-white" : "hover:bg-gray-100"
                    } `}>
                Blockquote
            </button> */}
        </div>
    );
};
