/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["@trpc/server", "@trpc/client", "@trpc/react-query"],
};

module.exports = config;
