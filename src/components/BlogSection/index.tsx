import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils'
import dayjs from '@/utils/dayjs'
import { MarkArrow } from '@/components/home/marks'

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

/**
 * The label lane's writing. Pale field, so ink and obsidian carry the text.
 * Posts sit on paper because that is what the light has resolved into by this
 * point on the page.
 */
const BlogSection = ({ posts }: BlogSectionProps) => {
  if (!posts || posts.length === 0) return null

  return (
    <section id="blog" className="station">
      <div className="station-inner">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="station-title text-likq-ink">บทความล่าสุด</h2>
            <p className="station-lede mt-4 text-likq-obsidian">
              เรื่องราว บทเรียน และแรงบันดาลใจจากพวกเรา
            </p>
          </div>
          <Link
            href="/blogs"
            className="copy-th inline-flex items-center gap-2.5 text-base text-likq-ink underline-offset-8 hover:underline"
          >
            ดูทั้งหมด
            <MarkArrow className="h-5 w-5" />
          </Link>
        </div>

        <div
          className={cn([
            'mt-12 grid gap-6',
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
              className="group block rounded-[1.5rem] transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-likq-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_36px_-20px_rgba(16,6,159,0.4)]">
                <div className="relative aspect-video overflow-hidden bg-likq-lavender-pale">
                  {post.thumbnail_url ? (
                    <Image
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-likq-navy to-likq-lavender">
                      <span className="display-lockup text-6xl text-white/40">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {post.published_at && (
                    <time className="copy-th mb-2 block text-xs text-likq-obsidian/75">
                      {dayjs(post.published_at).format('D MMMM YYYY')}
                    </time>
                  )}
                  <h3 className="copy-th mb-2 line-clamp-2 text-lg font-bold text-likq-ink">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="copy-th line-clamp-2 flex-1 text-sm text-likq-obsidian/85">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="copy-th mt-4 inline-flex items-center gap-2 text-sm font-bold text-likq-ink">
                    อ่านต่อ
                    <MarkArrow className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
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
