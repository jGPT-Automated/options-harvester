import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: false
  }
};
export default nextConfig;
