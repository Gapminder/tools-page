import toolsPage_properties from "toolsPage_properties";

const {S_URL, S_KEY} = toolsPage_properties;
const supabaseClient = S_KEY && S_URL ? supabase.createClient(S_URL, S_KEY) : null;

async function userSignup(email, password) {
  if(!supabaseClient) return { error: { message: "Supabase not configured" } };
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  console.log(error, data);
  return { data, error };
}

async function userLogin(email, password) {
  if(!supabaseClient) return { success: false, error: { message: "Supabase not configured" } };
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  console.log(error, data);
  return { success: !error, error };
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
    isLogged: !!data.session,
    session: data.session
  };
}
  
async function changeEmail(newEmail) {
  if(!supabaseClient) return { error: { message: "Supabase not configured" } };
  try {
    const { data, error } = await supabaseClient.auth.updateUser({ email: newEmail });
    console.log("changeEmail", error, data);
    return { data, error };
  } catch (e) {
    return { error: e };
  }
}

async function changePassword(newPassword) {
  if(!supabaseClient) return { error: { message: "Supabase not configured" } };
  try {
    const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword });
    console.log("changePassword", error, data);
    return { data, error };
  } catch (e) {
    return { error: e };
  }
}

async function deleteAccount() {
  try {
    const { data, error } = await supabaseClient.functions.invoke("soft-delete-user");
    return { data, error };
  } catch (e) {
    return { error: e };
  }
}

export {
  supabaseClient,
  userLogin,
  userLogout,
  userSignup,
  isLogged,
  changeEmail,
  changePassword,
  deleteAccount
};