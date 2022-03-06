/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  target: 'serverless',
  images: {
    domains: ['content.heuristic-mayer.159-65-28-78.plesk.page'] 
  }
}

module.exports = nextConfig
