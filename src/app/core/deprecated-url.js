import urlonUpgradeRule from "./deprecated-url.rules/urlonUpgrade";
import worldAdapterRule from "./deprecated-url.rules/worldAdapter/worldAdapter";
import worldReferrerRule from "./deprecated-url.rules/worldReferrer";
import deprecatedConceptsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedConcepts";
import deprecatedEntitysetsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedEntitysets";

const rules = [];

addRule(worldReferrerRule);
addRule(worldAdapterRule);
addRule(urlonUpgradeRule);
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
