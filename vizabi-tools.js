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
// Tools that need Deck
const DECK_TOOLS = new Set(["extapimap", "combo", "bubblechart"]);

async function loadMapbox(resolveAssetUrl) {
  if (window.mapboxgl) return Promise.resolve();
  
  // Load CSS
  if (!document.querySelector('link[data-mapbox-css]')) {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = resolveAssetUrl("./assets/css/mapbox-gl.css");
    cssLink.dataset.mapboxCss = "true";
    document.head.appendChild(cssLink);
  }
  
  // Load JS as global script (bypass bundler mangling)
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = resolveAssetUrl("./vendor/mapbox-gl.js");
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadDeck(resolveAssetUrl) {
  if (window.deck) return Promise.resolve();

  // Load JS as global script (bypass bundler mangling)
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = resolveAssetUrl("./vendor/deck.js"); 
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
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
  
  const promises = [];
  if (MAPBOX_TOOLS.has(name)) {
    promises.push(loadMapbox(resolveAssetUrl));
  }
  if (DECK_TOOLS.has(name)) {
    promises.push(loadDeck(resolveAssetUrl));
  }
  await Promise.all(promises);

  loadCSS(name, resolveAssetUrl);
  return loaders[name]?.() ?? Promise.reject(new Error(`Unknown tool: ${name}`)); 
}