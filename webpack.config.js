const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: __dirname + '/src/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public', 'assets', 'js')
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  target: ['web', 'es5'],
  devtool: 'source-map'
};
