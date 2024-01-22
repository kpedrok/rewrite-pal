## Features

- [Next.js](https://nextjs.org) App Router
- React Server Components (RSCs), Suspense, and Server Actions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming chat UI
- Support for OpenAI (default), Anthropic, Cohere, Hugging Face, or custom AI chat models and/or LangChain
- Styling
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Daisy UI] (https://daisyui.com) for component library
  - Icons from [Phosphor Icons](https://phosphoricons.com)
    <!-- - Chat History, rate limiting, and session storage with [Vercel KV](https://vercel.com/storage/kv) -->
    <!-- - [NextAuth.js](https://github.com/nextauthjs/next-auth) for authentication -->
    <!-- https://ui.shadcn.com/docs/components/accordion -->

## Model Providers

This template ships with OpenAI `gpt-3.5-turbo` as the default. However, thanks to the [Vercel AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to Anthropic, Cohere, Hugging Face, or using [LangChain](https://js.langchain.com) with just a few lines of code.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Inspired by:

- https://vercel.com/templates/next.js/nextjs-ai-chatbot
- https://vercel.com/templates/next.js/ai-emoji-generator
