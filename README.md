<a href="https://www.rewritepal.com/">
  <img alt="RewritePal - Write Better, Communicate Better, Deliver More." src="https://rewritepal-official.vercel.app/opengraph-image.png">
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

First, install deps:

```bash
pnpm install
```

Second, run the development server:

```bash
pnpm dev
```

## Using Docker

First, build docker image:

```bash
sudo docker build -t rewritepal .
```

Second, run the server:

```bash
sudo docker run -p 3000:3000 rewritepal
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

### OG Image

- [OG Generator](https://og-playground.vercel.app/?share=nVTbjtowEP0V16sqL0brmJANESDtspXoA1LVrnYlxIshTuKtE0eJw6WIf-84IeVStZUqQIzPzDkzE8_kgNc6EjjEo0huljlCldkrMT4crI1QKmSSmhA5LqUfHdKCWxmZ9AaLZFUovgc0VmLXodZ-lqVYG6lz8K21qrO883Ilk_yzEVllXSI3ouxc73VlZLyfagBzm__aveLr70mp6zyaaqVL8N_FcfwrK7C-yR8iRH12Ab2devEpbdDjcZlPrDGqNslFZ-Mlhs6W-MSUSgFyR89Q94hQxstE2r4oehgUO6eRtBEbKbZPejcGB0Vs4Nufc6HnWLkT0JQARRTcpCgaO3PGPOIFsz57dH0CX9p8wPC9V3fI-A3q-jNg3KA913_1vSuBVnaRgdvzQB38lmglFxnE93yPByRoBXpgzQb-GSAUQmaM0sczxGhAXGYle332H9yhv5g_MKiQ_oucBhfUlrLIhtDZDXH4GxEewhlxfSjYUj04X1PTXvC3nE2rwHQmo3t7UXBpo3sYG_hvJgiW53YsXnQRIpfCTEy-im0pjfjC1egeIrsb_xNpQM4jzGh7OA2vRxvBNyuHnoSBnSBoqrOszuWaX2DPQsmNKNFcl-JDl9UW3VqYYF3YpaxweMDN2OMwgMXA7cZjm4ngSKzqBIcxV5UgWGT6Xb7sC_u6MNvmBDq2uk_ZSkQ4NGUtjgQbvoKIVCilt7pUET7-BA)
