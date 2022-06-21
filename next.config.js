const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    domains: ["links.papareact.com"]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false
      }
    }

    return config;
  }
}
module.exports = nextConfig
