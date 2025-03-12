import urlonUpgradeRule from "./deprecated-url.rules/urlonUpgrade";
import legacyToolsPageRule from "./deprecated-url.rules/legacyToolsPageRule";
import worldAdapterRule from "./deprecated-url.rules/worldAdapter/worldAdapter";
//import worldReferrerRule from "./deprecated-url.rules/worldReferrer";
import deprecatedConceptsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedConcepts";
import deprecatedEntitysetsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedEntitysets";
import upgradeUrlV1toV2 from "./deprecated-url.rules/upgradeUrlV1toV2.js";

const rules = [];

//addRule(worldReferrerRule);
addRule(worldAdapterRule);
addRule(urlonUpgradeRule);
addRule(legacyToolsPageRule);
addRule(deprecatedConceptsRule);
addRule(deprecatedEntitysetsRule);
addRule(upgradeUrlV1toV2);

function upgradeUrl(url) {
  return rules.reduce((resultUrl, { test, use }) => test(resultUrl) ? use(resultUrl) : resultUrl, url);
}

function addRule(rule) {
  rules.push(rule);
}

export {
  upgradeUrl
};
