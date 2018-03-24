export function scrollTo({ durationLeft = 200, element, complete }) {
  const positionFrom = element.scrollTop;
  const positionTo = 0 - positionFrom;

  if (positionTo < 0) {
    const positionDiff = positionTo / durationLeft * 10;
    element.scrollTop += positionDiff;
    setTimeout(() => {
      scrollTo({ durationLeft: durationLeft - 25, element, complete });
    }, 25);
  } else {
    complete();
  }
}

export function translateNode(translator) {
  return function() {
    const el = d3.select(this);
    const text = el.attr("data-text");
    if (!text) return;
    const textChildNode = Array.from(el.node().childNodes)
      .filter(({ nodeName }) => nodeName === "#text")[0];
    if (textChildNode) {
      textChildNode.textContent = translator(text);
    } else {
      el.text(translator(text));
    }
  }
}

export function loadJS(url, implementationCode, location) {
  //url is URL of external file, implementationCode is the code
  //to be called from the file, location is the location to 
  //insert the <script> element
  var scriptTag = document.createElement('script');
  scriptTag.src = url;
  scriptTag.onload = implementationCode;
  scriptTag.onreadystatechange = implementationCode;
  location.appendChild(scriptTag);
};
