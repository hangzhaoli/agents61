import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: '/private/spacex',
        destination: '/stocks/spcx',
        permanent: true,
      },
      {
        source: '/vs/:slug',
        destination: '/compare/:slug',
        permanent: true,
      },
      {
        source: '/alternatives/:slug',
        destination: '/compare/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
