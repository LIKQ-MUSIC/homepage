import Image from 'next/image'
import Link from 'next/link'
import { Title } from '@/ui/Typography'
import Button from '@/ui/Button'
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
            <Title className="!mb-0" level={3}>
              บทความล่าสุด
            </Title>
            <p className="text-gray-500 text-sm mt-1">
              เรื่องราว บทเรียน และแรงบันดาลใจจากพวกเรา
            </p>
          </div>
          <Link
            href="/blogs"
            className="text-sm font-medium text-[#153051] hover:text-[#1e4a7a] transition-colors underline-offset-4 hover:underline"
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
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 motion-safe:group-hover:scale-[1.02] h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
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
                    <time className="text-xs text-gray-400 mb-2 block">
                      {dayjs(post.published_at).format('D MMMM YYYY')}
                    </time>
                  )}
                  <h3 className="text-lg font-bold text-[#153051] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-3 text-primary text-sm font-medium group-hover:underline">
                    อ่านต่อ →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            href="/blogs"
            variant="primary"
            // Homepage is a forced-light brand surface; keep the pill navy even
            // when the OS sets html.dark (otherwise primary's dark: variant goes blue).
            className="h-auto px-6 py-3 rounded-full dark:bg-primary dark:hover:bg-primary-hover dark:active:bg-primary-active"
          >
            ดูบทความทั้งหมด
          </Button>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
