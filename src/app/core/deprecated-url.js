import urlonUpgradeRule from "./deprecated-url.rules/urlonUpgrade";
import legacyToolsPageRule from "./deprecated-url.rules/legacyToolsPageRule";
import worldAdapterRule from "./deprecated-url.rules/worldAdapter/worldAdapter";
//import worldReferrerRule from "./deprecated-url.rules/worldReferrer";
import getDeprecatedConceptsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedConcepts.js";
import getDeprecatedEntitysetsRule from "./deprecated-url.rules/deprecatedConcepts/deprecatedEntitysets.js";
import upgradeUrlV1toV2 from "./deprecated-url.rules/upgradeUrlV1toV2.js";

const rules = [];

export default function URLUpgrader({conceptMapping = {}, entitysetMapping = {}} = {}) {

  function addRule(rule) {
    rules.push(rule);
  }

  //addRule(worldReferrerRule);
  addRule(worldAdapterRule);
  addRule(urlonUpgradeRule);
  addRule(legacyToolsPageRule);
  addRule(getDeprecatedConceptsRule(conceptMapping));
  addRule(getDeprecatedEntitysetsRule(entitysetMapping));
  addRule(upgradeUrlV1toV2);


  function upgradeUrl(url) {
    return rules.reduce((resultUrl, { test, use }) => test(resultUrl) ? use(resultUrl) : resultUrl, url);
  }


  return { upgradeUrl };
}




