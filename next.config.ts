import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bornosoftnr.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/tools/dsa/array", destination: "/tools/dsa/arrays", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Firebase Auth helper proxy (Option 3 from Firebase docs)
      {
        source: "/__/auth/:path*",
        destination: "https://diu-assingmnet-generator.firebaseapp.com/__/auth/:path*",
      },
      // Serve firebase init config from same origin to avoid cross-origin storage issues
      {
        source: "/__/firebase/init.json",
        destination: "/api/firebase-init",
      },
    ];
  },
};

export default nextConfig;
