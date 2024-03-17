import * as utils from "../../core/utils";

const UserLogin = function(placeHolder, translator, dispatch, { relatedItems }) {
  const templateHtml = `  
    <div class="user-login-title">Log in</div>
    <div class="user-logged-title">&#x2714</div>
    <div class="user-logged-form-wrapper">
      <span class="user-logged-name"></span>
      <button class="user-logged-logout">Log out</button>
      <hr>
      <button class="user-logged-dataeditor">Data source editor</button>
      <button class="user-logged-datasets">Server datasets</button>
    </div>
    <div class="user-login-form-wrapper how-to-outer">
      <div class="user-login-form">
        <span class="user-login-close button-close">×</span>
        <span>
          <form class="panel signup-panel">
            <span>Sign up</span>
            <label for="email"><b>E-mail</b></label>
            <input type="email" placeholder="Enter email" name="email" required>

            <label for="psw"><b>Choose Password</b></label>
            <input id="signup-psw" type="password" placeholder="Enter Password" name="psw" required minlength="6">

            <label for="psw2"><b>Confirm New Password</b></label>
            <input id="signup-psw2" type="password" placeholder="Enter Password" name="psw2" required minlength="6">

            <button class="button button-signup">Create account</button>
          </form>
          <form class="panel login-panel">
            <span>Log in</span>
            <label for="email"><b>E-mail</b></label>
            <input type="email" placeholder="Enter email" name="email" required>

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" required minlength="6">

            <button class="button button-login">Log in</button>

            <hr>
            <span class="hr-text-center">or</span>
            <span class="button button-switch-signup">Sign up</span>
          </form>
        </span>
      </div>
    </div>
  `;

  const template = d3.create("div");
  template.html(templateHtml);

  for (const elem of Array.from(template.node().children)) {
    placeHolder.append(() => elem);
  }

  this.isUserLoginOpen = false;
  
  placeHolder.select(".user-logged-title").on("click", () => {
    switchUserLogin.call(this);
  });

  placeHolder.select(".user-logged-logout").on("click", () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    updateUserLogin();
    switchUserLogin.call(this);
  });

  placeHolder.select(".user-login-title").on("click", () => {
    placeHolder.select(".user-login-form").classed("signup", false);
    switchUserLogin.call(this);
  });

  placeHolder.select(".user-login-close").on("click", () => switchUserLogin.call(this));
  placeHolder.select(".button-switch-signup").on("click", ()=> {
    placeHolder.select(".user-login-form").classed("signup", true);
  });

  placeHolder.select(".signup-panel").on("submit", event => {
    event.preventDefault();
    const data = new FormData(event.target);
    userSignup(data.get("email"), data.get("psw"));
    switchUserLogin.call(this);
  });

  placeHolder.select(".login-panel").on("submit", event => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (userLogin(data.get("email"), data.get("psw"))) {
      switchUserLogin.call(this);
    };
  });

  placeHolder.select("#signup-psw").on("input", (event) => {
    const data = new FormData(event.target.form);
    placeHolder.select("#signup-psw2").node()
      .setCustomValidity(data.get("psw") !== data.get("psw2") ? "Passwords should be equal" : "");
  });

  placeHolder.select("#signup-psw2").on("input", (event) => {
    const data = new FormData(event.target.form);
    event.target.setCustomValidity("");
    event.target.setCustomValidity(data.get("psw") !== data.get("psw2") ? "Passwords should be equal" : "");
  });





  function switchUserLogin(force) {
    this.isUserLoginOpen = force || force === false ? force : !this.isUserLoginOpen;
    placeHolder.classed("open", this.isUserLoginOpen);
  }

  function updateUserLogin() {
    placeHolder.classed("logged", isLogged())
  }


  async function userSignup(user, pass) {
    const hash = await hashSHA2(`${user}:${pass}`);

    sessionStorage.setItem("user", user)
    sessionStorage.setItem("token", hash);
    
    //TODO save user
    return true;
  }

  async function userLogin(user, pass) {
    const hash = await hashSHA2(`${user}:${pass}`);

    sessionStorage.setItem("user", user)
    sessionStorage.setItem("token", hash);

    //TODO check user
    return true;
  }

  this.isLogged = false;

  function isLogged() {
    return sessionStorage.getItem("user") && sessionStorage.getItem("token");
  }
  
  async function hashSHA2(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  updateUserLogin();

}

export default UserLogin;