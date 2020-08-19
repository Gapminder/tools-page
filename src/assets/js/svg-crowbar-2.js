(function() {
  const doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  //  window.URL = (window.URL || window.webkitURL);

  let body = document.body,
    emptySvg,
    svgSelect,
    excludeSelect;

  const prefix = {
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    svg: "http://www.w3.org/2000/svg"
  };

  initialize();

  function initialize() {
    const documents = [window.document],
      SVGSources = [];
    iframes = document.querySelectorAll("iframe"),
    objects = document.querySelectorAll("object"),
    script = document.querySelectorAll(".svg-crowbar");

    svgSelect = script[0].getAttribute("data-svg-select") || "svg";
    excludeSelect = script[0].getAttribute("data-exclude-element-select");
    // add empty svg element
    emptySvg = window.document.createElementNS(prefix.svg, "svg");
    window.document.body.appendChild(emptySvg);
    const emptySvgDeclarationComputed = getComputedStyle(emptySvg);

    [].forEach.call(iframes, el => {
      try {
        if (el.contentDocument) {
          documents.push(el.contentDocument);
        }
      } catch (err) {
        console.log(err);
      }
    });

    [].forEach.call(objects, el => {
      try {
        if (el.contentDocument) {
          documents.push(el.contentDocument);
        }
      } catch (err) {
        console.log(err);
      }
    });

    documents.forEach(doc => {
      const newSources = getSources(doc, emptySvgDeclarationComputed);
      // because of prototype on NYT pages
      for (let i = 0; i < newSources.length; i++) {
        SVGSources.push(newSources[i]);
      }
    });
    if (SVGSources.length > 0) {
      download(SVGSources[0]);
    } else {
      console.warn("Couldn’t find any SVG nodes for download.");
    }

  }

  function cleanup() {
    const crowbarElements = document.querySelectorAll(".svg-crowbar");

    [].forEach.call(crowbarElements, el => {
      el.parentNode.removeChild(el);
    });
    emptySvg.parentNode.removeChild(emptySvg);
  }


  function getSources(doc, emptySvgDeclarationComputed) {
    let sources = [], width = 0, height = 0,
      svgs = doc.querySelectorAll(svgSelect);

    let parentClass;

    if (svgs.length > 0) {
      parentClass = svgs[0].parentNode.getAttribute("class");
    }

    [].forEach.call(svgs, svgSource => {

      const svg = svgSource.cloneNode(true);
      svgSource.parentNode.appendChild(svg);

      const excludeElements = svg.querySelectorAll(excludeSelect);
      [].forEach.call(excludeElements, el => {
        el.parentNode.removeChild(el);
      });

      svg.setAttribute("version", "1.1");

      // removing attributes so they aren't doubled up
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xlink");

      // These are needed for the svg
      if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
        svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
      }

      if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
        svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
      }

      setInlineStyles(svg, emptySvgDeclarationComputed);

      const source = (new XMLSerializer()).serializeToString(svg);
      sources.push(source);

      const rect = svg.getBoundingClientRect();
      if (width < rect.width) width = rect.width;
      if (height < rect.height) height = rect.height;

      svgSource.parentNode.removeChild(svg);
    });

    return [{
      class: parentClass,
      source: [doctype + '<svg width="' + width + '" height="' + height + '">' + sources.join("") + "</svg>"]
    }];
  }

  function download(source) {
    let filename = "untitled";
    if (source.id) {
      filename = source.id;
    } else if (source.class) {
      filename = source.class;
    } else if (window.document.title) {
      filename = window.document.title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    }

    const dateNow = new Date();

    const dateString =  dateNow.getFullYear() + ("0" + (dateNow.getMonth() + 1)).slice(-2) + ("0" + dateNow.getDate()).slice(-2) + "-" +
      ("0" + dateNow.getHours()).slice(-2) + ("0" + dateNow.getMinutes()).slice(-2) + ("0" + dateNow.getSeconds()).slice(-2);

    filename = dateString + "-" + filename.match(/-(\S+)/)[1] || filename;

    const url = window.URL.createObjectURL(new Blob(source.source, { "type": "text\/xml" }));

    const a = document.createElement("a");
    body.appendChild(a);
    a.setAttribute("class", "svg-crowbar");
    a.setAttribute("download", filename + ".svg");
    a.setAttribute("href", url);
    a.style["display"] = "none";
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      cleanup();
    }, 10);
  }


  function setInlineStyles(svg, emptySvgDeclarationComputed) {

    function explicitlySetStyle(element) {
      const cSSStyleDeclarationComputed = getComputedStyle(element);
      let i, len, key, value;
      let computedStyleStr = "";

      if (cSSStyleDeclarationComputed["display"] === "none") return false;
      if (cSSStyleDeclarationComputed["visibility"] === "hidden") return false;
      if (cSSStyleDeclarationComputed["opacity"] === "0") return false;

      for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
        key = cSSStyleDeclarationComputed[i];
        value = cSSStyleDeclarationComputed.getPropertyValue(key);
        if (value !== emptySvgDeclarationComputed.getPropertyValue(key)) {
          computedStyleStr += key + ":" + value + ";";
        }
      }

      const width = element.getAttribute("width");
      if (width || width === 0) {
        if (cSSStyleDeclarationComputed["width"] == "auto") {
          computedStyleStr += "width:" + width + (isNaN(+width) ? "" : "px") + ";";
        }
      }
      const height = element.getAttribute("height");
      if (height || height === 0) {
        if (cSSStyleDeclarationComputed["height"] == "auto") {
          computedStyleStr += "height:" + height + (isNaN(+height) ? "" : "px") + ";";
        }
      }

      element.setAttribute("style", computedStyleStr);
      return true;
    }
    function traverse(obj) {
      const tree = [];
      tree.push(obj);
      visit(obj);
      function visit(node) {
        if (node && node.hasChildNodes()) {
          let child = node.firstChild;
          while (child) {
            if (child.nodeType === 1 && child.nodeName != "SCRIPT") {
              tree.push(child);
              visit(child);
            }
            child = child.nextSibling;
          }
        }
      }
      return tree;
    }
    // hardcode computed css styles inside svg
    const allElements = traverse(svg);
    let i = allElements.length;
    while (i--) {
      if (!explicitlySetStyle(allElements[i])) {
        allElements[i].parentNode.removeChild(allElements[i]);
      }
    }
  }


})();
