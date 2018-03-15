export default function LocationService() {

  return {
    getUrlHash: function (hash = window.location.hash) {
      const hashPosition = hash.indexOf('#');
      if (hashPosition === -1) {
        return '';
      }
      return hash.slice(hashPosition + 1);
    },

    getUrlReadyForEmbedding: function () {
      const urlTree = this.router.parseUrl(this.router.url);
      urlTree.queryParams = urlTree.queryParams || {};
      urlTree.queryParams.embedded = 'true';

      const protocolAgnosticOrigin = window.location.origin.replace(/http:|https:/, '');
      const pathWithQueryParamsAndHash = this.location.prepareExternalUrl(this.router.serializeUrl(urlTree));

      return protocolAgnosticOrigin + pathWithQueryParamsAndHash;
    }
  }
}
