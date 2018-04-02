const path = require('path');

const webpack = require('webpack');
const poststylus = require('poststylus');
const postcssUrl = require('postcss-url');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StylusLoaderPlugin = require('stylus-loader');
const customLoader = require('custom-loader');

const __PROD__ = process.env.NODE_ENV === 'production';

const allTools = require(path.resolve(__dirname, "vizabi-tools.json"));
const toolset = require(path.resolve(__dirname, "src", "toolset.json"));
const inToolsetTools = Object.keys(toolset.reduce((result, { tool }) => {
  tool && (result[tool.toLowerCase()] = true);
  return result;
}, {}));

function getEntryToolsFilenames() {
  return (__PROD__ ? inToolsetTools : allTools.tools).reduce((result, tool) => {
    //js
    result.push(allTools.paths[tool] && allTools.paths[tool].js || `vizabi-${tool}`);
    //css
    result.push(allTools.paths[tool] && allTools.paths[tool].css || `vizabi-${tool}/build/${tool}.css`);
    return result;
  }, []);
}

function getFilterOutToolsRegexp() {
  const filterOutTools = allTools.tools.filter(tool => !inToolsetTools.includes(tool));
  return filterOutTools.length ? new RegExp("(" + filterOutTools.join("|") + ")", "i") : null;
}

const htmlAssets = ["assets/vizabi.css", 
  ...allTools.tools.map(tool => `assets/${tool}.css`)
];
  
if(!__PROD__) htmlAssets.push(
  'assets/vendor/js/d3/d3.js',
  'assets/vendor/js/vizabi-ws-reader/vizabi-ws-reader-web.js',
  'assets/vendor/js/vizabi-ddfcsv-reader/vizabi-ddfcsv-reader.js',
  'assets/vendor/js/urlon/urlon.umd.js',
  'assets/js/toolset.js',
  'assets/js/datasources.js'
);

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

function varNameWithFileName(prefix) {
  return function() {
    const regex = /\b(\w+)\..*$/;
    return prefix + regex[Symbol.match](this.resourcePath)[1];
  }
}

customLoader.loaders = {
  ['tool-config-loader'](source) {
    this.cacheable && this.cacheable();

    this.value = [source];

    const varName = typeof this.query.varName === "function" ? this.query.varName.apply(this) : this.query.varName;
    return `var ${varName} = ${source};`;
  }
};

const toolspage = {
  devtool: 'source-map',

  entry: {
    toolspage: path.resolve('src', 'app', 'app.js'),
    tools: [path.resolve('src', 'index.js'),
      ...getEntryToolsFilenames()
    ]
  },
 
  output: {
    path: path.resolve(__dirname, 'build', 'tools'),
    filename: '[name].js'
  },

  resolve: {
    alias: {
      "d3": "d3/build/d3.js",
      "urlon": "urlon/dist/urlon.umd.js",
      "vizabi-ddfcsv-reader": "vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader.js",
      "vizabi-ws-reader-web": "vizabi-ws-reader/dist/vizabi-ws-reader-web.js",
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },

  module: {
    noParse: /d3|vizabi|urlon/,
    //common rules
    rules: [

      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src', 'app')
        ],
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: !__PROD__,
              presets: ['env']
            }
          }
        ]
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
              options: {
                minimize: __PROD__,
                sourceMap: true
              }
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
                ], 'autoprefixer')]
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
        oneOf: [
          {
            test: /vizabi.*\.css$/,
            include: [
              path.resolve(__dirname, 'node_modules')
            ],
            loader: 'file-loader',
            query: {
              name: 'assets/[name].[ext]',
              publicPath: deployUrl
            }
          },
          {
            test: /\.css$/,
            include: [
              path.resolve(__dirname, 'node_modules')
            ],
            loader: 'file-loader',
            query: {
              name: 'assets/vendor/css/[name].[ext]',
              publicPath: deployUrl
            }
          }
        ]
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
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/js/toolconfigs/[name].js',
            publicPath: deployUrl
          }
        },
        {
          loader: 'custom-loader',
          options: {
            name: "tool-config-loader",
            varName: "VIZABI_MODEL"
          }
        }],
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ["vendor", "tools", "toolspage"],
      chunksSortMode: 'manual'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: htmlAssets, append: false })
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

if (__PROD__) {
  toolspage.entry["vendor"] = ["d3", "urlon"];
//  toolspage.entry["vizabi"] = ["vizabi"];

  toolspage.module.rules = [
    {
      test: /ddfcsv-reader\.js$/,
      include: [
        path.resolve(__dirname, 'node_modules'),
      ],
      use: 'exports-loader?DDFCsvReader'
    },

    {
      test: /ws-reader-web\.js$/,
      include: [
        path.resolve(__dirname, 'node_modules'),
      ],
      use: 'exports-loader?WsReader'
    }
  ].concat(toolspage.module.rules);

  toolspage.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",  
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new webpack.IgnorePlugin(getFilterOutToolsRegexp()),
  );
} else {
  toolspage.module.rules = [
    {
      test: /(d3|web|reader|urlon\.umd)\.js$/,
      include: [
        path.resolve(__dirname, 'node_modules'),
      ],
      use: [{
        loader: 'file-loader',
        options: {
          name: 'assets/vendor/js/[1]/[name].[ext]',
          regExp: new RegExp(`${sep}node_modules${sep}([^${sep}]+?)${sep}`),
          publicPath: deployUrl
        }
      }]
    },

    {
      test: /(toolset|datasources)\.json$/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      use: [{
        loader: 'file-loader',
        options: {
          name: 'assets/js/[name].js',
          publicPath: deployUrl
        }
      },
      {
        loader: 'custom-loader',
        options: {
          name: "tool-config-loader",
          varName: varNameWithFileName("toolsPage_")
        }
      }]
    }
  ].concat(toolspage.module.rules);
}

module.exports = [toolspage];
