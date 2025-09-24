/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
    trailingSlash: true,
  basePath: "", // keep it empty
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // experimental: {
  //       // missingSuspenseWithCSRBailout: false,
  // },
};

module.exports = nextConfig;

// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   output: 'export', // replaces `next export`
//   distDir: 'out',   // build output folder
//   images: {
//     unoptimized: true,
//   },
// };

// export default nextConfig;
