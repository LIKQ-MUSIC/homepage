import Image from 'next/image'
import Link from 'next/link'
import { Title } from '@/ui/Typography'
import { cn } from '@/utils'
import dayjs from '@/utils/dayjs'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  thumbnail_url: string | null
  published_at: string | null
}

interface BlogSectionProps {
  posts: BlogPost[]
}

const BlogSection = ({ posts }: BlogSectionProps) => {
  if (!posts || posts.length === 0) return null

  return (
    <section id="blog" className="py-16 md:py-24 px-4 md:px-8">
      {/* Blog Posts */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-prompt text-3xl md:text-4xl font-bold text-ink-text">
              บทความล่าสุด
            </h3>
            <p className="text-ink-muted text-sm mt-2">
              เรื่องราว บทเรียน และแรงบันดาลใจจากพวกเรา
            </p>
          </div>
          <Link
            href="/blogs"
            className="font-archivo text-sm font-semibold uppercase tracking-[0.18em] text-secondary transition-colors underline-offset-8 hover:underline"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        <div
          className={cn([
            'grid gap-6',
            // Balance the layout when the API returns only one or two posts
            // instead of leaving a lone card stranded in a 3-up grid.
            posts.length === 1 && 'max-w-sm mx-auto',
            posts.length === 2 && 'sm:grid-cols-2 max-w-3xl mx-auto',
            posts.length >= 3 && 'sm:grid-cols-2 md:grid-cols-3'
          ])}
        >
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group block animate-scale-in"
            >
              <article className="bg-ink-raise border border-ink-line rounded-sm overflow-hidden hover:border-secondary/60 transition-all duration-300 h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-ink-panel">
                  {post.thumbnail_url ? (
                    <Image
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#153051] to-[#B4A7D6]">
                      <span className="text-white/30 text-5xl font-bold">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  {post.published_at && (
                    <time className="text-xs text-ink-muted mb-2 block">
                      {dayjs(post.published_at).format('D MMMM YYYY')}
                    </time>
                  )}
                  <h3 className="text-lg font-bold text-ink-text mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-ink-muted text-sm line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-3 text-secondary text-sm font-medium group-hover:underline">
                    อ่านต่อ →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}

export default BlogSection
