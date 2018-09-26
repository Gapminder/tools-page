import message from "./../../header/message/message";

const rule = {
  test: function(url) {
    return document.referrer.indexOf("gapminder.org/world") !== -1 || /from=world/.test(url) || /#\$majorMode/.test(url);
  },

  use: function(url) {
    const hashIndex = url.indexOf("#");
    const hash = (hashIndex !== -1) ? url.substr(hashIndex) : '';

	message.showMessage(`<strong>Welcome to Gapminder Tools!</strong><br>
        You came to this page using a link to Gapminder World, our old charts. What you see now is its replacement with newer data and better looks.<br> 
        We aren't planning to keep the old Gapminder World around for much longer: it's a pain in the neck to maintain and adds infrastructure costs. If you really-really need it, please <a href="mailto:angie@gapminder.org">write us why</a>, let's see how many you are, hopefully not that many. The new Gapminder Tools (this page you are looking at) will be developled and maintained further`
    );
    return url;
  }
}

export default rule;