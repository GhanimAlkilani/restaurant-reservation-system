module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://api.foodics.dev",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
