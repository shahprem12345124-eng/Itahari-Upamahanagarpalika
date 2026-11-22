/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async rewrites() {
    const internalHost = process.env.INTERNAL_API_HOSTPORT;
    if (!internalHost) return [];
    const internalApi = /^https?:\/\//.test(internalHost)
      ? internalHost
      : `http://${internalHost}`;

    return [
      { source: "/api/:path*", destination: `${internalApi}/api/:path*` },
      { source: "/uploads/:path*", destination: `${internalApi}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
