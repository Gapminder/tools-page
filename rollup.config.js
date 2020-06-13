/* eslint-disable no-undef */
const path = require("path");

import * as meta from "./package.json";
import babel from "rollup-plugin-babel";
import {eslint} from "rollup-plugin-eslint";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import {terser} from "rollup-plugin-terser";
import sass from "rollup-plugin-sass";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import json from "rollup-plugin-json";
import visualizer from "rollup-plugin-visualizer";
import trash from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";
import url from 'rollup-plugin-url';
import {plugin as globImport} from 'rollup-plugin-glob-import';
import stylus from 'rollup-plugin-stylus-compiler';
import postcss from 'rollup-plugin-postcss';
import multiEntry from 'rollup-plugin-multi-entry';


const copyright = `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`;
const __PROD__ = process.env.NODE_ENV === 'production';



const jsonEmitAssets = (plugin) => {
  const pluginTransform = plugin.transform;

  plugin.transform = function(code, id) {
    const result = pluginTransform(code, id);
    if (result !== null) {
      const name = /\/([\w\.-]+)\.json$/;
      this.emitFile({
        type: 'asset',
        source: "var VIZABI_MODEL = " + result.code.slice(15),
        fileName: "assets/js/toolconfigs/" + name.exec(id)[1] + ".js"
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


export default[{
  input: {
    "toolspage":"src/index.js"
  },  
  output: {
    name: "toolspage",
    dir: "build/tools/",
    format: "umd",
    banner: copyright,
    sourcemap: true
  },
  plugins: [
    (process.env.NODE_ENV === "production" && trash({
      targets: ['build/*']
    })),
    copy({
      targets: [
        { src: "src/assets/js", dest: "build/tools/assets" },
        { src: "src/data", dest: "build/tools" },
        { src: "src/config", dest: "build/tools" },
        { src: "src/favicon.ico", dest: "build/tools" },
        { src: "src/index.html", dest: "build/tools" },
      ],
      verbose: true
    }),
    resolve(),
    commonjs(),
    //multiEntry(),

    //(process.env.NODE_ENV === "production" && eslint()),
    // babel({
    // exclude: "node_modules/**"
    // }),
    //jsonEmitAssets(json({
    //  namedExports:false,
    //  indent: '  '
    //})),
//    url({
//      limit: 0,
//      fileName: "vendor/[dirname][name][extname]",
//      include: [
//        "**/*.css",
//        /\.(otf|eot|svg|ttf|woff2?)$/,
//      ],
//      destDir: "build/assets"
//    }),
//    url({
//      limit: 0,
//      fileName: "vendor/js/[name]/[name][extname]",
//      include: [
//        /(d3|mobx\.umd|web|reader)\.js$/,
//      ],
//      destDir: "build/assets"
//    }),
    babel({
      exclude: "node_modules/**"
    }),
    (process.env.NODE_ENV === "production" && eslint()),
    stylus(), 
    postcss({ include: '**/*.css' }),
    json(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || "development")
    }),
    (process.env.NODE_ENV === "production" && terser({output: {preamble: copyright}})),
    (process.env.NODE_ENV === "devserver" && serve("build")),
    (process.env.NODE_ENV === "devserver" && livereload("build")),
    visualizer({
      filename: "./build/stats.html"
    }),
  ]

}]






//
//
//module.exports = dir => ({
//  input: {
//    include: [path.resolve(__dirname,'src/index.js'), path.resolve(__dirname,'src/components/**/*.js'), path.resolve(__dirname,'src/services/**/*.js')],
//    exclude: [path.resolve(__dirname,'src/**/config.js')]
//  },
//  output: {
//    name: "VizabiSharedComponents",
//    file: (dir || "build") + "/VizabiSharedComponents.js",
//    format: "umd",
//    banner: copyright,
//    sourcemap: true
//  },
//  external: ["mobx"],
//  plugins: [
//    !dir && trash({
//      targets: ['build/*']
//    }),
//    copy({
//      targets: [{
//        src: [path.resolve(__dirname,"src/assets")],
//        dest: (dir && path.resolve(dir, "..")) || "build"
//      }]
//    }),
//    multiEntry(),
//    (process.env.NODE_ENV === "production" && eslint()),
//    // babel({
//    //   exclude: "node_modules/**"
//    // }),
//    
//    json(),
//    replace({
//      ENV: JSON.stringify(process.env.NODE_ENV || "development")
//    }),
//    (process.env.NODE_ENV === "production" && terser({output: {preamble: copyright}})),
//  ]
//});

