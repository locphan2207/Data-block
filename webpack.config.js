var webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: './js/game.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '*']
  },
  devtool: 'source-map'
};
