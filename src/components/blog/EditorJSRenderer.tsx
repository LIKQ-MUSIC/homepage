import React from 'react'
import Image from 'next/image'

interface EditorJSBlock {
  id?: string
  type: string
  data: any
}

interface EditorJSData {
  time?: number
  blocks: EditorJSBlock[]
  version?: string
}

interface EditorJSRendererProps {
  data: EditorJSData
}

function renderBlock(block: EditorJSBlock, index: number) {
  switch (block.type) {
    case 'header': {
      const Tag = `h${block.data.level}` as keyof React.JSX.IntrinsicElements
      const sizeClasses: Record<number, string> = {
        1: 'text-3xl md:text-4xl font-bold mt-8 mb-4',
        2: 'text-2xl md:text-3xl font-bold mt-7 mb-3',
        3: 'text-xl md:text-2xl font-semibold mt-6 mb-3',
        4: 'text-lg md:text-xl font-semibold mt-5 mb-2'
      }
      return (
        <Tag
          key={index}
          className={`${sizeClasses[block.data.level] || sizeClasses[2]} text-heading`}
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      )
    }

    case 'paragraph':
      return (
        <p
          key={index}
          className="text-body leading-relaxed mb-4 text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      )

    case 'list': {
      const Tag = block.data.style === 'ordered' ? 'ol' : 'ul'
      const listClass =
        block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'
      return (
        <Tag
          key={index}
          className={`${listClass} pl-6 mb-4 space-y-1 text-body`}
        >
          {block.data.items.map((item: any, i: number) => {
            const text = typeof item === 'string' ? item : item.content
            return (
              <li
                key={i}
                className="text-base md:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )
          })}
        </Tag>
      )
    }

    case 'image':
      return (
        <figure key={index} className="my-6">
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              src={block.data.file?.url || block.data.url}
              alt={block.data.caption || ''}
              width={800}
              height={450}
              className={`w-full h-auto object-cover ${block.data.stretched ? '' : 'max-w-2xl mx-auto'} ${block.data.withBorder ? 'border border-default' : ''} ${block.data.withBackground ? 'bg-surface p-4' : ''}`}
            />
          </div>
          {block.data.caption && (
            <figcaption
              className="text-center text-sm text-muted mt-2"
              dangerouslySetInnerHTML={{ __html: block.data.caption }}
            />
          )}
        </figure>
      )

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-4 py-2 my-6 italic"
        >
          <p
            className="text-lg text-body"
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
          {block.data.caption && (
            <cite className="text-sm text-muted not-italic block mt-2">
              — {block.data.caption}
            </cite>
          )}
        </blockquote>
      )

    case 'code':
      return (
        <pre
          key={index}
          className="bg-[#1E293B] dark:bg-[#0F172A] text-gray-100 rounded-lg p-4 my-4 overflow-x-auto"
        >
          <code className="text-sm font-mono">{block.data.code}</code>
        </pre>
      )

    case 'delimiter':
      return (
        <div key={index} className="my-8 flex items-center justify-center">
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
          </div>
        </div>
      )

    case 'embed':
      return (
        <div key={index} className="my-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <iframe
              src={block.data.embed}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title={block.data.caption || 'Embedded content'}
            />
          </div>
          {block.data.caption && (
            <p
              className="text-center text-sm text-muted mt-2"
              dangerouslySetInnerHTML={{ __html: block.data.caption }}
            />
          )}
        </div>
      )

    default:
      return null
  }
}

export default function EditorJSRenderer({ data }: EditorJSRendererProps) {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return null
  }

  return (
    <div className="editorjs-renderer">
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
