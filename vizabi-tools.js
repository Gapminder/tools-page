// Single source of truth: declare loaders here.
// (Everything is lazy; nothing bundled into the entry chunk.)
const loaders = {
  //linechart:     () => import("@vizabi/linechart"),
  //barrank:       () => import("@vizabi/barrank"),
  bubblechart:   () => import("@vizabi/bubblechart"),
  //bubblemap:     () => import("@vizabi/bubblemap"),
  //mountainchart: () => import("@vizabi/mountainchart"),
  //popbyage:      () => import("@vizabi/popbyage"),
  spreadsheet:   () => import("@vizabi/spreadsheet"),
  combo:         () => import("@vizabi/combo"),
  extapimap:     () => import("@vizabi/extapimap"),
};

const TOOL_CSS_HREF = {
  //linechart:     "assets/css/linechart.css",
  //barrank:       "assets/css/barrank.css",
  bubblechart:   "assets/css/bubblechart.css",
  //bubblemap:     "assets/css/bubblemap.css",
  //mountainchart: "assets/css/mountainchart.css",
  //popbyage:      "assets/css/popbyage.css",
  spreadsheet:   "assets/css/spreadsheet.css",
  combo:         "assets/css/combo.css",
  extapimap:     "assets/css/extapimap.css",
};

function loadCSS(name) {
  const href = TOOL_CSS_HREF[name];
  if (!href) return;
  if (document.querySelector(`link[data-tool-css="${name}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;            // relative to build/tools/
  link.dataset.toolCss = name; // guard against duplicates
  document.head.appendChild(link);
}

export async function loadTool(name) {
  loadCSS(name);
  return loaders[name]?.() ?? Promise.reject(new Error(`Unknown tool: ${name}`)); 
}