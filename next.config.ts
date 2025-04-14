/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org"],
  },
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.css$/i,
      include: /node_modules\/swiper/,
      use: ['style-loader', 'css-loader']
    });

    config.module.rules.push({
      test: /\.css$/i,
      exclude: /node_modules/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            url: false,
            modules: {
              auto: true,
              localIdentName: '[local]__[hash:base64:5]'
            }
          }
        }
      ]
    });

    return config;
  }
};

module.exports = nextConfig;