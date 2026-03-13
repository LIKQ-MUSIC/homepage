'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { Extension } from '@tiptap/core'

const TabIndent = Extension.create({
  name: 'tabIndent',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent('    ')
      }
    }
  }
})

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TabIndent],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose-sm max-w-none focus:outline-none min-h-[400px] font-sarabun text-black dark:text-white text-[14pt] leading-normal prose-headings:text-black dark:prose-headings:text-white [&_h1]:text-black dark:[&_h1]:text-white [&_h2]:text-black dark:[&_h2]:text-white [&_h3]:text-black dark:[&_h3]:text-white prose-h1:text-[20pt] prose-h1:font-bold prose-h1:mb-2 prose-h1:mt-3 prose-h2:text-[18pt] prose-h2:font-bold prose-h2:mb-1 prose-h2:mt-2 prose-h3:text-[16pt] prose-h3:font-bold prose-h3:mb-1 prose-h3:mt-2 prose-p:leading-normal prose-p:mb-2 prose-p:text-[14pt] prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold prose-li:text-[14pt] prose-li:mb-1'
      }
    },
    immediatelyRender: false
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="relative">
      <BubbleMenu
        editor={editor}
        className="flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-[#0F172A] shadow-xl text-black dark:text-white"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            editor.isActive('bold')
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            editor.isActive('italic')
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Italic size={16} />
        </button>

        <div className="w-px bg-zinc-200 dark:bg-zinc-600 mx-1 my-2" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            editor.isActive('heading', { level: 1 })
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Heading1 size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            editor.isActive('heading', { level: 2 })
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            editor.isActive('heading', { level: 3 })
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px bg-zinc-200 dark:bg-zinc-600 mx-1 my-2" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            editor.isActive('bulletList')
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
            editor.isActive('orderedList')
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <ListOrdered size={16} />
        </button>
      </BubbleMenu>

      {/* Editor */}
      <div className="text-black dark:text-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
