let _theme_components = null;
let _theme_meta = null;
let _theme_layout = null;
let _theme_fonts = null;
let _theme_style = null;
let _theme_variables = null;

const DEFAULT_LAYOUT = {
  ".too-header": ["too-start"],
  ".too-header .too-start": ["too-chart-switcher"]
}
const DEFAULT_STYLE = {
  ".too-related-items": {"display": "none"},
  ".hamburger-button": {"display": "none"}
}

export default function ThemeService({theme_components, theme_meta, theme_layout, theme_fonts, theme_style, theme_variables} = {}) {
  _theme_components = theme_components;
  _theme_meta = theme_meta;
  _theme_layout = theme_layout;
  _theme_fonts = theme_fonts;
  _theme_style = theme_style;
  _theme_variables = theme_variables;

  function parseValue(str){
    /* vlues in form of:
    "image": "none //none|svg|png //global https url or /local/path or ICON_ID",
    */
    if (typeof str !== "string") return str;
    const [value] = str.split(" //");
    if(["off", "none", "hidden", "null", "false", ""].includes(value.trim())) return false;
    return value.trim();
  }

  function getGenericCSSfromObject(obj){
    return Object.entries(obj)
      .filter(([selector]) => typeof selector === "string" && !selector.trim().startsWith("//"))
      .map(([selector, styles]) => {
        const declarations = Object.entries(styles)
          .map(([prop, value]) => `  ${prop}: ${value};`)
          .join('\n');
        return `${selector} {\n${declarations}\n}`;
      })
      .join('\n\n');
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
    const layout = _theme_layout && Object.keys(_theme_layout).length > 0 ? _theme_layout : DEFAULT_LAYOUT;
    if(layout)
      for(let [selector, value] of Object.entries(layout)){
        if (typeof selector === "string" && selector.startsWith(".too-") && Array.isArray(value)){
          for(let itemToAppend of value){
            wrapper.select(selector).append("div").attr("class", itemToAppend);
          }
        }
      }
    
    //apply styles via CSS
    const style = _theme_style && Object.keys(_theme_style).length > 0 ? _theme_style : DEFAULT_STYLE;
    if(style)
      emitCSS(getGenericCSSfromObject(style), "theme-style");

    if(_theme_meta?.favicon)
      d3.select("head").append("link").attr("rel", "shortcut icon").attr("href", _theme_meta.favicon);
    
    // Open Graph meta tags
    d3.select("head").append("meta").attr("property", "og:url").attr("content", location.href);
    if(_theme_meta?.socialImage)
      d3.select("head").append("meta").attr("property", "og:image").attr("content", location.origin + "/" + _theme_meta.socialImage);
    if(_theme_meta?.title)
      d3.select("head").append("meta").attr("property", "og:title").attr("content", _theme_meta.title);
    if(_theme_meta?.description)
      d3.select("head").append("meta").attr("property", "og:description").attr("content", _theme_meta.description);
    if(_theme_meta?.type)
      d3.select("head").append("meta").attr("property", "og:type").attr("content", _theme_meta.type);
    
    // Twitter Card meta tags
    d3.select("head").append("meta").attr("name", "twitter:card").attr("content", "summary_large_image");
    if(_theme_meta?.socialImage)
      d3.select("head").append("meta").attr("name", "twitter:image").attr("content", location.origin + "/" + _theme_meta.socialImage);
    if(_theme_meta?.title)
      d3.select("head").append("meta").attr("name", "twitter:title").attr("content", _theme_meta.title);
    if(_theme_meta?.description)
      d3.select("head").append("meta").attr("name", "twitter:description").attr("content", _theme_meta.description);

    if(_theme_meta?.title)
      d3.select("head").append("title").text( _theme_meta.title );
    if(_theme_meta?.description)
      d3.select("head").append("meta").attr("name", "description").attr("content", _theme_meta.description);



    if(_theme_variables)
      emitCSS( getVariablesCSS(_theme_variables), "theme-variables" );

    if(_theme_fonts)
      emitCSS( getFontCSS(_theme_fonts), "theme-fonts" );
  }

  function getTheme(component) {
    if (!component || !_theme_components || !_theme_components[component]) return {};

    const result = {}
    for(let [key, value] of Object.entries(theme_components[component]))
      result[key] = parseValue(value);

    return result;
  }

  return {applyTheme, getTheme};
}

