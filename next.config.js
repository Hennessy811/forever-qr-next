const { withPlausibleProxy } = require("next-plausible")

module.exports = withPlausibleProxy()({
  reactStrictMode: true,
  images: {
    domains: ["avatars.dicebear.com"],
  },
})
