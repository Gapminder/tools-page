import message from "./../../header/message/message";

const rule = {
  test(url) {
    return document.referrer.indexOf("gapminder.org/world") !== -1 || /from=world/.test(url) || /#\$majorMode/.test(url);
  },

  use(url) {
    const hashIndex = url.indexOf("#");
    const hash = (hashIndex !== -1) ? url.substr(hashIndex) : "";

    message.showMessage(`<strong>Welcome to Gapminder Tools!</strong><br>
        You came to this page using a link to Gapminder World, our old charts. What you see now is its replacement with newer data and better looks.<br>
        If you really need to go back to Gapminder World: <a href="//www.gapminder.org/world-classic/?use_gapminder_world${hash}">click here</a>. Also, please let us know why by emailing <a href="mailto:angie@gapminder.org">angie@gapminder.org</a>.`
    );
    return url;
  }
};

export default rule;
