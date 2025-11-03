/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'kuuuma.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    return config;
  },
}

module.exports = nextConfig
