/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/services/surgery--operating-room", destination: "/services/surgery-operating-room", permanent: true },
    ];
  },
  sassOptions: {
    additionalData: `@import "@/styles/variables";`
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rapha.tim-work.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;