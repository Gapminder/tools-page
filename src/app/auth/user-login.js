import { supabaseClient, userLogin, userLogout, userSignup, isLogged } from "./supabase.service";
import toolsPage_properties from "toolsPage_properties";
import { ICON_GITHUB, ICON_GOOGLE } from "../core/icons";

const UserLogin = function({ dom, translator, state, data, getTheme, loginFormsDom, isPageEditor}) {
  const pageSlug = toolsPage_properties?.page_slug;
  const templateForButton = `  
    <button class="user-login-title">Log in</button>
    <div class="user-logged-title">&#x2714</div>
  `;
  const templateForForms = `
    <div class="user-logged-form">
      <a class="user-login-close">✕</a>
      <div class="panel">
        <span class="user-logged-name"></span>
        <button class="user-logged-logout">Log out</button>
        <hr>
        <span>Data Verkstad:</span>
        <a href="https://vizabi.com/verkstad?tab=servers${pageSlug ? "&from="+pageSlug : ""}" target="_blank" class="user-logged-dataeditor">Hantera data källor</a>
        <a href="https://vizabi.com/verkstad?tab=permalinks${pageSlug ? "&from="+pageSlug : ""}" target="_blank" class="user-logged-permalinks">Hantera korta URLs</a>
        <div class="panel user-logged-set-config">
          <span>Start view:</span>
          <button class="button save">Save current view as preferential</button>
          <button class="button restore">Reset preferential view</button>
        </div>      
      </div>
    </div>
    <div class="user-login-form">
        <a class="user-login-close">✕</a>

        <form class="panel signup-panel">
          <span>Sign up</span>
          <label for="email"><b>E-mail</b></label>
          <input type="email" placeholder="Enter email" name="email" required>

          <label for="psw"><b>Choose Password</b></label>
          <input id="signup-psw" type="password" placeholder="Enter Password" name="psw" required minlength="6">

          <label for="psw2"><b>Confirm New Password</b></label>
          <input id="signup-psw2" type="password" placeholder="Enter Password" name="psw2" required minlength="6">

          <button class="button-signup">Create account</button>
        </form>

        <form class="panel login-panel">
          <span>Log in</span>
          <label for="email"><b>E-mail</b></label>
          <input type="email" placeholder="Enter email" name="email" required>

          <label for="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="psw" required minlength="6">

          <button class="button-login">Log in</button>
          
          <span class="login-oauth">
            <span class="button button-google-login">${ICON_GOOGLE}</span>
            <span class="button button-github-login">${ICON_GITHUB}</span>
          </span>
          <hr>
          <span class="hr-text-center">or</span>
          <button type="button" class="button-switch-signup">Sign up</button>
        </form>

    </div>
  `;

  const CLASS = "UserLogin";
  const theme = getTheme(CLASS) || {};
  const buttonPlaceHolders = d3.selectAll(dom);
  if(!buttonPlaceHolders || buttonPlaceHolders.empty()) return;   
  buttonPlaceHolders.html(templateForButton);
  if(theme.style)
    Object.entries(theme.style).forEach( ([key, value]) => buttonPlaceHolders.style(key, value) );


  const formsPlaceHolder = d3.select(loginFormsDom);
  if(!formsPlaceHolder || formsPlaceHolder.empty()) return;   
  formsPlaceHolder.html(templateForForms);


  this.isUserLoginOpen = false;
  
  buttonPlaceHolders.select(".user-logged-title").on("click", () => {
    switchUserLogin.call(this);
  });

  formsPlaceHolder.select(".user-logged-logout").on("click", async () => {
    if (await userLogout()) {
      switchUserLogin.call(this);
      updateUserLogin();
    }
  });

  buttonPlaceHolders.select(".user-login-title").on("click", () => {
    formsPlaceHolder.select(".user-login-form").classed("signup", false);
    switchUserLogin.call(this);
  });

  //click exactly on greyed out area closes the menu
  formsPlaceHolder.on("click", (event) => {
    if (event.target === formsPlaceHolder.node()) switchUserLogin.call(this)
  });
  formsPlaceHolder.selectAll(".user-login-close").on("click", () => switchUserLogin.call(this));
  formsPlaceHolder.select(".button-switch-signup").on("click", (event)=> {
    event.preventDefault(); //prevent login-form from complaining
    formsPlaceHolder.select(".user-login-form").classed("signup", true);
  });

  formsPlaceHolder.select(".signup-panel").on("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (await userSignup(data.get("email"), data.get("psw"))) {
      switchUserLogin.call(this);
      updateUserLogin();
    }
  });

  formsPlaceHolder.select(".login-panel").on("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (await userLogin(data.get("email"), data.get("psw"))) {
      switchUserLogin.call(this);
      updateUserLogin();
    };
  });

  formsPlaceHolder.select("#signup-psw").on("input", (event) => {
    const data = new FormData(event.target.form);
    formsPlaceHolder.select("#signup-psw2").node()
      .setCustomValidity(data.get("psw") !== data.get("psw2") ? "Passwords should be equal" : "");
  });

  formsPlaceHolder.select("#signup-psw2").on("input", (event) => {
    const data = new FormData(event.target.form);
    event.target.setCustomValidity("");
    event.target.setCustomValidity(data.get("psw") !== data.get("psw2") ? "Passwords should be equal" : "");
  });

  if(supabaseClient) supabaseClient.auth.onAuthStateChange((event, session) => {
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

  formsPlaceHolder.select(".button-github-login").on("click", async () => {
    if(!supabaseClient) return console.error("Supabase is not configured");
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

  formsPlaceHolder.select(".button-google-login").on("click", async () => {
    if(!supabaseClient) return console.error("Supabase is not configured");
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

  formsPlaceHolder.select(".user-logged-set-config button.save").on("click", () => {
    state.dispatch.call("setPreferentialConfig");
    formsPlaceHolder.classed("open", false);
  });
  formsPlaceHolder.select(".user-logged-set-config button.restore").on("click", () => {
    state.dispatch.call("restorePreferentialConfig");
    formsPlaceHolder.classed("open", false);
  });

  function openPopup(src, title, width, height) {
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 4;
    return window.open(src, title, 'popup, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  }
  
  function switchUserLogin(force) {
    this.isUserLoginOpen = force || force === false ? force : !this.isUserLoginOpen;
    formsPlaceHolder.classed("open", this.isUserLoginOpen);
  }

  async function updateUserLogin() {
    const logged = await isLogged();
    if (logged.isLogged) {
      formsPlaceHolder.select(".user-logged-name").text(logged.session.user.email);
      buttonPlaceHolders.select(".user-logged-title").text(logged.session.user.email.split("@")[0]);
    }
    buttonPlaceHolders.classed("logged", logged.isLogged);
    formsPlaceHolder.classed("logged", logged.isLogged);
    const canSaveConfig = await isPageEditor();
    formsPlaceHolder.select(".user-logged-set-config").style("display", logged.isLogged && canSaveConfig ? null : "none");
  }

  this.isLogged = false;

  updateUserLogin();
}

export default UserLogin;