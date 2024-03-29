import Alert from '@/app/blog/_components/alert'
import Container from '@/app/blog/_components/container'
import Header from '@/app/blog/_components/header'
import { PostBody } from '@/app/blog/_components/post-body'
import { PostHeader } from '@/app/blog/_components/post-header'
import { getAllPosts, getPostBySlug } from '@/app/blog/lib/api'
import { CMS_NAME } from '@/app/blog/lib/constants'
import markdownToHtml from '@/app/blog/lib/markdownToHtml'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const content = await markdownToHtml(post.content || '')

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
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

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`

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
