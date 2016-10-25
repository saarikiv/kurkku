var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

var commonLoaders = [
	{ test: /\.js$/, loader: "jsx-loader" },
	{ test: /\.png$/, loader: "url-loader" },
	{ test: /\.jpg$/, loader: "file-loader" },
];

module.exports = [
  {
  name : "KURKKU web front-end",
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: ["babel-polyfill", "./app.jsx"],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }
    ]
  },
  output: {
    path: __dirname + "/public/",
    filename: "app.min.js"
  },
  plugins: debug ? [
    new ExtractTextPlugin("app.min.css", {
      allChunks: true
    }),
    new CopyWebpackPlugin([
      { from: 'index.html', to: '../public/index.html'},
			{ from: 'favicon.ico', to: '../public/favicon.ico'},
      { from: 'assets', to: '../public/assets'}
    ], {
    ignore: [],
    copyUnmodified: true
    })
  ] : [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new ExtractTextPlugin("app.min.css", {
      allChunks: true
    }),
    new CopyWebpackPlugin([
			{ from: 'index.html', to: '../public/index.html'},
			{ from: 'favicon.ico', to: '../public/favicon.ico'},
      { from: 'assets', to: '../public/assets'}
    ], {
    ignore: [],
    copyUnmodified: true
    })
  ],
}];
