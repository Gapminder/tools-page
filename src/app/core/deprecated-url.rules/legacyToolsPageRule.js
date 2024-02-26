const rule = {
  test(url) {
    //https://www.gapminder.org/tools/#$state$time$value=2019;&marker$select@$country=fra&trailStartTime=1800&labelOffset@:0.094&:-0.182;;;&opacitySelectDim:0&axis_x$domainMin:null&domainMax:null&zoomedMin:null&zoomedMax:null&scaleType=genericLog&spaceRef:null;&axis_y$domainMin:null&domainMax:null&zoomedMin:null&zoomedMax:null&spaceRef:null;;;&chart-type=bubbles
    return url.includes("$state$") && !url.includes("url=v");
  },

  use(url) {
    console.log("OLD URL DETECTED", url);


    function parseURL(loc) {
      //const loc = window.location.toString();
      let hash = null;
      const URLI = {};
      if (loc.indexOf("#") >= 0) {
        hash = loc.substring(loc.indexOf("#") + 1);

        if (hash) {

          let parsedUrl = {};
          try {
            parsedUrl = urlon.parse(decodeUrlHash(hash) || "$;");
          }
          catch {
            console.warn("Failed to decode and parse this hash:", hash);
          }

          URLI.model = parsedUrl;
          URLI["chart-type"] = parsedUrl["chart-type"];
          delete parsedUrl["chart-type"];

        }
      }
      return URLI;
    }

    function decodeUrlHash(hash) {
      //replacing %2523 with %23 needed when manual encoding operation of encodeUrlHash()
      //plus the enforced encoding in some browsers resulted in double encoding
      return decodeURIComponent(hash.replace(/%2523/g, "%23"));
    }

    const oldState = parseURL(url);
    const oldSelect = oldState?.model?.state?.marker?.select;
    if (oldSelect) {
      console.log("ATTEMPTING TO MODERNIZE OLD SELECT", oldSelect);
      const newSelect = oldSelect.reduce((acc, m) => { acc[m.country] = m.trailStartTime; return acc; }, {});
      const newState = { model: { markers: { bubble: { encoding: { trail: { data: { filter: { markers: newSelect } } } } }  } } };
      return url.split("$state$")[0] + urlon.stringify(newState);
    }


    return url;
  }
};

export default rule;
