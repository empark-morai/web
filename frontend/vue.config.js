const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
  devServer: {
    proxy: {
        '/api': { 
            target: 'http://localhost:3000/api/', 
            changeOrigin: true, 
            pathRewrite:{ "^/api" : '' } 
        } 
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  },
})
