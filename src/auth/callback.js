import { supabaseClient } from "../app/auth/supabase.service.js";

async function completeSignIn() {
  if (!supabaseClient) throw new Error("Supabase is not configured.");
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error("No session was returned. Please try signing in again.");
  document.getElementById("status").textContent = "Signed in. You can close this window.";
  if (window.opener && !window.opener.closed) window.close();
}

completeSignIn().catch(error => {
  document.getElementById("status").textContent = error.message;
});
