/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    additionalData: `@import "@/styles/variables";`
  }
};

export default nextConfig;