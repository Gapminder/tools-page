import { supabaseClient, userLogin, userLogout, userSignup, isLogged } from "./supabase.service";
import toolsPage_properties from "toolsPage_properties";
import { ICON_GITHUB, ICON_GOOGLE } from "../core/icons";

const UserLogin = function({ dom, translator, state, data, getTheme}) {
  const pageSlug = toolsPage_properties?.page_slug;
  const template = `  
    <div class="user-login-title">Log in</div>
    <div class="user-logged-title">&#x2714</div>
    <div class="user-logged-form-wrapper">
      <span class="user-logged-name"></span>
      <button class="user-logged-logout">Log out</button>
      <hr>
      <span>Data Verkstad:</span>
      <a href="https://vizabi.com/verkstad?tab=servers${pageSlug ? "&from="+pageSlug : ""}" target="_blank" class="user-logged-dataeditor">Hantera data källor</a>
      <a href="https://vizabi.com/verkstad?tab=permalinks${pageSlug ? "&from="+pageSlug : ""}" target="_blank" class="user-logged-permalinks">Hantera korta URLs</a>
    </div>
    <div class="user-login-form-wrapper">
      <div class="user-login-form">
        <a class="user-login-close">✕</a>
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
            
            <span class="login-oauth">
              <span class="button button-google-login">${ICON_GOOGLE}</span>
              <span class="button button-github-login">${ICON_GITHUB}</span>
            </span>
            <hr>
            <span class="hr-text-center">or</span>
            <span class="button button-switch-signup">Sign up</span>
          </form>
        </span>
      </div>
    </div>
  `;

  const CLASS = "UserLogin";
  const theme = getTheme(CLASS) || {};
  const placeHolder = d3.select(dom);
  if(!placeHolder || placeHolder.empty()) return;   
  placeHolder.html(template);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => placeHolder.style(key, value) );


  // const template = d3.create("div");
  // template.html(templateHtml);

  // for (const elem of Array.from(template.node().children)) {
  //   placeHolder.append(() => elem);
  // }

  this.isUserLoginOpen = false;
  
  placeHolder.select(".user-logged-title").on("click", () => {
    switchUserLogin.call(this);
  });

  placeHolder.select(".user-logged-logout").on("click", async () => {
    if (await userLogout()) {
      switchUserLogin.call(this);
      updateUserLogin();
    }
  });

  placeHolder.select(".user-login-title").on("click", () => {
    placeHolder.select(".user-login-form").classed("signup", false);
    switchUserLogin.call(this);
  });

  placeHolder.select(".user-login-close").on("click", () => switchUserLogin.call(this));
  placeHolder.select(".button-switch-signup").on("click", ()=> {
    placeHolder.select(".user-login-form").classed("signup", true);
  });

  placeHolder.select(".signup-panel").on("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (await userSignup(data.get("email"), data.get("psw"))) {
      switchUserLogin.call(this);
      updateUserLogin();
    }
  });

  placeHolder.select(".login-panel").on("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (await userLogin(data.get("email"), data.get("psw"))) {
      switchUserLogin.call(this);
      updateUserLogin();
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

  supabaseClient.auth.onAuthStateChange((event, session) => {
    state.setAuthToken({event, session})
  
    if (event === 'INITIAL_SESSION') {
  
    } else if (event === 'SIGNED_IN') {
      setTimeout(() => {
        updateUserLogin();
        if (this.openPopup) {
          this.openPopup.close();
          this.openPopup = void 0;
        }
      }, 0)
    } else if (event === 'SIGNED_OUT') {
  
    } else if (event === 'PASSWORD_RECOVERY') {
  
    } else if (event === 'TOKEN_REFRESHED') {
  
    } else if (event === 'USER_UPDATED') {
  
    }
  })

  placeHolder.select(".button-github-login").on("click", async () => {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: location.origin + "/tools/auth/",
          skipBrowserRedirect: true
        }
      })
      console.log(error, data)
      
      this.openPopup = openPopup(data.url, "OAuth", screen.width * 0.3, screen.height * 0.6);

      switchUserLogin.call(this);
      updateUserLogin();
  });

  placeHolder.select(".button-google-login").on("click", async () => {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
        },
        scopes: ["email", "profile"],
        redirectTo: location.origin + "/tools/auth/",
        skipBrowserRedirect: true
      }
    });
    console.log(error, data);    

    if (!error) {
      this.openPopup = openPopup(data.url, "OAuth", screen.width * 0.3, screen.height * 0.6);
    }

    switchUserLogin.call(this);
    updateUserLogin();

  })

  function openPopup(src, title, width, height) {
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 4;
    return window.open(src, title, 'popup, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  }
  
  function switchUserLogin(force) {
    this.isUserLoginOpen = force || force === false ? force : !this.isUserLoginOpen;
    placeHolder.classed("open", this.isUserLoginOpen);
  }

  async function updateUserLogin() {
    const logged = await isLogged();
    if (logged.isLogged) {
      placeHolder.select(".user-logged-name").text(logged.session.user.email);
      placeHolder.select(".user-logged-title").text(logged.session.user.email.split("@")[0]);
    }
    placeHolder.classed("logged", logged.isLogged);
  }

  this.isLogged = false;

  updateUserLogin();
}

export default UserLogin;