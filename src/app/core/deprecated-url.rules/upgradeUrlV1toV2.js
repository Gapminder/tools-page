/*
  the transition from v1 to v2 contains two breaking changes
    - CHANGE 1
    "geo" is now preferred instead of "country" in filters. some URLS break because they set "country" in enc filters and spaces
    here space@=country&=time should be space@=geo&=time
    before
    https://www.gapminder.org/tools/#$ui$buttons$sidebarCollapse:true;&chart$opacityRegular:1&opacitySelectDim:0.27&showForecast:true;&projector:true;&model$markers$bubble$encoding$size$scale$extent@:0.08&:0.87;;;&y$data$concept=hapiscore_whr&source=fasttrack&space@=country&=time;;&scale$domain:null&zoomed:null&type:null;;&color$data$concept=flag_svg&source=country_flags;&scale$type:null&domain:null&zoomed:null;;&frame$speed:841&value=2007;;;;;&chart-type=bubbles&url=v1
    after
    https://www.gapminder.org/tools/#$ui$buttons$sidebarCollapse:true;&chart$opacityRegular:1&opacitySelectDim:0.27&showForecast:true;&projector:true;&model$markers$bubble$encoding$size$scale$extent@:0.08&:0.87;;;&y$data$concept=hapiscore_whr&source=fasttrack&space@=geo&=time;;&scale$domain:null&zoomed:null&type:null;;&color$data$concept=flag_svg&source=country_flags;&scale$type:null&domain:null&zoomed:null;;&frame$speed:841&value=2007;;;;;&chart-type=bubbles&url=v1

    - CHANGE 2
    the new markercontrols dialog expects a layer of "or" in marker filter
    before
    https://www.gapminder.org/tools/#$ui$chart$endBeforeForecast=2023;;&model$markers$pyramid$data$filter$dimensions$geo$geo$/$in@=americas&=europe&=africa&=asia;;;;;;&encoding$aggregate$grouping$age$grouping:5;;;&frame$value=1950&playbackSteps:5;;;;;&chart-type=popbyage&url=v1
    after
    https://www.gapminder.org/tools/#$ui$chart$endBeforeForecast=2023;;&model$markers$pyramid$data$filter$dimensions$geo$/$or@$geo$/$in@=americas&=europe&=africa&=asia;;;;;;;;&encoding$aggregate$grouping$age$grouping:5;;;&frame$value=1950&playbackSteps:5;;;;;&chart-type=popbyage&url=v1

*/

const rule = {
  test(url) {
    return url.includes("#") && url.includes("url=v1");
  },

  use(url) {

    // CHANGE 1
    url = url
      .replaceAll("$country$/in", "$geo$/in")
      .replaceAll("$country=", "$geo=");


    // Replace "country" with "geo" and return the modified string
    // this regex tests if url has a substring in the form of "space@ ... =country ... ;"
    const spaceRegex = /(space@[^;]*)(=country)([^;]*;)/;
    while (spaceRegex.test(url))
      url = url.replace(spaceRegex, "$1=geo$3");


    // CHANGE 2
    // this regex tests if url has a substring in the form of "$filter$dimensions$geo$geo$/$in@ ... ;;;;;;"
    const filterRegex = /(\$filter\$dimensions\$geo\$geo\$\/\$in@)([^;]*)(;;;;;;)/;
    while (filterRegex.test(url))
      url = url.replace(filterRegex, "$filter$dimensions$geo$/$or@$geo$/$in@$2;;;;;;;;");

    return url;
  }
};

export default rule;
