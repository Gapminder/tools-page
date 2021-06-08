const ChartSwitcher = function(placeHolder, translator, dispatch, { tools, appState, onClick }) {
  const templateHtml = `
    <div class="chart-switcher">
      <a class="chart-switcher-button"></a>
    </div>
    <div class="chart-switcher-options" hidden>
        <div><a rel="noopener"></a></div>
    </div>
  `;
  //require("./chart-switcher.html");

  const template = d3.create("div");
  template.html(templateHtml);

  //TODO why is it not passed via arguments?
  tools = toolsPage_toolset;

  const itemTemplate = template.select(".chart-switcher-options div");
  const onlyChartTools = tools.filter(({ tool }) => tool);
  for (const tool of onlyChartTools) {
    itemTemplate.clone(true)
      .datum(tool)
      .classed("selected", tool.id === appState.tool)
      .raise()
      .call(fillToolItem, this);
  }
  itemTemplate.remove();

  this.areToolsOpen = false;
  const switcher = template.select(".chart-switcher-button");
  switcher.on("click", () => switchTools.call(this));

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  translate();
  dispatch.on("translate.chartSwitcher", () => {
    translate();
  });

  dispatch.on("toolChanged.chartSwitcher", d => {
    const tool = tools.filter(({ id }) => id === d)[0];
    toolChanged(tool);
  });

  d3.select(window).on("resize.chartSwitcher", () => switchTools.call(this, false));
  d3.select(window).on("click.chartSwitcher", () => {
    const event = d3.event;
    if (this.areToolsOpen && event.target && (event.target !== switcher.node())) {
      switchTools.call(this, false);
    }
  });

  function translate() {
    const selectedToolConfig = tools.filter(({ id }) => id === appState.tool)[0];
    placeHolder.select(".chart-switcher-button")
      .text(translator(selectedToolConfig.title || selectedToolConfig.id));
    placeHolder.selectAll(".chart-switcher-options div")
      .select("a").text(d => translator(d.title || d.id));
  }

  function toolChanged(tool) {
    placeHolder.select(".chart-switcher-button")
      .text(translator(tool.title || tool.id));
    placeHolder.selectAll(".chart-switcher-options div")
      .classed("selected", _d => _d.id === tool.id);
  }

  function switchTools(force) {
    this.areToolsOpen = force || force === false ? force : !this.areToolsOpen;
    placeHolder.select(".chart-switcher-options").attr("hidden", this.areToolsOpen ? null : true);
  }

  function getLink(tool) {
    return `${window.location.pathname}#$chart-type=${tool}`;
  }

  function fillToolItem(item, _this) {
    const tool = item.datum();
    const a = item.select("a");
    if (tool.url) {
      a.attr("href", tool.url);
    } else {
      a.attr("href", getLink(tool.id))
        .on("click", d => {
          switchTools.call(_this);
          onClick(d);
        });
    }
  }

};

export default ChartSwitcher;
