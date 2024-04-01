import { OpenAIStream, OpenAIStreamPayload } from './OpenAIStream'

export const runtime = 'edge'

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export async function POST(req: Request) {
  const {
    sentence,
    vibe,
    language = 'English',
  } = (await req.json()) as {
    sentence?: string
    vibe?: string
    language?: 'string'
  }

  if (!sentence) {
    return new Response('No prompt in the request', { status: 400 })
  }

  let content = `
        Revise sentences for proper ${language}, grammar, spelling, style, and tone.
        Make sure your revisions are clear and follow the given tone and style.
        Don't answer questions, just rephrase sentences.
        ${vibe ? `Tone and style: ${vibe}` : ''}
        `
  content = content.trim()

  const payload: OpenAIStreamPayload = {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content,
      },
      { role: 'user', content: sentence },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  // return stream response (SSE)
  return new Response(stream, {
    headers: new Headers({
      // since we don't use browser's EventSource interface, specifying content-type is optional.
      // the eventsource-parser library can handle the stream response as SSE, as long as the data format complies with SSE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#sending_events_from_the_server

      // 'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }),
  })
}
