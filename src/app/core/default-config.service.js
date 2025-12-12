import { supabaseClient } from "../auth/supabase.service";
import { deepExtend } from "./utils";

export default async function PreferentialConfigService({ state, pageId, site, pageSlug, defaultConfigs }) {
  async function isPageEditor() {
    const { data: d1, error: e1 } = await supabaseClient.rpc('is_editor_or_owner_acl', { 
      s: "page",
      r: site + "/" + (pageSlug ? pageSlug : "__home__")
    });
    const { data: d2, error: e2 } = await supabaseClient.rpc('is_editor_or_owner_acl', { 
      s: "site",
      r: site
    });
    if (e1 || e2) {
      console.log("Error: ", e1 || e2);
      return false;
    };
    return Boolean(d1 || d2);
  }

  async function savePreferentialConfigToCMS({tool, newConfig}) {
    if (!supabaseClient) return false;
    const { data, error } = await supabaseClient
      .from("configs")
      .upsert({
        tool_id: tool,
        config: newConfig,
        page_id: pageId,
        type: "preferential",
        note: site + "/" + (pageSlug ? pageSlug : "__home__") + " via toolspage"
      })
      .or(`and(tool_id.eq.${tool}, page_id.eq.${pageId}, type.eq.user)`)
    if (error) {
      console.log("Error: ", error);
      return false;
    };
    return true;
  }

  return {
    isPageEditor,
    async setPreferentialConfig() {
      if (await isPageEditor()) {
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
      if (await isPageEditor()) {
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