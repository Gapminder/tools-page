import path from "node:path";
import { fileURLToPath } from "node:url";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import { visualizer } from "rollup-plugin-visualizer";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";
import autoprefixer from "autoprefixer";
import esbuild from "rollup-plugin-esbuild";
import stylus from "rollup-plugin-stylus-compiler";
import { createRequire } from "node:module";
import externalGlobals from "rollup-plugin-external-globals";
import progress from "rollup-plugin-progress";

const require = createRequire(import.meta.url);
const vendor = (p) => require.resolve(p);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROD = process.env.NODE_ENV === "production";
const STAGE = process.env.STAGE ?? "prod";

const TOOL_CSS = [
  "@vizabi/linechart/build/linechart.css",
  "@vizabi/barrank/build/barrank.css",
  "@vizabi/bubblechart/build/bubblechart.css",
  "@vizabi/bubblemap/build/bubblemap.css",
  "@vizabi/mountainchart/build/mountainchart.css",
  "@vizabi/popbyage/build/popbyage.css",
  "@vizabi/spreadsheet/build/spreadsheet.css",
  "@vizabi/combo/build/combo.css",
  "@vizabi/extapimap/build/extapimap.css",
];

export default {
  //perf: true, 
  input: { toolspage: "src/index.js" },
  treeshake: !!PROD,
  output: {
    dir: `build/tools`,
    format: "esm", // ESM for the web
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`,
    sourcemap: PROD,
  },
  plugins: [
    progress(),
    del({ targets: "build/*", runOnce: true }),
    alias({
      entries: [
        { find: "toolsPage_properties",  replacement: path.resolve(__dirname, "src/config", `properties.${PROD ? STAGE : "dev"}.json`) },
        { find: "toolsPage_toolset",     replacement: path.resolve(__dirname, "src/config", `toolset.${PROD ? STAGE : "dev"}.json`) },
        { find: "toolsPage_datasources", replacement: path.resolve(__dirname, "src/config", `datasources.${PROD ? STAGE : "dev"}.json`) },
        { find: "toolsPage_menuItems", replacement: path.resolve(__dirname, "src/config", `menu-items.js`) },
        { find: "toolsPage_conceptMapping", replacement: path.resolve(__dirname, "src/config", `conceptMapping.js`) },
        { find: "toolsPage_entitysetMapping", replacement: path.resolve(__dirname, "src/config", `entitysetMapping.js`) },
        // node builtin -> empty
        { find: "fs", replacement: path.resolve(__dirname, "src/shims/empty.js") },
      ]
    }),
    externalGlobals({
      "@vizabi/core": "Vizabi",
      "@vizabi/shared-components": "VizabiSharedComponents",
      d3: "d3",
      mobx: "mobx"
    }),
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    json({ namedExports: false, compact: PROD }),

    stylus({
      include: ["**/*.styl"],
      sourcemap: true
    }),
    postcss({
      include: ["**/app*.css"],
      extract: "styles.css",
      plugins: [postcssUrl({ filter: ({url}) => url.startsWith("/"), url: ({url}) => url.replace(/^\//,"") }), autoprefixer()]
    }),
    copy({
      targets: [
        // UMD JS
        { dest: "build/tools/vendor", src: vendor("urlon/dist/urlon.umd"), rename: "urlon.js" },
        { dest: "build/tools/vendor", src: vendor("@vizabi/reader-ddfservice/dist/reader-ddfservice.js"), rename: "reader-ddfservice.js" },
        { dest: "build/tools/vendor", src: vendor("@vizabi/reader-ddfcsv/dist/reader-ddfcsv.js"), rename: "reader-ddfcsv.js"  },
        // Supabase UMD (adjust to .min.js if you prefer) 
        { dest: "build/tools/vendor", src: vendor("@supabase/supabase-js/dist/umd/supabase.js"), rename: "supabase.js" }, 
        { dest: "build/tools/vendor", src: vendor(PROD ? "d3/dist/d3.min.js" : "d3/dist/d3.js"), rename: "d3.js" },
        { dest: "build/tools/vendor", src: vendor(PROD ? "mobx/lib/mobx.umd.min.js" : "mobx/lib/mobx.umd.js"), rename: "mobx.js" },
        { dest: "build/tools/vendor", src: vendor("@vizabi/core/dist/Vizabi.js"), rename: "Vizabi.js" },
        { dest: "build/tools/vendor", src: vendor("@vizabi/shared-components/build/VizabiSharedComponents.js"), rename: "VizabiSharedComponents.js" },
        // CSS
        { dest: "build/tools/assets/css", src: TOOL_CSS.map(vendor) },
        { dest: "build/tools/assets/css", src: vendor("@vizabi/shared-components/build/VizabiSharedComponents.css")},
        //misc
        { dest: "build/tools", src: "src/assets" },
        { dest: "build/tools", src: "src/data" },
        { dest: "build/tools", src: "src/auth" },
        { dest: "build/tools", src: "src/favicon.png" },
        
        //configs
        { dest: "build/tools/config", src: "src/config/toolconfigs"},
        { dest: "build/tools/config", src: ["src/config/menu-items.js","src/config/conceptMapping.js","src/config/entitysetMapping.js","src/config/related.json"]},
        //HTML
        { dest: "build/tools", src: "src/index.html" }
      ],
      copyOnce: PROD, // <-- re-copy on changes in dev
      hook: "writeBundle",
      // ensure file changes trigger copy in --watch
      watch: ["src/assets/**","src/data/**","src/auth/**","src/config/**","src/favicon.png"]
    }),
    replace({
      preventAssignment: true,
      ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
    esbuild({
      minify: PROD,
      target: "es2020", // bump as high as your audience allows
      legalComments: "none"
    }),
    PROD && visualizer({ filename: "./build/stats.html" })
  ]
};
