import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.css$/i,
        include: /[\\/]src[\\/]components[\\/]custom[\\/]/,
        use: ['ignore-loader']
      });
    }
    return config;
  }
};

export default nextConfig;