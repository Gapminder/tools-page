export default function BitlyService() {

  const bitlyUrl = 'https://api-ssl.bitly.com/v4/shorten';

  return {
    shortenUrl: function(url = document.URL, callback) {

      return d3.json(bitlyUrl, {
        method:"POST",
        body: JSON.stringify({
          long_url : url
        }),
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer da63d03dbdcd9d18de75a7a1340dc0aaf3fa3c7f"
        }
      })
      .then(response => {
        callback(response.link);
      })
      .catch(error => {
        callback(window.location);
      });
    }
  }
}


