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
      const location = window.location;
      const protocolAgnosticOrigin = location.origin.replace(/http:|https:/, '');
      const pathWithQueryParamsAndHash = location.pathname + "?embedded=true" + location.hash;

      return protocolAgnosticOrigin + pathWithQueryParamsAndHash;
    }
  }
}
