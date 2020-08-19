const rule = {
  test(url) {
    const hashIndex = url.indexOf("#");
    if (hashIndex == -1) return false;

    const hash = url.substr(hashIndex + 1);

    return toolsPage_entitysetMapping.chartTypes.some(m =>
      hash.includes("chart-type=" + m)
    ) && Object.keys(toolsPage_entitysetMapping.entitySets).some(m =>
      hash.includes("$" + m + "$/$in") || hash.includes("$" + m + "=")
    );
  },

  use(url) {
    const hashIndex = url.indexOf("#");
    const hashPrefix = url.substr(0, hashIndex);
    let hash = url.substr(hashIndex);
    const entitySets = toolsPage_entitysetMapping.entitySets;

    Object.keys(entitySets).forEach(m => {
      hash = hash.split("$" + m + "$/$in").join("$" + entitySets[m] + "$/$in");
      hash = hash.split("$" + m + "=").join("$" + entitySets[m] + "=");
    });

    return hashPrefix + hash;
  }
};

export default rule;
