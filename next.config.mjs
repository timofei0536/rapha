/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Webpack: Lightning CSS uses package.json browserslist (Turbopack already does).
  // Key is useLightningcss — experimental.lightningcss is ignored in Next 16.1.
  experimental: {
    useLightningcss: true,
  },
  sassOptions: {
    additionalData: `@import "@/styles/variables";`,
    silenceDeprecations: ["import", "slash-div"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rapha.tim-work.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "rapha.tim-work.com",
        pathname: "/**",
      },
      ...(process.env.NEXT_PUBLIC_WP_API_URL
        ? (() => {
            try {
              const u = new URL(process.env.NEXT_PUBLIC_WP_API_URL);
              return [
                { protocol: "https", hostname: u.hostname, pathname: "/**" },
                { protocol: "http", hostname: u.hostname, pathname: "/**" },
              ];
            } catch {
              return [];
            }
          })()
        : []),
    ],
  },
  // Safari caches localhost assets hard; no-store in dev avoids stale CSS/JS.
  async headers() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;