import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/products",
        destination: "/",
        permanent: true,
      },
      // Wildcard path matching
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      {
        protocol: "https",
        hostname: "https://broken.link.for.testing.notexistingtopleveldomain",
        pathname: "/**",
      },
      // Add other allowed image hosts here. For unknown/broken URLs use a
      // fallback in the UI (e.g. <img> with onError or placeholder).
    ],
  },
};

export default nextConfig;
