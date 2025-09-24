import { parseURLHashWithUrlon } from "./../../core/utils.js";

const rule = {
  test(url) {
    //https://www.gapminder.org/tools/#$state$time$value=2019;&marker$select@$country=fra&trailStartTime=1800&labelOffset@:0.094&:-0.182;;;&opacitySelectDim:0&axis_x$domainMin:null&domainMax:null&zoomedMin:null&zoomedMax:null&scaleType=genericLog&spaceRef:null;&axis_y$domainMin:null&domainMax:null&zoomedMin:null&zoomedMax:null&spaceRef:null;;;&chart-type=bubbles
    return url.includes("$state$") && !url.includes("url=v");
  },

  use(url) {
    console.log("OLD URL DETECTED", url);

    const oldState = parseURLHashWithUrlon(url);
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
