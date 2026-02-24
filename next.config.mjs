/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
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
};

export default nextConfig;