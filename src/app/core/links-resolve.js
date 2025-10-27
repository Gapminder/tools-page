import { supabaseClient } from "../auth/supabase.service";
import { computeExpiryDate, hashSHA2, randomToken, fetchJSON } from "./utils";

export async function getLinkSlugAndHash(url) {
  const params = new URLSearchParams(url);
  const slug = params.get("for");
  const token = params.get("t");
  const hash = token ? (await hashSHA2(token)) : null;
  return {slug, hash};
}

export async function getLinkData(slug) {
  const { data, error } = await supabaseClient
    .from('links')
    .select('page_config')
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

export async function saveSlug({onSave, url, userId, slug, lifetime, pageConfig, privateDs}) {
  const token = privateDs.length ? randomToken() : "";
  const urlWithToken = url + (privateDs.length ? `&t=${token}` : "");

  const { data: linksUpsertData, error } = await supabaseClient
    .from('links')
    .upsert([
      { 
        slug: slug,
        created_by: userId,
        created_at: new Date().toISOString(),
        expires_at: computeExpiryDate(lifetime),
        page_config: pageConfig,
        note: privateDs.length ? privateDs.map(ds => ds.slug).join(",") : null,
        url, //don't send the unhashed token to DB, keep only for the user
      }
    ])
    .select();
  if (error) {
    console.error("Error saving the link:", error);
    alert("Error saving the link. Please try again.");
  } else {
    if (privateDs.length) {
      const hashedToken = await hashSHA2(token);
      const { data, error } = await supabaseClient
        .from('acl_links')
        .insert(privateDs.map(ds => ({
          link_id: linksUpsertData[0].id,
          scope: "dataset",
          resource: ds.slug,
          token_hash: hashedToken
        })));
      if (error) {
        console.error("Error saving the link:", error);
        alert("Error saving the acl for private datasets. Please try again.");
        return;
      } else {
        syncAclForDatasets(privateDs, 2000);
      }
    }
    onSave({ url: urlWithToken } );
  }
}

function syncAclForDatasets(privateDs, defer) {
  setTimeout(() => {  
    const serverUrlsWithoutApiVersion = new Set(privateDs.map(ds => {
    const url = new URL(ds.serverUrl);
    return url.protocol + '//' + url.host + "/";
    }));
    Promise.all(Array.from(serverUrlsWithoutApiVersion).map(serverUrl => 
      fetchJSON(
        `${serverUrl}synconly/acl/`, 
        {headers: {Authorization: `Bearer ${supabaseClient.changedAccessToken}`, Accept: "application/json"}} 
      )
    )).then(results => console.info("Synced ACLs on servers:", results));
  }, defer);
}

function getDsDatasets() {
  return Object.values(viz.model.dataSources)
    .filter(ds=>ds.config.modelType === "ddfbw")
    .map(ds => ({ serverUrl: ds.config.service, slug: ds.config.dataset.split("/")[0] }));
}

async function callRpcIsOwnerAcl(dsArray) {
  return Promise.all(dsArray.map(ds => supabaseClient.rpc('is_owner_acl', { 
    s: "dataset",
    r: ds.slug
  }).then(({ data, error }) => ({...ds, isOwner: data}))));
}

export async function getPrivateDsOwned() {
  return  (await callRpcIsOwnerAcl(getDsDatasets())).filter(({isOwner}) => isOwner);
}
