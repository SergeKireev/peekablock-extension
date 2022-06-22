const path = require('path');

module.exports = {
  entry: './popup/src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'popup/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  }
};