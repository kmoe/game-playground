var path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/phaser.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist',
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, ]
  },
  resolve: {
    alias: {
      'pixi': pixi,
      'phaser': phaser,
      'p2': p2,
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: "pixi",
      p2: "p2"
  })
  ]
}