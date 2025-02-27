/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase stability
  reactStrictMode: true,
  // Improve error reporting
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  // External packages configuration
  serverExternalPackages: [],
  // Experimental features
  experimental: {
    // Remove turbo boolean flag and use object if needed
    // Other experimental features can go here
  }
};

export default nextConfig;
