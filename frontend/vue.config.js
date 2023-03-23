const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
        '/api': { 
            target: 'http://localhost:3000/api/', 
            changeOrigin: true, 
            pathRewrite:{ "^/api" : '' } 
        } 
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  }
})