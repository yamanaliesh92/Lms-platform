import plugin from "next-intl/plugin";

const withNextIntl = plugin();

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "utfs.io" }],
  },
};

export default withNextIntl(nextConfig);
