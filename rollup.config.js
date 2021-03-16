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
import url from "@rollup/plugin-url";
import {plugin as globImport} from "rollup-plugin-glob-import";
import stylus from "rollup-plugin-stylus-compiler";
import postcss from "rollup-plugin-postcss";
import alias from "@rollup/plugin-alias";
import virtual from "@rollup/plugin-virtual";
import autoprefixer from "autoprefixer";
import postcssUrl from "postcss-url";
import iife from "rollup-plugin-iife";
import legacy from "@rollup/plugin-legacy";
import html from "rollup-plugin-html2";
import sourcemaps from 'rollup-plugin-sourcemaps';


const copyright = `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`;
const __PROD__ = process.env.NODE_ENV === "production";
const __STAGE__ = process.env.STAGE;

const allTools = require(path.resolve(__dirname, "vizabi-tools.json"));
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
      result.push(new RegExp(allTools.paths[tool].js.replace(".", "\\.").replace("/", "\\/")));
    }
  });

  return result;
}

function getVizabiToolsCssTestRegexp() {
  const result = [];

  Object.keys(allTools.paths).forEach(tool => {
    if (allTools.paths[tool].css) {
      result.push(new RegExp(allTools.paths[tool].css.replace(".", "\\.").replace("/", "\\/")));
    }
  });

  return result;
}

function mapLink(file) {
  return `<link rel="stylesheet" href="${file}">\n`;
}

function mapScript(file) {
  return `<script type="text/javascript" src="${file}"></script>\n`;
}

function varNameWithFileName(prefix) {
  return function(path) {
    const regex = /\b(\w+)\..*$/;
    return prefix + regex[Symbol.match](path)[1];
  };
}

function getHtmlAssets() {
  return [
    ...["vizabi-shared-components/build/VizabiSharedComponents.css", ...getEntryToolsCssFilenames()]
      .map(f => "assets/css/" + path.basename(f)),
    "styles.css",
    ...jsAssets
  ];
}  

const jsonToJsEmitAssets = (plugin, varNameFunc, emitFilePath, nameRegex) => {
  const pluginTransform = plugin.transform;

  plugin.transform = function(code, id) {
    const result = pluginTransform(code, id);
    if (result !== null) {
      const name = nameRegex || /\/([\w-]+)\.json$/;
      this.emitFile({
        type: "asset",
        source: "var " + varNameFunc(id) + " = " + result.code.slice(15),
        fileName: emitFilePath + name.exec(id)[1] + ".js"
      });
      result.dependencies && result.dependencies.forEach(this.addWatchFile);
      return {
        code: "export default 'default'",
        map: null
      };
    }
    return;
  };
  return plugin;
};

const jsAssets = [];

jsAssets.push(
  "vendor.js",
  "tools.js",
  "config/properties.js",
  "config/toolset.js",
  "config/datasources.js",
  "config/conceptMapping.js",
  "config/entitysetMapping.js"
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
      // sourcemapPathTransform: sourcePath => {
      //   console.log(sourcePath)  
      //   return sourcePath.replace(
			// 	new RegExp(`^..${path.sep}`),
      //   '~/pkg-name/'
      // )},
      manualChunks(id) {
        if (/vizabi/.test(id)) {
          return "tools";
        }
        if (/d3|mobx.umd|urlon.umd/.test(id)) {
          return "vendor";
        }
      }
    },
    //treeshake: process.env.NODE_ENV === "production" ? {} : false,
    context: "window",
    plugins: [
    //(process.env.NODE_ENV === "production" &&
      (trash({
        targets: ["build/*"],
        runOnce: true
      })),
      virtual({
        "vizabi-tools": generateToolInputEntries().map(entry => `import "${entry}";`).join("") + "export default '';"
      }),
      resolve(),
      alias({
        entries: [
          { find: "properties", replacement: path.resolve(__dirname, "src", "config", `properties.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`) },
          { find: "toolset", replacement: path.resolve(__dirname, "src", "config", `toolset.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`) },
          { find: "datasources", replacement: path.resolve(__dirname, "src", "config", `datasources.${__PROD__ ? (__STAGE__ || "prod") : "dev"}.json`) },
        ]
      }),
      commonjs({
        include: 'node_modules/core-js/**',
      }),
      globImport({
        format: "import"
      }),
      legacy({
        [require.resolve("vizabi-ddfcsv-reader/dist/vizabi-ddfcsv-reader")]: "DDFCsvReader",
        [require.resolve("vizabi-csv-reader/dist/vizabi-csv-reader")]: "CsvReader"
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
      html({
        template: "src/index.html",
        externals: getHtmlAssets().map(file => {
          return {
            file,
            pos: "before"
          };
        })
      }),
      (process.env.NODE_ENV === "production" && eslint()),
      (process.env.NODE_ENV === "production" && babel({
        babelHelpers: "bundled",
        include: [
          "src/**",
          "node_modules/vizabi-*/**"  
        ],
        presets: [["@babel/preset-env", {
          targets: {
            "edge": "12"
          },
          modules: false,
          useBuiltIns: "entry",
          corejs: { version: "3.9" }
        }]]
      })),
      sourcemaps(),
      jsonToJsEmitAssets(
        json({
          include: /src\/config/,
          namedExports:false,
          indent: "  "
        }),
        varNameWithFileName("toolsPage_"),
        "config/",
        /\/([\w-]+)[\w\.-]+json$/
      ),
      jsonToJsEmitAssets(
        json({
          include: /vizabi-config-systema_globalis/,
          namedExports:false,
          indent: "  "
        }),
        () => "VIZABI_MODEL",
        "config/toolconfigs/"
      ),
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
        include: "**/app*.css",
        extract: "styles.css",
        plugins: [
          postcssUrl({
          // Only convert root relative URLs, which CSS-Loader won't process into require().
            filter: ({ url }) => url.startsWith("/"),
            url: ({ url }) => {
              return url.replace(/^\//, "");
            }
          }),
          autoprefixer()
        ]
      }),
      replace({
        ENV: JSON.stringify(process.env.NODE_ENV || "development")
      }),
      (process.env.NODE_ENV === "production" && terser({
        output: {
          preamble: copyright,
        },
        keep_classnames: true,
        keep_fnames: true
      })),
      iife(),
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

  }];
