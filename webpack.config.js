const path = require('path');

module.exports = {
  entry: './js/main.js',
  output: {
    path: path.join(__dirname, 'build', 'js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ],
  },
};
