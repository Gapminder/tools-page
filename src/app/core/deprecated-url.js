import urlonUpgradeRule from "./deprecated-url.rules/urlonUpgrade";
import worldAdapterRule from "./deprecated-url.rules/worldAdapter/worldAdapter";
import worldReferrerRule from "./deprecated-url.rules/worldReferrer";
import deprecatedConceptsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedConcepts";

const rules = [];

addRule(worldReferrerRule);
addRule(worldAdapterRule);
addRule(urlonUpgradeRule);
addRule(deprecatedConceptsRule);

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
