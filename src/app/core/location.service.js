export default function LocationService() {

  return {
    getUrlHash(hash = window.location.hash) {
      const hashPosition = hash.indexOf("#");
      if (hashPosition === -1) {
        return "";
      }
      return hash.slice(hashPosition + 1);
    },

    getUrlReadyForEmbedding() {
      const url = new URL(window.location.href);
      url.searchParams.set("embedded", "true"); // adds or overwrites
      // Return full absolute URL
      return url.toString();
      // If you prefer protocol-relative:
      // return url.toString().replace(/^https?:/, "");
    }
  };
}
