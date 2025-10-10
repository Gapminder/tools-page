import toolsPage_properties from "toolsPage_properties";
const supabaseClient = supabase.createClient(toolsPage_properties.S_URL, toolsPage_properties.S_KEY);

async function userSignup(email, password) {
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  console.log(error, data);
  return error ? false : true;
}

async function userLogin(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  console.log(error, data);
  return error ? false : true;
}

async function userLogout() {
  const { error } = await supabaseClient.auth.signOut();
  return error ? false : true;
}

async function isLogged() {
  const { data, error } = await supabaseClient.auth.getSession();
  return { 
    isLogged: data.session && true,
    session: data.session
  };
}
  


export {
  supabaseClient,
  userLogin,
  userLogout,
  userSignup,
  isLogged
};