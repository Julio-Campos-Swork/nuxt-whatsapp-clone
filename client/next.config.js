/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID: 1756668346,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "aee7a64eda2b1cf1f8bf55a7f8b1c616",
  },
  images:{
    domains: ["localhost"]
  }
};

module.exports = nextConfig;
