import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
      domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
};

export default nextConfig;
