/** @type {import('next').NextConfig} */
const nextConfig = {
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