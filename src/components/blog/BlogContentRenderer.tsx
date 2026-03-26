import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Bell,
  ShoppingBag
} from 'lucide-react'
import dayjs from '@/utils/dayjs'
import EditorJSRenderer from './EditorJSRenderer'
import { OutputData } from '@editorjs/editorjs'
import { ThemeToggle } from '@/components/ThemeToggle'
import Button from '@/ui/Button'

interface BlogContentRendererProps {
  blog: {
    title: string
    slug?: string
    excerpt?: string
    thumbnail_url?: string
    content: OutputData
    published_at?: string | null
    author?: {
      name: string
      avatar_url?: string
    } | null
    read_time?: string
  }
  isPreview?: boolean
  onBack?: () => void
}

export default function BlogContentRenderer({
  blog,
  isPreview = false,
  onBack
}: BlogContentRendererProps) {
  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Top Controls Bar */}
      <div className="sticky top-0 z-[100] w-full border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isPreview ? (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline">Back to Editor</span>
              </button>
            ) : (
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors group"
              >
                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline">Back to Blog</span>
              </Link>
            )}

            {isPreview && (
              <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800 animate-pulse">
                Preview Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Future Product/Profile Nav Placeholders */}
            <button
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Products"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

            <ThemeToggle />

            {/* Profile Placeholder */}
            <button className="ml-1 p-1 rounded-full border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {/* Placeholder Avatar */}
                {blog.author?.name?.charAt(0) || 'U'}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
            {blog.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={blog.published_at}>
                  {dayjs(blog.published_at).format('MMMM D, YYYY')}
                </time>
              </div>
            )}
            {(blog.read_time || isPreview) && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.read_time || '5 min read'}</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight text-balance">
            {blog.title || 'Untitled Post'}
          </h1>

          {blog.excerpt && (
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto md:mx-0 text-balance">
              {blog.excerpt}
            </p>
          )}

          {/* Author Info */}
          <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-900 shadow-md">
              {blog.author?.avatar_url ? (
                <Image
                  src={blog.author.avatar_url}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-400">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900 dark:text-white">
                {blog.author?.name || 'Anonymous Author'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Content Creator
              </p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {blog.thumbnail_url && (
          <div className="relative w-full aspect-[1200/630] rounded-2xl overflow-hidden mb-16 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <Image
              src={blog.thumbnail_url}
              alt={blog.title}
              fill
              priority
              className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        )}

        {/* Content Divider */}
        <hr className="border-slate-200 dark:border-slate-800 mb-16 w-full" />

        {/* Blog Content */}
        <div
          className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-lg
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate-900 prose-pre:shadow-xl prose-pre:border prose-pre:border-slate-800
        "
        >
          <EditorJSRenderer data={blog.content} />
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {!isPreview && (
              <Link href="/blogs" passHref>
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-3 gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to all posts
                </Button>
              </Link>
            )}

            {/* Share/Socials Placeholder */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Share this post
              </span>
              <div className="flex gap-2">
                {/* Social Icons would go here */}
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
