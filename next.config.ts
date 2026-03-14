/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  skipWaiting: true,
  register: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig);
