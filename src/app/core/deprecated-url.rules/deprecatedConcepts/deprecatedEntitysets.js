/*
if the URL points to one of the listed "chartTypes"
and contains keys among "entitySets": {key: value, anotherkey: anothervalue} in expressions like
"$" + key + "$/$in"
"$" + key + "="

these keys will be replaced with their corresponding values
"$" + value + "$/$in"
"$" + value + "="
*/
const getRule = (entitysetMapping) => ({

  test(url) {
    const hashIndex = url.indexOf("#");
    if (hashIndex == -1) return false;

    if(!entitysetMapping || !entitysetMapping.chartTypes || !entitysetMapping.entitySets)
      return false;

    const hash = url.substr(hashIndex + 1);

    return entitysetMapping.chartTypes.some(m =>
      hash.includes("chart-type=" + m)
    ) && Object.keys(entitysetMapping.entitySets).some(m =>
      hash.includes("$" + m + "$/$in") || hash.includes("$" + m + "=")
    );
  },

  use(url) {
    const hashIndex = url.indexOf("#");
    const hashPrefix = url.substr(0, hashIndex);
    let hash = url.substr(hashIndex);
    const entitySets = entitysetMapping.entitySets;

    Object.keys(entitySets).forEach(m => {
      hash = hash.split("$" + m + "$/$in").join("$" + entitySets[m] + "$/$in");
      hash = hash.split("$" + m + "=").join("$" + entitySets[m] + "=");
    });

    return hashPrefix + hash;
  }
});

export default getRule;
