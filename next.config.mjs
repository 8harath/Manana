/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove these for production - fix errors instead
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  
  // Enable image optimization for Vercel
  images: {
    domains: ['lh3.googleusercontent.com'], // Add domains for Google profile images
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Compress responses
  compress: true,
  
  // Enable SWC minification
  swcMinify: true,
}

export default nextConfig
