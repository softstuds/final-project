const path = require('path');
module.exports = {
  devServer: {
    proxy: {
      '^/': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        "secure": false,
        ws: false
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.vue'],
      alias: {
        '@': path.resolve('.')
      }
    }
  }
};
