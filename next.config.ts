import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/learning-app",
  images: { unoptimized: true },
};

export default nextConfig;
