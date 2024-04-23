/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['@repo/ui'],
  async redirects() {
    return [
      {
        source: '/blog/boost-your-writing-game-with-ai',
        destination: '/blog/boost-your-writing-with-ai',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
