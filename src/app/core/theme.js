let _theme = {};

export default function ThemeService(theme = {}) {
  _theme = theme;

  function parseValue(str){
    /* vlues in form of:
    "image": "none //none|svg|png //global https url or /local/path or ICON_ID",
    */
    if (typeof str !== "string") return str;
    const [value] = str.split(" //");
    if(["off", "none", "hidden", "null", "false", ""].includes(value.trim())) return false;
    return value.trim();
  }

  function getVariablesCSS(variables, scope=":root"){
    const lines = Object.entries(variables).map(([k, v]) => `--${k}: ${v};`);
    return `${scope}{${lines.join("")}}`;
  }

  function getFontCSS(fonts){
    function buildFontSources([alias, sources]){
      return sources.map(s => `
        @font-face{
          font-family:'${alias}';
          font-style:${s.style||'normal'};
          font-weight:${s.weight||400};
          font-stretch:${s.stretch||'100%'};
          font-display: swap;
          src:url('${s.url}') format('${s.format||'woff2'}');
        }`).join('\n');
    }

    return Object.entries(fonts).map(buildFontSources).join('\n');
  }

  function emitCSS(css, styleId="theme"){ 
    let tag = document.getElementById(styleId);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = styleId;
      document.head.appendChild(tag);
    }
    tag.textContent = css;
  }


  function applyTheme(selector){
    const wrapper = d3.select(selector);

    //append DOM elements
    for(let [selector, value] of Object.entries(_theme.layout)){
      if (typeof selector === "string" && selector.startsWith(".too-") && Array.isArray(value)){
        for(let itemToAppend of value){
          wrapper.select(selector).append("div").attr("class", itemToAppend);
        }
      }
    }
    //apply styles
    for(let [selector, styles] of Object.entries(_theme.style)){
      if (selector === " //" || selector === " //comment") continue;
      if (typeof selector === "string" && selector.startsWith(".too-")){
        for(let [key, value] of Object.entries(styles)){
          wrapper.select(selector).style(key, value);
        }
      }
    }

    if(_theme.meta?.favicon)
      d3.select("head").append("link").attr("rel", "shortcut icon").attr("href", _theme.meta.favicon);
    
    // Open Graph meta tags
    d3.select("head").append("meta").attr("property", "og:url").attr("content", location.href);
    if(_theme.meta?.socialImage)
      d3.select("head").append("meta").attr("property", "og:image").attr("content", location.origin + "/" + _theme.meta.socialImage);
    if(_theme.meta?.title)
      d3.select("head").append("meta").attr("property", "og:title").attr("content", _theme.meta.title);
    if(_theme.meta?.description)
      d3.select("head").append("meta").attr("property", "og:description").attr("content", _theme.meta.description);
    if(_theme.meta?.type)
      d3.select("head").append("meta").attr("property", "og:type").attr("content", _theme.meta.type);
    
    // Twitter Card meta tags
    d3.select("head").append("meta").attr("name", "twitter:card").attr("content", "summary_large_image");
    if(_theme.meta?.socialImage)
      d3.select("head").append("meta").attr("name", "twitter:image").attr("content", location.origin + "/" + _theme.meta.socialImage);
    if(_theme.meta?.title)
      d3.select("head").append("meta").attr("name", "twitter:title").attr("content", _theme.meta.title);
    if(_theme.meta?.description)
      d3.select("head").append("meta").attr("name", "twitter:description").attr("content", _theme.meta.description);

    if(_theme.meta?.title)
      d3.select("head").append("title").text( _theme.meta.title );
    if(_theme.meta?.description)
      d3.select("head").append("meta").attr("name", "description").attr("content", _theme.meta.description);



    if(_theme.variables)
      emitCSS( getVariablesCSS(_theme.variables), "theme-variables" );

    if(_theme.fonts)
      emitCSS( getFontCSS(_theme.fonts), "theme-fonts" );
  }

  function getTheme(part) {
    const result = {}
    if (part && _theme[part]) {
      for(let [key, value] of Object.entries(_theme[part])){
        result[key] = parseValue(value);
      }
      return result;
    }
    return _theme[part];
  }

  return {applyTheme, getTheme};
}

