import { OpenAIStream, OpenAIStreamPayload } from './OpenAIStream'

export const runtime = 'edge'

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export async function POST(req: Request) {
  const { bio } = (await req.json()) as {
    bio?: string
  }

  if (!bio) {
    return new Response('No prompt in the request', { status: 400 })
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
        Your job involves rephrasing statements into standard English with a casual and confident tone. 
        Focus on enhancing clarity and simplicity. Your suggestions cover everything from grammar and spelling to style and tone, 
        ensuring effective communication. Generate clear, compelling writing instantly. Shorten if needed.
        `,
      },
      { role: 'user', content: bio },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
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
