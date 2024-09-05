<a href="https://www.rewritepal.com/">
  <h1 align="center">RewritePal</h1>
</a>

# Features

- [Next.js](https://nextjs.org) App Router
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming completion UI
- Support for OpenAI (default), Anthropic, Cohere, Hugging Face, or custom AI chat models and/or LangChain
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Radix UI](https://radix-ui.com) for headless component primitives
  - Icons from [Phosphor Icons](https://phosphoricons.com)
- Rate limiting, and views count with [Vercel KV](https://vercel.com/storage/kv)
- State management in React with [Zustand](https://zustand-demo.pmnd.rs/)

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Remember to update your environment variables in the .env file with the appropriate credentials.

## Components

### Shadcn

https://ui.shadcn.com/docs

To add new shadcn/ui components:

```bash
pnpm dlx shadcn@latest add
```
