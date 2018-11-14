const rule = {
  test: function(url) {
    const hashIndex = url.indexOf("#");
    if (hashIndex == -1) return false;

    const hash = url.substr(hashIndex+1);

    return Object.keys(toolsPage_entitysetMapping).some(m => hash.includes("$" + m + "$/$in") || hash.includes("$" + m + "="));
  },

  use: function(url) {
    const hashIndex = url.indexOf("#");
    const hashPrefix = url.substr(0, hashIndex);
    let hash = url.substr(hashIndex);
    
    Object.keys(toolsPage_entitysetMapping).forEach(m => {
      hash = hash.split("$" + m + "$/$in").join("$" + toolsPage_entitysetMapping[m] + "$/$in");
      hash = hash.split("$" + m + "=").join("$" + toolsPage_entitysetMapping[m] + "=");
    });
                                                  
  return hashPrefix + hash;
  }
}

export default rule;