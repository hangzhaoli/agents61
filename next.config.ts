import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ['@polymarket/clob-client'],
  async redirects() {
    return [
      // SpaceX graduated to public equity (SPCX) — permanent SEO redirect off private desk.
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
      // Prediction Desk canonical URLs
      {
        source: '/prediction-markets',
        destination: '/predictions',
        permanent: true,
      },
      {
        source: '/prediction-markets/:id',
        destination: '/predictions/:id',
        permanent: true,
      },
    ];
  },
  // Apex host is https://agents61.com. www→apex is in vercel.json (host match).
  // http→https is automatic on Vercel when the domain has HTTPS enabled.
  // Also set Primary Domain = agents61.com (not www) in the Vercel project Domains UI.
};

export default nextConfig;
