const path = require('path');

const webpack = require('webpack');
const poststylus = require('poststylus');
const postcssUrl = require('postcss-url');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylusLoaderPlugin = require('stylus-loader');
const customLoader = require('custom-loader');

const __PROD__ = process.env.NODE_ENV === 'production';
const __STAGE__ = process.env.STAGE;

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

function getCustomToolsJsTestRegexp() {
  const result = [];

  Object.keys(allTools.paths).forEach(tool => {
    if (allTools.paths[tool].js && path.extname(allTools.paths[tool].js) !== "") {
      result.push(new RegExp(allTools.paths[tool].js.replace(".", "\\.").replace("/", "\\/")))
    }
  });

  return result;
}

function getVizabiToolsCssTestRegexp() {
  const result = [];

  Object.keys(allTools.paths).forEach(tool => {
    if (allTools.paths[tool].css) {
      result.push(new RegExp(allTools.paths[tool].css.replace(".", "\\.").replace("/", "\\/")))
    }
  });

  return result;
}

const htmlAssets = ["assets/vizabi.css", 
  ...(__PROD__? inToolsetTools : allTools.tools).map(tool => "assets/" + /[^\/]+\.css$/.exec((allTools.paths[tool] || {}).css || [tool + ".css"])[0])
];
  
if(!__PROD__) htmlAssets.push(
  'assets/js/toolset.js',
  'assets/js/datasources.js',
  'assets/vendor/js/d3/d3.js',
  'assets/vendor/js/urlon/urlon.umd.js',
  'assets/vendor/js/vizabi/vizabi.js',
  'assets/vendor/js/vizabi-ws-reader/vizabi-ws-reader-web.js',
  'assets/vendor/js/vizabi-ddfcsv-reader/vizabi-ddfcsv-reader.js',
  ...allTools.tools.map(tool => {
    const toolName = allTools.paths[tool] && allTools.paths[tool].js || `vizabi-${tool}`;
    return path.join("assets/vendor/js", (path.extname(toolName) === "" ? path.join(toolName, path.basename(require.resolve(toolName))) : path.join(path.basename(toolName, ".js"), path.basename(toolName))));
  })
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

const deployDir = "tools";
//const extractSCSS = new ExtractTextPlugin('assets/css/main.css');
const extractStyl = new MiniCssExtractPlugin({ 
  filename: "styles.css"
});

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
  mode: process.env.NODE_ENV,

  performance: {
    hints: false
  },

  devtool: 'source-map',

  entry: {
    toolspage: [
      path.resolve('src', 'index.js'),
      ...getEntryToolsFilenames(),
      path.resolve('src', 'app', 'app.js')
    ]
  },
 
  output: {
    path: path.resolve(__dirname, 'build', deployDir),
    filename: '[name].js'
  },

  resolve: {
    alias: {
      "d3": "d3/build/d3.js",
      "urlon": "urlon/dist/urlon.umd.js",
      "vizabi-ddfcsv-reader": "vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader.js",
      "vizabi-ws-reader-web": "vizabi-ws-reader/dist/vizabi-ws-reader-web.js",
      "datasources": `datasources.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`
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
            options: {
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
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
                  filter: ({ url }) => url.startsWith('/'),
                  url: ({ url }) => {
                    return url.replace(/^\//, '');
                  }
                })
              ], 'autoprefixer')]
            }
          }
        ]
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
        options: {
          name: 'assets/vendor/fonts/[name].[ext]'
        }
      },

      {
        oneOf: [
          {
            test: [/vizabi.*\.css$/, ...getVizabiToolsCssTestRegexp()],
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]',
              publicPath: "./"
            }
          },
          {
            test: /\.css$/,
            include: [
              path.resolve(__dirname, 'node_modules')
            ],
            loader: 'file-loader',
            options: {
              name: 'assets/vendor/css/[name].[ext]',
              publicPath: "./"
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
        type: 'javascript/auto',
        test: /\.json$/,
        include: [
          path.resolve(__dirname, 'node_modules'),
        ],
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/js/toolconfigs/[name].js',
            publicPath: "./"
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
        options: { 
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
      assets: htmlAssets, 
      append: false })
  ],

  stats,
  devServer: {
    stats,
    disableHostCheck: true,
    host: "0.0.0.0",
    port: "4200",
    publicPath: "/" + deployDir,
    contentBase: [
      // TODO: remove this when issue below is fixed
      // https://github.com/webpack/webpack-dev-server/issues/641
      path.resolve(__dirname, 'build', deployDir),
    ],
  },

};

if (__PROD__) {

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

  toolspage.optimization = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/].*(d3|urlon)/,
          chunks: 'all',
          enforce: true
        },
        tools: {
          name: 'tools',
          test: new RegExp("(vizabi|" + inToolsetTools.join("|") + ")", "i"),
          chunks: 'all',
          enforce: true
        },
      }
    },
    //minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false
          },
          mangle: {
          },
          output: {
            comments: false,
          }
        }
      })
    ]
  };

  toolspage.plugins.push(
    new webpack.IgnorePlugin(getFilterOutToolsRegexp())
  );
} else {
  toolspage.module.rules = [
    {
      test: /\.js$/,
      include: /node_modules\/webpack-dev-server/,
      use: [{ 
        loader: 'babel-loader', 
        options: { 
          cacheDirectory: true,
          presets: ['env']
        }
      }]
    },

    {
      oneOf: [
        {
          test: [...getCustomToolsJsTestRegexp()],
          loader: 'file-loader',
          options: {
            name: 'assets/vendor/js/[name]/[name].[ext]',
            publicPath: "./"
          }
        },

        {
          test: /(d3|urlon\.umd|vizabi.*)\.js$/,
          include: [
            path.resolve(__dirname, 'node_modules'),
          ],
          use: [{
            loader: 'file-loader',
            options: {
              name: 'assets/vendor/js/[1]/[name].[ext]',
              regExp: new RegExp(`${sep}node_modules${sep}([^${sep}]+?)${sep}`),
              publicPath: "./"
            }
          }]
        }
      ]
    },

    {
      type: 'javascript/auto',
      test: /(toolset|datasources.*)\.json$/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      use: [{
        loader: 'file-loader',
        options: {
          name: 'assets/js/[1].js',
          regExp: /(\w+)\.?\w*.json/,
          publicPath: "./"
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
