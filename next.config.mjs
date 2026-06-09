/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dhwaniastro.com",
      },
    ],
  },
};

export default nextConfig;
