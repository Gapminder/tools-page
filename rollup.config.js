import path from "node:path";
import fs from "node:fs";
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
const DEV  = process.env.NODE_ENV === "development";
const BASE = process.env.BASE || (DEV ? '/' : null);
if (PROD && !BASE) {
  console.error('\x1b[95m%s\x1b[0m', `🛑 STOP! Setting BASE is required for a production build:\n
  • BASE=./ will work in folders but NOT support page slugs
  • BASE=/ will work for root only and support page slugs 
  • BASE=/folder/ would give you both, but then you must know the folder

  Example: BASE=/tools/ npm run build

  will work for https://gapminder.org/tools/possibleslug
  use that if you are fixing tools page in panik, otherwise
  Read more about BASE parameter and page slugs in readme.md\n`);
  process.exit(1);
}

const TOOL_CSS = [
  "@vizabi/linechart/build/linechart.css",
  "@vizabi/barrank/build/barrank.css",
  "@vizabi/bubblechart/build/bubblechart.css",
  "@vizabi/bubblechart-svg/build/bubblechart-svg.css",
  "@vizabi/bubblemap/build/bubblemap.css",
  "@vizabi/mountainchart/build/mountainchart.css",
  "@vizabi/popbyage/build/popbyage.css",
  "@vizabi/spreadsheet/build/spreadsheet.css",
  "@vizabi/combo/build/combo.css",
  "@vizabi/extapimap/build/extapimap.css",
];

export default {
  //perf: true, 
  input: { 
    toolspage: "src/index.js"
  },
  treeshake: PROD,
  output: {
    dir: `build`,
    format: "esm", // ESM for the web
    entryFileNames: `[name].js`,
    chunkFileNames: `[name].js`,
    sourcemap: PROD,
    preserveModules: DEV,
    preserveModulesRoot: DEV ? "src" : null,
  },
  plugins: [
    progress(),
    del({ targets: "build/*", runOnce: true }),
    alias({
      entries: [
        // inject env-specific properties config into the build
        { find: "toolsPage_properties",  replacement: path.resolve(__dirname, "src/config", `properties.json`) },
        // node builtin -> empty
        { find: "fs", replacement: path.resolve(__dirname, "src/shims/empty.js") },
      ]
    }),
    externalGlobals({
      "@vizabi/core": "Vizabi",
      "@vizabi/shared-components": "VizabiSharedComponents",
      "@deck.gl/core": "deck",
      "@deck.gl/layers": "deck",
      d3: "d3",
      mobx: "mobx"
    }),
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    json({ namedExports: false, compact: PROD }),
    stylus({
      include: ["**/*.styl"],
      sourcemap: PROD
    }),
    postcss({
      include: ["**/index*.css"],
      extract: "styles.css",
      sourcemap: PROD,
      plugins: [postcssUrl({ filter: ({url}) => url.startsWith("/"), url: ({url}) => url.replace(/^\//,"") }), autoprefixer()]
    }),
    copy({
      targets: [
        // UMD JS
        { dest: "build/vendor", src: vendor("@supabase/supabase-js/dist/umd/supabase.js"), rename: "supabase.js" }, 
        { dest: "build/vendor", src: vendor("urlon/dist/urlon.umd"), rename: "urlon.js" },
        { dest: "build/vendor", src: vendor("@vizabi/reader-ddfservice/dist/reader-ddfservice.js"), rename: "reader-ddfservice.js" },
        { dest: "build/vendor", src: vendor("@vizabi/reader-ddfcsv/dist/reader-ddfcsv.js"), rename: "reader-ddfcsv.js"  },
        { dest: "build/vendor", src: vendor(PROD ? "d3/dist/d3.min.js" : "d3/dist/d3.js"), rename: "d3.js" },
        { dest: "build/vendor", src: vendor(PROD ? "mobx/lib/mobx.umd.min.js" : "mobx/lib/mobx.umd.js"), rename: "mobx.js" },
        // MAPBOX (loaded on-demand by tools that need it)
        { dest: "build/vendor", src: vendor("mapbox-gl/dist/mapbox-gl.js"), rename: "mapbox-gl.js" },
        { dest: "build/assets/css", src: require.resolve("mapbox-gl/dist/mapbox-gl.css") },
        //VIZABI
        { dest: "build/vendor", src: vendor("@vizabi/core/dist/Vizabi.js"), rename: "Vizabi.js" },
        { dest: "build/vendor", src: vendor("@vizabi/shared-components/build/VizabiSharedComponents.js"), rename: "VizabiSharedComponents.js" },
        // CSS
        { dest: "build/assets/css", src: TOOL_CSS.map(vendor) },
        { dest: "build/assets/css", src: vendor("@vizabi/shared-components/build/VizabiSharedComponents.css")},
        //misc
        { dest: "build", src: "src/assets" },
        { dest: "build", src: "src/data" },
        { dest: "build", src: "src/auth" },
        
        //configs
        { dest: "build", src: "src/config"},
        //HTML
        { dest: "build", src: "src/index.html", transform: (contents) => contents.toString().replace(/__BASE_HREF_TO_BE_REPLACED_BY_ROLLUP__/g, BASE) }
      ],
      copyOnce: PROD, // <-- re-copy on changes in dev
      hook: "writeBundle",
      // ensure file changes trigger copy in --watch
      watch: ["src/**/*.js", "src/**/*.html", "src/**/*.styl"]
    }),
    {
      // Concatenate Deck.gl core + layers into one file vendor/deck.js
      name: "bundle-deck-umd",
      writeBundle() {
        const getPkgRoot = (id) => path.resolve(path.dirname(require.resolve(id)), "..");
        // deck.gl root folders (cannot resolve package.json due to exports)
        const deckCorePath   = path.join(getPkgRoot("@deck.gl/core"), "dist.min.js");
        const deckLayersPath = path.join(getPkgRoot("@deck.gl/layers"), "dist.min.js");

        const core   = fs.readFileSync(deckCorePath, "utf8");
        const layers = fs.readFileSync(deckLayersPath, "utf8");
        const outDir = path.join(__dirname, "build/vendor");
        fs.mkdirSync(outDir, { recursive: true });
        // Ensure core goes first
        fs.writeFileSync(path.join(outDir, "deck.js"), `${core}\n${layers}`);
        console.log("[deck] ✅ bundled core + layers into build/vendor/deck.js");
      }
    },
    replace({
      preventAssignment: true,
      ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
    PROD && esbuild({
      minify: PROD,
      keepNames: true, // prevent renaming of class/function identifiers
      target: "es2020", // bump as high as your audience allows
      legalComments: "none"
    }),
    PROD && visualizer({ filename: "./build/stats.html" }),
    {
      name: 'verify-base-href',
      closeBundle() {
        const htmlPath = path.join(__dirname, "build/index.html");
        if (!fs.existsSync(htmlPath)) 
          return console.warn("[verify] build/index.html not found yet");
        const html = fs.readFileSync(htmlPath, "utf8");
        if (html.includes("__BASE_HREF_TO_BE_REPLACED_BY_ROLLUP__")) {
          console.error("[verify] ❌ Placeholder still present in build/index.html");
          throw new Error("BASE placeholder not replaced");
        }
        console.log('\x1b[32m%s\x1b[0m', `✅ Page built with <base href="${BASE}">`);
      }
    }
  ]
};
