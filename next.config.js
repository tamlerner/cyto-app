/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    // Handle PDF generation dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false
    };
    
    // Ignore node-specific modules
    config.resolve.fallback = {
      fs: false,
      path: false,
      stream: false,
      constants: false
    };
    
    return config;
  }
};

module.exports = nextConfig;