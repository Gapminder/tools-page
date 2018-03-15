export default function BitlyService() {

  const bitlyUrl = 'https://api-ssl.bitly.com/v3/shorten';

  return {
    shortenUrl: function(url = document.URL, callback) {
      // if (!url.includes('gapminder')) {
      //   return;
      // }

      const serviceUrl = `${bitlyUrl}?access_token=${'c5c5bdef4905a307a3a64664b1d06add09c48eb8'}&longUrl=${encodeURIComponent(url)}`;

      return d3.json(serviceUrl, (error, response) => {
        const bitlyResponse = response;

        callback(bitlyResponse.status_code === 200 ? bitlyResponse.data.url : window.location);
      });
    }
  }
}
