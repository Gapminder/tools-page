import urlonUpgradeRule from "./deprecated-url.rules/urlonUpgrade";
import worldAdapterRule from "./deprecated-url.rules/worldAdapter/worldAdapter";
import deprecatedConceptsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedConcepts";

const rules = [];

addRule(worldAdapterRule);
addRule(deprecatedConceptsRule);
addRule(urlonUpgradeRule);

function upgradeUrl(url) {
  return rules.reduce((resultUrl, {test, use}) => {
    return test(resultUrl) ? use(resultUrl) : resultUrl;
  }, url);
}

function addRule (rule) {
  rules.push(rule);
}

export {
  upgradeUrl
};
