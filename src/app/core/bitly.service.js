import { supabaseClient, isLogged } from "../auth/supabase.service";
import { createShareLinkModal } from "../social-buttons/share-link";
import { checkSlugAvailability, getPrivateDsOwned, saveSlug } from "./links-resolve";
import { randomSlug } from "./utils";

export default async function BitlyService({ state, pageId }) {

  const bitlyUrl = "https://api-ssl.bitly.com/v4/shorten";

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
          onSave: async({ url, slug, lifetime, privateDs, copyToClipboard }) => {
            saveSlug({ 
              pageId,
              onSave: async ({url}) => {
                if (copyToClipboard) await copyToClipboard(url);
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

      // Fallback: no supabase — use Bitly
      return d3.json(bitlyUrl, {
        method: "POST",
        body: JSON.stringify({
          long_url: url
        }),
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer da63d03dbdcd9d18de75a7a1340dc0aaf3fa3c7f"
        }
      })
        .then(response => {
          callback(response.link);
        })
        .catch(error => {
          console.error(error);
          callback(window.location);
        });
    }
  }
}


