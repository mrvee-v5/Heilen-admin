import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // enables static export, generates `out/`
  images: {
    unoptimized: true, // Netlify can't run Next.js image optimizer
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
