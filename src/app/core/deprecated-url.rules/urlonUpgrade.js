const rule = {
  test(url) {
    return /#_/.test(url);
  },

  use(url) {
    const hashIndex = url.indexOf("#");
    const hashPrefix = url.substr(0, hashIndex);
    const hash = url.substr(hashIndex);

    return hashPrefix + hash.replace("$", "/$").replace(/([^\/])_/g, "$1$");
  }
};

export default rule;
