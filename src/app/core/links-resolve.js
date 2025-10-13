import { supabaseClient } from "../auth/supabase.service";
import { computeExpiryDate } from "./utils";

export function getLinkSlug(url) {
  return new URLSearchParams(url).get("for");
}

export async function getLinkData(slug) {
  const { data, error } = await supabaseClient
    .from('links')
    .select('page_config, href')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching permanent link:", error);
    return null;
  }

  return data;
}

export async function checkSlugAvailability(slug) {
  const { data, error } = await supabaseClient
    .from('links')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

    if (error) {
      console.error("Error checking slug availability:", error);
      return false;
    };

  return !data;
}

export async function saveSlug({onSave, url, userId, slug, lifetime, pageConfig, href = location.href}) {
  const { data, error } = await supabaseClient
    .from('links')
    .insert([
      { 
        slug: slug,
        created_by: userId,
        created_at: new Date().toISOString(),
        expires_at: computeExpiryDate(lifetime),
        page_config: pageConfig,
        href,
        url
      }
    ]);
  if (error) {
    console.error("Error saving the link:", error);
    alert("Error saving the link. Please try again.");
  } else {
    console.log("Link saved:", data);
    onSave({ url });
  }
}

