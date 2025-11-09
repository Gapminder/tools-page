import { supabaseClient } from "../auth/supabase.service";
import { deepExtend } from "./utils";

export default async function DefaultConfigService({ state, pageId, site, pageSlug, defaultConfigs }) {
  async function IsPageOwner(site, pageSlug) {
    const { data, error } = await supabaseClient.rpc('is_owner_acl', { 
      s: "page",
      r: pageSlug ? site + "/" + pageSlug : site
    });
    if (error) {
      console.log("Error: ", error);
      return false;
    };
    return data;
  }

  async function updateDefaultConfig({tool, newConfig}) {
    const { data, error } = await supabaseClient
      .from("configs")
      .upsert({
        tool_id: tool,
        config: newConfig,
        page_id: pageId,
        type: "user"
      })
      .or(`and(tool_id.eq.${tool}, page_id.eq.${pageId}, type.eq.user)`)
    if (error) {
      console.log("Error: ", error);
      return false;
    };
    return true;
  }

  return {
    async setDefaultConfig() {
      if (await IsPageOwner(site, pageSlug)) {
        const tool = state.getTool();
        const defaultConfig = defaultConfigs.get(tool);
        const { model, ui } = state.getURLI();
        const newConfig = deepExtend({}, defaultConfig, { model, ui });
        if (await updateDefaultConfig({ tool, newConfig })) {
          defaultConfigs.set(tool, newConfig);
          state.setTool();
        }
      }
    }
  }
}