var path = require("path");

module.exports = {
  entry: "./public/js/game.js",
  output: {
    path: path.resolve(__dirname, './public'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/],
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: {
          presets: ["env"]
        }
      }
    ]
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
};
