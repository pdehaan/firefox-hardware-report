import path from 'path';

module.exports = {
  devtool: 'source-map',
  entry: './js/main.js',
  output: {
    path: path.join(__dirname, 'build', 'js'),
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.map.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ],
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
