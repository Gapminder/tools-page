import { supabaseClient } from "../auth/supabase.service";
import { deepExtend } from "./utils";

export default async function PreferentialConfigService({ state, pageId, site, pageSlug, defaultConfigs }) {
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

  async function savePreferentialConfigToCMS({tool, newConfig}) {
    const { data, error } = await supabaseClient
      .from("configs")
      .upsert({
        tool_id: tool,
        config: newConfig,
        page_id: pageId,
        type: "preferential"
      })
      .or(`and(tool_id.eq.${tool}, page_id.eq.${pageId}, type.eq.user)`)
    if (error) {
      console.log("Error: ", error);
      return false;
    };
    return true;
  }

  return {
    async setPreferentialConfig() {
      if (await IsPageOwner(site, pageSlug)) {
        const tool = state.getTool();
        const essentialFromCMS = defaultConfigs.essential.get(tool) || {};
        const { model, ui } = state.getURLI();
        const newConfig = deepExtend({}, essentialFromCMS, { model, ui });
        if (await savePreferentialConfigToCMS({ tool, newConfig })) {
          defaultConfigs.preferential.set(tool, newConfig);
          state.setTool();
        }
      }
    },
    async restorePreferentialConfig() {
      if (await IsPageOwner(site, pageSlug)) {
        const tool = state.getTool();
        const newConfig = defaultConfigs.essential.get(tool) || {};
        if (await savePreferentialConfigToCMS({ tool, newConfig })) {
          defaultConfigs.preferential.set(tool, newConfig);
          state.setTool();
        }
      }
    }
  }
}