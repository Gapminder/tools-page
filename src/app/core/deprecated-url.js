import urlonUpgradeRule from "./deprecated-url.rules/urlonUpgrade.js";
import worldAdapterRule from "./deprecated-url.rules/worldAdapter/worldAdapter.js";
import worldReferrerRule from "./deprecated-url.rules/worldReferrer.js";
import vizabiStateV0toV1adapter from "./deprecated-url.rules/vizabiStateV0toV1adapter.js";
import deprecatedConceptsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedConcepts.js";
import deprecatedEntitysetsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedEntitysets.js";

const rules = [];

addRule(worldReferrerRule);
addRule(worldAdapterRule);
addRule(urlonUpgradeRule);
addRule(vizabiStateV0toV1adapter);
addRule(deprecatedConceptsRule);
addRule(deprecatedEntitysetsRule);

function upgradeUrl(url) {
  return rules.reduce((resultUrl, { test, use }) => test(resultUrl) ? use(resultUrl) : resultUrl, url);
}

function addRule(rule) {
  rules.push(rule);
}

export {
  upgradeUrl
};
