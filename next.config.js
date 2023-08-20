const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.steamstatic.com','community.cloudflare.steamstatic.com'],
  },
  api: {
    bodyParser: false,
  },
};

module.exports = nextConfig;
