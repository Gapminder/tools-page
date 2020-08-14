/* eslint-disable no-undef */
const path = require("path");

import * as meta from "./package.json";
import babel from "@rollup/plugin-babel";
import {eslint} from "rollup-plugin-eslint";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import {terser} from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import json from "@rollup/plugin-json";
import visualizer from "rollup-plugin-visualizer";
import trash from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";
import url from '@rollup/plugin-url';
import {plugin as globImport} from 'rollup-plugin-glob-import';
import stylus from 'rollup-plugin-stylus-compiler';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import virtual from "@rollup/plugin-virtual";
import autoprefixer from 'autoprefixer';
import postcssUrl from 'postcss-url';
import iife from "rollup-plugin-iife";
import legacy from '@rollup/plugin-legacy';
import htmlTemplate from 'rollup-plugin-generate-html-template';


const copyright = `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`;
const __PROD__ = process.env.NODE_ENV === 'production';
const __STAGE__ = process.env.STAGE;

const allTools = require(path.resolve(__dirname, "webpack.vizabi-tools.json"));
const toolset = require(path.resolve(__dirname, "src", "config", `toolset.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`));
const inToolsetTools = Object.keys(toolset.reduce((result, { tool }) => {
  tool && (result[tool.toLowerCase()] = true);
  return result;
}, {}));


function generateToolInputEntries() {
  return (__PROD__ ? inToolsetTools : allTools.tools).reduce((result, tool) => {
    //js
    result.push(allTools.paths[tool] && allTools.paths[tool].js || `vizabi-${tool}`);
    return result;
  }, []);
}

function getEntryToolsCssFilenames() {
  return (__PROD__ ? inToolsetTools : allTools.tools).reduce((result, tool) => {
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

function mapLink(file) {
  return `<link rel="stylesheet" href="${file}">\n`;
}

function mapScript(file) {
  return `<script type="text/javascript" src="${file}"></script>\n`
}

function varNameWithFileName(prefix) {
  return function(path) {
    const regex = /\b(\w+)\..*$/;
    return prefix + regex[Symbol.match](path)[1];
  }
}

const htmlTemplateWrapper = (plugin, varNameFunc, emitFilePath, nameRegex) => {
  const pluginGenerateBundle = plugin.generateBundle;

  plugin.generateBundle = async function(outputOptions, bundleInfo) {
    const _bundleInfo = [...jsAssets,
      ...["vizabi/build/vizabi.css", ...getEntryToolsCssFilenames()].map(f => {
          return "assets/css/" + path.basename(f);
        }),
      "styles.css"].reduce((res, asset) => {
        res[asset] = bundleInfo[asset] || {}
        return res;
      }, {})
    await pluginGenerateBundle(outputOptions, _bundleInfo);
  }
  return plugin;
}

const jsonToJsEmitAssets = (plugin, varNameFunc, emitFilePath, nameRegex) => {
  const pluginTransform = plugin.transform;

  plugin.transform = function(code, id) {
    const result = pluginTransform(code, id);
    if (result !== null) {
      const name = nameRegex || /\/([\w-]+)\.json$/;
      this.emitFile({
        type: 'asset',
        source: "var " + varNameFunc(id) + " = " + result.code.slice(15),
        fileName: emitFilePath + name.exec(id)[1] + ".js"
      })
      result.dependencies && result.dependencies.forEach(this.addWatchFile);
      return {
        code: "export default 'default'",
        map: null
      };
    }
    return;
  }
  return plugin;
}

const jsAssets = [];
//["assets/vizabi.css",
//  ...(__PROD__? inToolsetTools : allTools.tools).map(tool => "assets/" + /[^\/]+\.css$/.exec((allTools.paths[tool] || {}).css || [tool + ".css"])[0])
//];

//if(!__PROD__) 
jsAssets.push(
  // 'assets/vendor/js/d3/d3.js',
  // 'assets/vendor/js/urlon/urlon.umd.js',
  // 'assets/vendor/js/vizabi/vizabi.js',
  // 'assets/vendor/js/vizabi-ws-reader/vizabi-ws-reader-web.js',
  // 'assets/vendor/js/vizabi-csv-reader/vizabi-csv-reader.js',
  // 'assets/vendor/js/vizabi-ddfcsv-reader/vizabi-ddfcsv-reader.js',
  // 'assets/vendor/js/vizabi-ddfservice-reader/vizabi-ddfservice-reader.js',
  // ...allTools.tools.map(tool => {
  //   const toolName = allTools.paths[tool] && allTools.paths[tool].js || `vizabi-${tool}`;
  //   return path.join("assets/vendor/js", (path.extname(toolName) === "" ? path.join(toolName, path.basename(require.resolve(toolName))) : path.join(path.basename(toolName, ".js"), path.basename(toolName))));
  // }),
  'vendor.js',
  'tools.js',
  'config/properties.js',
  'config/toolset.js',
  'config/datasources.js',
  'config/conceptMapping.js',
  'config/entitysetMapping.js',
  'toolspage.js'
);

const deployDir = "tools";

export default [  
//toolspage  
{
  //perf: true,
  input: {
    //"tools": "src/index.js",
    //"toolspage": "src/app/app.js"
    "toolspage": "src/index.js",
  },
  output: {
    dir: "build/" + deployDir,

    chunkFileNames: "[name].js",
    //format: "cjs",
    banner: copyright,
    sourcemap: true,
    manualChunks(id) {
      if (/vizabi/.test(id)) {
        return 'tools';
      }
      if (/d3|mobx.umd|urlon.umd/.test(id)) {
        return 'vendor';
      }
    }
  },
  //treeshake: process.env.NODE_ENV === "production" ? {} : false,
  context: "window",
  plugins: [
    //(process.env.NODE_ENV === "production" &&
    (trash({
      targets: ['build/*'],
      runOnce: true
    })),
    virtual({
      tools: generateToolInputEntries().map(entry => `import "${entry}";`).join("") + "export default '';"
    }),
    resolve(),
    alias({
      entries: [
        { find: "properties", replacement: path.resolve(__dirname, "src", "config", `properties.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`) },
        { find: "toolset", replacement: path.resolve(__dirname, "src", "config", `toolset.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`) },
        { find: "datasources", replacement: path.resolve(__dirname, "src", "config", `datasources.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`) },
      ]
    }),
    // commonjs({
    //   include: 'node_modules/**',
    // }),
    globImport({
      format: 'import'
    }),
    legacy({
      [require.resolve('vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader')]: "DDFCsvReader",
      [require.resolve('vizabi-csv-reader/dist/vizabi-csv-reader')]: "CsvReader"
    }),
    copy({
      targets: [
        { src: "src/assets", dest: "build/tools" },
        { src: "src/data", dest: "build/tools" },
        { src: "src/config/toolconfigs", dest: "build/tools/config" },
        { src: "src/config/conceptMapping.js", dest: "build/tools/config" },
        { src: "src/config/entitysetMapping.js", dest: "build/tools/config" },
        { src: "src/favicon.ico", dest: "build/tools" },
        { src: [ "vizabi-shared-components/build/VizabiSharedComponents.css", ...getEntryToolsCssFilenames()].map(css=>require.resolve(css))
          , dest: "build/tools/assets/css" }
      ],
      copyOnce: true,
      verbose: true
    }),
    htmlTemplateWrapper(
      htmlTemplate({
        template: 'src/index.html',
        target: 'build/tools/index.html',
      })
    ),
    //(process.env.NODE_ENV === "production" && eslint()),
    // babel({
    //   exclude: "node_modules/**",
    //   presets: [["@babel/preset-env", {
    //     targets: {
    //       "ie": "11"
    //     },
    //     modules: false,
    //   }]]
    // }),
    iife(),
    jsonToJsEmitAssets(
      json({
        include: /src\/config/,
        namedExports:false,
        indent: '  '
      }),
      varNameWithFileName("toolsPage_"),
      "config/",
      /\/([\w-]+)[\w\.-]+json$/
    ),
    jsonToJsEmitAssets(
      json({
        include: /vizabi-config-systema_globalis/,
        namedExports:false,
        indent: '  '
      }),
      () => "VIZABI_MODEL",
      "config/toolconfigs/"
    ),
    // url({
    //   limit: 0,
    //   fileName: "vendor/[dirname][name][extname]",
    //   include: [
    //     ...getEntryToolsCssFilenames()
    //   ],
    //   destDir: "build/tools/assets"
    // }),
    // url({
    //   limit: 0,
    //   fileName: "vendor/js/[name]/[name][extname]",
    //   include: [
    //     /(d3|urlon\.umd|web|reader|vizabi)\.js$/,
    //   ],
    //   destDir: "build/tools/assets"
    // }),
    url({
      limit: 0,
      fileName: "vendor/[dirname][name][extname]",
      include: [
        //"**/*.css",
        /\.(otf|eot|svg|ttf|woff2?)$/,
      ],
      destDir: "build/tools/assets"
    }),
    stylus(),
    postcss({
      include: '**/app*.css',
      extract: "styles.css",
      plugins: [
        postcssUrl({
          // Only convert root relative URLs, which CSS-Loader won't process into require().
          filter: ({ url }) => url.startsWith('/'),
          url: ({ url }) => {
            return url.replace(/^\//, '');
          }
        }),
        autoprefixer()
      ]
    }),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || "development")
    }),
    (process.env.NODE_ENV === "production" && terser({output: {preamble: copyright}})),
    (process.env.NODE_ENV === "devserver" && serve({
      contentBase: ["build"],
      port: 4200,
      verbose: true
    }) ),
    (process.env.NODE_ENV === "devserver" && livereload("build/")),
    visualizer({
      filename: "./build/stats.html"
    }),
  ]

}]
