export function saveSvg(view, name) {

  const ContainerElements = ["svg", "g", "defs", "marker", "text"];
  const RelevantStyles = {
    "rect": ["fill", "stroke", "stroke-width", "opacity"],
    "path": ["fill", "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray", "opacity"],
    "marker": ["fill", "stroke", "stroke-width", "opacity"],
    "circle": ["fill", "stroke", "stroke-width", "opacity"],
    "line": ["stroke", "stroke-width", "stroke-dasharray", "stroke-opacity", "opacity"],
    "text": ["fill", "font-size", "text-anchor", "visibility", "font-family", "opacity", "dominant-baseline", "font-variant", "letter-spacing"],
    "polygon": ["stroke", "fill", "opacity"] };

  function read_Element(ParentNode, OrigData) {
    const Children = ParentNode.childNodes;
    const OrigChildDat = OrigData.childNodes;

    for (let cd = 0; cd < Children.length; cd++) {
      const Child = Children[cd];

      const TagName = Child.tagName;
      if (TagName in RelevantStyles) {
        const StyleDef = window.getComputedStyle(OrigChildDat[cd]);

        let StyleString = "";
        for (let st = 0; st < RelevantStyles[TagName].length; st++) {
          StyleString += RelevantStyles[TagName][st] + ":" + StyleDef.getPropertyValue(RelevantStyles[TagName][st]) + "; ";
        }

        Child.setAttribute("style", StyleString);
      }

      if (ContainerElements.indexOf(TagName) != -1)
        read_Element(Child, OrigChildDat[cd]);
    }

  }

  function removeHiddenNodes(ParentNode) {
    const Children = ParentNode.childNodes;
    for (let cd = 0; cd < Children.length; cd++) {
      const Child = Children[cd];

      if (Child.classList && (Child.style.opacity === "0" || Child.classList.contains("vzb-noexport") || Child.classList.contains("vzb-transparent") || Child.classList.contains("vzb-invisible") || Child.classList.contains("vzb-hidden"))) {
        Child.remove();
        cd--;
      } else
      if (ContainerElements.indexOf(Child.tagName) != -1) removeHiddenNodes(Child);
    }
  }

  function export_StyledSVG(SVGElem, name) {
    const oDOM = SVGElem.cloneNode(true);
    read_Element(oDOM, SVGElem);
    removeHiddenNodes(oDOM);

    oDOM.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const data = new XMLSerializer().serializeToString(oDOM);
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svg = new Blob([preface, data], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);

    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    const Text = document.createTextNode("Export");
    link.appendChild(Text);
    link.download = name;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export_StyledSVG(view.node(), name);
  return Promise.resolve();

}
