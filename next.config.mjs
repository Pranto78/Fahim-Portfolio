/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        pathname: "/hxwgLyVM/fsp-logo-icon.jpg",
      },
    ],
  },
};

export default nextConfig;
