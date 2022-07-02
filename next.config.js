/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'pixabay.com',
      'cdn.pixabay.com',
      'img.seadn.io',
    ],
  },
};

module.exports = nextConfig;
