import { supabaseClient, isLogged } from "../auth/supabase.service";
import { createShareLinkModal } from "../social-buttons/share-link";
import { checkSlugAvailability, getPrivateDsOwned, saveSlug } from "./links-resolve";
import { randomSlug } from "./utils";

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

export default async function PermalinkService({ state, pageId }) {

  return {
    async shortenUrl(url = document.URL, callback) {

      // If supabase is available, all users (logged in or not) get the permalink modal
      if (supabaseClient) {
        const logged = await isLogged();
        return createShareLinkModal({
          pageId,
          isLoggedIn: logged.isLogged,
          slug: randomSlug(state.getTool() + "-"),
          baseUrl: location.origin + location.pathname + "?for=",
          checkSlugAvailability,
          getPrivateDsOwned: logged.isLogged ? getPrivateDsOwned : async () => [],
          onSave: async({ url, slug, lifetime, privateDs }) => {
            saveSlug({ 
              pageId,
              onSave: async ({url}) => {
                await copyToClipboard(url);
                callback(url);
              }, 
              url, 
              userId: logged.isLogged ? logged.session.user.id : null, 
              slug, 
              lifetime, 
              pageConfig: state.getURLI(),
              privateDs
            });
          }
        });
      }

      // Fallback: no supabase — copy raw URL to clipboard
      const rawUrl = url || document.URL;
      await copyToClipboard(rawUrl);
      callback(rawUrl);
    }
  }
}


