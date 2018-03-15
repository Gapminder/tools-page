const path = require('path');

const webpack = require('webpack');
const poststylus = require('poststylus');
const postcssUrl = require('postcss-url');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StylusLoaderPlugin = require('stylus-loader');
const customLoader = require('custom-loader');

const __PROD__ = process.env.NODE_ENV === 'production';
const sep = '\\' + path.sep;
const stats = {
  colors: true,
  hash: false,
  version: false,
  timings: true,
  assets: false,
  chunks: false,
  modules: false,
  reasons: true,
  children: false,
  source: false,
  errors: true,
  errorDetails: true,
  warnings: true,
  publicPath: false
};

const deployUrl = "/tools";
//const extractSCSS = new ExtractTextPlugin('assets/css/main.css');
const extractStyl = new ExtractTextPlugin('styles.css');

customLoader.loaders = {
  ['tool-config-loader'](source) {
    this.cacheable && this.cacheable();

    this.value = [source];
    return `var VIZABI_MODEL = ${source};`;
  }
};

const toolspage = {
  devtool: 'source-map',

  entry: {
    toolspage: path.resolve('src', 'toolspage.js'),
    tools: path.resolve('src', 'index.js')
  },

  externals: {
    d3: "d3",
  },

  output: {
    path: path.resolve(__dirname, 'build', 'tools'),
    filename: '[name].js'
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },

  module: {
    rules: [

      {
        test: /(d3|web|reader)\.js$/,
        include: [
          path.resolve(__dirname, 'node_modules'),
        ],
        loader: 'file-loader',
        query: {
          name: 'assets/vendor/js/[1]/[name].[ext]',
          regExp: new RegExp(`${sep}node_modules${sep}([^${sep}]+?)${sep}`),
        }
      },

      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src', 'assets', 'js'),
        ],
        loader: 'file-loader?name=assets/js/[name].[ext]',
      },

      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src', 'assets', 'js', 'toolconfigs'),
        ],
        loader: 'file-loader?name=assets/js/toolconfigs/[name].[ext]',
      },

      // Stylus loader con CSS Modules
      {
        test: /\.styl$/,
        // exclude: function(modulePath) {
        //   console.log(modulePath, path.resolve(__dirname, 'src', 'app', '_resources'));
        //   return /node_modules/.test(modulePath) &&
        //       !/node_modules\/MY_MODULE/.test(modulePath);
        // },
        use: extractStyl.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'stylus-loader',
              options: {
                use: [poststylus([
                  postcssUrl({
                    // Only convert root relative URLs, which CSS-Loader won't process into require().
                    filter: ({ url }) => url.startsWith('/') && !url.startsWith(deployUrl),
                    url: ({ url }) => {
                      if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
                          // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
                          return `${deployUrl.replace(/\/$/, '')}${url}`;
                      }
                    }
                  })
                ])]
              }
            }
          ]
        })
      },

      // {
      //   test: /\.pug$/,
      //   include: [
      //     path.resolve(__dirname, 'src', 'tools')
      //   ],
      //   loaders: [
      //     'file-loader?name=[name].html',
      //     'pug-html-loader?exports=false&pretty=true'
      //   ],
      // },

      // {
      //   test: /\.scss$/,
      //   include: [
      //     path.resolve(__dirname, 'src', 'assets', 'css'),
      //   ],
      //   loader: extractSCSS.extract([
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         minimize: __PROD__,
      //         sourceMap: true,
      //       },
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         sourceMap: true
      //       },
      //     },
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //         quiet: true,
      //         sourceMap: true,
      //       },
      //     }
      //   ]),
      // },

      {
        test: /\.(otf|eot|svg|ttf|woff2?)$/,
        include: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'file-loader',
        query: {
          name: 'assets/vendor/fonts/[name].[ext]'
        }
      },

      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'file-loader',
        query: {
          name: 'assets/vendor/css/[name].[ext]'
        }
      },

      {
        test: /\.html$/,
        include: [
          path.resolve(__dirname, 'src', 'index.html')
        ],
        loader: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      },

      {
        test: /\.html$/,
        include: [path.resolve(__dirname, 'src', 'app')],
        use: {
          loader: "html-loader",
          options: {
            attrs: false
          }
        }
      },

      {
        test: /\.json$/,
        include: [
          path.resolve(__dirname, 'node_modules'),
        ],
        loaders: [
          'file-loader?name=assets/js/toolconfigs/[name].js',
          'custom-loader?name=tool-config-loader',
        ],
      },

      {
        test: /favicon\.ico$/,
        loader: 'file-loader',
        query: { 
          limit: 1,
          name: '[name].[ext]',
        }
      },
    ]
  },

  plugins: [
    extractStyl,
    //extractSCSS,
    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src', 'assets'),
        to: path.resolve(path.resolve(__dirname, 'build', 'tools', 'assets')),
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src', 'data'),
        to: path.resolve(path.resolve(__dirname, 'build', 'tools', 'data')),
      }
    ]),
    // new HtmlWebpackPlugin({  // Also generate a test.html
    //   filename: 'index.html',
    //   template: 'src/index.html'
    // })
  ],

  stats,
  devServer: {
    stats,
    disableHostCheck: true,
    host: "0.0.0.0",
    port: "4200",
    publicPath: "/tools/",
    contentBase: [
      // TODO: remove this when issue below is fixed
      // https://github.com/webpack/webpack-dev-server/issues/641
      path.resolve(__dirname, 'build', 'tools'),
    ],
  },

};

module.exports = [toolspage];
