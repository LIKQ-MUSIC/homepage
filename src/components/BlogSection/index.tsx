import Image from 'next/image'
import Link from 'next/link'
import { Title } from '@/ui/Typography'
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group block animate-scale-in"
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] h-full flex flex-col">
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

        <div className="mt-10 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#153051] text-white rounded-full hover:bg-[#1e4a7a] transition-colors font-medium"
          >
            ดูบทความทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
