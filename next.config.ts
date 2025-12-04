import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/s/files/**",
      },
    ],
  },
  // webpack: (config, { dev, isServer }) => {
  //   if (dev && !isServer) {
  //     config.devtool = "eval-cheap-module-source-map";
  //   }
  //   return config;
  // },
};

export default nextConfig;
