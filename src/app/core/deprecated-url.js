import urlonUpgradeRule from "./deprecated-url.rules/urlonUpgrade";

const rules = [];

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
