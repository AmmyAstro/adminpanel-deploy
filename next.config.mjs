/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
     {
      protocol: "https",
      hostname: "dhwaniastro.com",
    },
    {
      protocol: "https",
      hostname: "www.dhwaniastro.com",
    },
    ],
  },
};

export default nextConfig;
