// Single source of truth: declare loaders here.
// (Everything is lazy; nothing bundled into the entry chunk.)
const loaders = {
  linechart:      () => import("@vizabi/linechart"),
  barrank:        () => import("@vizabi/barrank"),
  bubblechart:    () => import("@vizabi/bubblechart"),
  bubblechartsvg: () => import("@vizabi/bubblechart-svg"),
  bubblemap:      () => import("@vizabi/bubblemap"),
  mountainchart:  () => import("@vizabi/mountainchart"),
  popbyage:       () => import("@vizabi/popbyage"),
  spreadsheet:    () => import("@vizabi/spreadsheet"),
  combo:          () => import("@vizabi/combo"),
  extapimap:      () => import("@vizabi/extapimap"),
};

const TOOL_CSS_HREF = {
  linechart:       "./assets/css/linechart.css",
  barrank:         "./assets/css/barrank.css",
  bubblechart:     "./assets/css/bubblechart.css",
  bubblechartsvg:  "./assets/css/bubblechart-svg.css",
  bubblemap:       "./assets/css/bubblemap.css",
  mountainchart:   "./assets/css/mountainchart.css",
  popbyage:        "./assets/css/popbyage.css",
  spreadsheet:     "./assets/css/spreadsheet.css",
  combo:           "./assets/css/combo.css",
  extapimap:       "./assets/css/extapimap.css",
};

// Tools that need Mapbox
const MAPBOX_TOOLS = new Set(["extapimap", "combo"]);

let mapboxLoaded = false;
async function loadMapbox(resolveAssetUrl) {
  if (mapboxLoaded) return;
  
  // Load CSS
  if (!document.querySelector('link[data-mapbox-css]')) {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = resolveAssetUrl("./assets/css/mapbox-gl.css");
    cssLink.dataset.mapboxCss = "true";
    document.head.appendChild(cssLink);
  }
  
  // Load JS as global script (bypass bundler mangling)
  if (!window.mapboxgl) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = resolveAssetUrl("./vendor/mapbox-gl.js");
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  mapboxLoaded = true;
}


function loadCSS(name, resolveAssetUrl) {
  const href = TOOL_CSS_HREF[name];
  if (!href) return;
  if (document.querySelector(`link[data-tool-css="${name}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolveAssetUrl(href);
  link.dataset.toolCss = name; // guard against duplicates
  document.head.appendChild(link);
}

export async function loadTool(name, resolveAssetUrl) {
  // Load Mapbox first if tool needs it
  if (MAPBOX_TOOLS.has(name)) {
    await loadMapbox(resolveAssetUrl);
  }
  loadCSS(name, resolveAssetUrl);
  return loaders[name]?.() ?? Promise.reject(new Error(`Unknown tool: ${name}`)); 
}