import toolsPage_properties from "toolsPage_properties";
const supabaseClient = supabase.createClient(toolsPage_properties.S_URL, toolsPage_properties.S_KEY);

export {
  supabaseClient
};