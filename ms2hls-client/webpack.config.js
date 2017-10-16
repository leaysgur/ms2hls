const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    recorder: './src/js/recorder/main.js',
    viewer: './src/js/viewer/main.js',
    reporter: './src/js/reporter/main.js',
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js',
  },
  plugins: [],
  devServer: {
    contentBase: `${__dirname}/public`,
    compress: true,
    watchContentBase: true,
    host: '0.0.0.0',
    port: 9000,
  }
};

if (isProd) {
  config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
}

module.exports = config;
