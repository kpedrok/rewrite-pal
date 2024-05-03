import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '../_components/container'
import { PostBody } from '../_components/post-body'
import { PostHeader } from '../_components/post-header'
import { getAllPosts, getPostBySlug } from '../lib/api'
import markdownToHtml from '../lib/markdownToHtml'

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const content = await markdownToHtml(post.content || '')

  return (
    <main>
      {/* <Alert preview={post.preview} /> */}
      <Container>
        {/* <Header /> */}
        <article className='mb-32'>
          <PostHeader title={post.title} coverImage={post.coverImage} date={post.date} author={post.author} />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const title = `${post.title} | RewritePal Blog`

  return {
    title,
    // openGraph: {
    //   title,
    //   images: [post.ogImage.url],
    // },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
