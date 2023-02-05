const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
})

module.exports = withPlugins([
  [withBundleAnalyzer],
  // your other plugins here
])

