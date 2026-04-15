import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const tags: string[] = Array.isArray(body.tags) ? body.tags : [body.tag].filter(Boolean)

    if (tags.length === 0) {
      return NextResponse.json({ error: 'No tags provided' }, { status: 400 })
    }

    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 })
    }

    return NextResponse.json({ revalidated: true, tags })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
