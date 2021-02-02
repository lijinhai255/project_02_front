// next.config.js
const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css');
const withPlugins = require("next-compose-plugins");
const withImages = require('next-images')
const isProd = process.env.NODE_ENV === 'production'
module.exports = withImages({
    // Use the CDN in production and localhost for development.
    assetPrefix: isProd ? 'https://cdn.mydomain.com' : '',
  })
  module.exports = withPlugins([withSass,withCss], {
  webpack: (config) => {
    return config
  },
});
