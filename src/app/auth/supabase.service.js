import toolsPage_properties from "toolsPage_properties";

const {S_URL, S_KEY} = toolsPage_properties;
const supabaseClient = S_KEY && S_URL ? supabase.createClient(S_URL, S_KEY) : null;

async function userSignup(email, password) {
  if(!supabaseClient) return false;
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  console.log(error, data);
  return error ? false : true;
}

async function userLogin(email, password) {
  if(!supabaseClient) return false;
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  console.log(error, data);
  return error ? false : true;
}

async function userLogout() {
  if(!supabaseClient) return false;
  const { error } = await supabaseClient.auth.signOut();
  return error ? false : true;
}

async function isLogged() {
  if(!supabaseClient) return {isLogged: false, session: null};
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