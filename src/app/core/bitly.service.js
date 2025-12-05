import { isLogged } from "../auth/supabase.service";
import { createShareLinkModal } from "../social-buttons/share-link";
import { checkSlugAvailability, getPrivateDsOwned, saveSlug } from "./links-resolve";
import { randomSlug } from "./utils";

export default async function BitlyService({ state, pageId }) {

  const bitlyUrl = "https://api-ssl.bitly.com/v4/shorten";

  return {
    async shortenUrl(url = document.URL, callback) {

      return await isLogged().then(async logged => {
        if (logged.isLogged) {
          return createShareLinkModal({
            pageId,
            slug: randomSlug(state.getTool() + "-"),
            baseUrl: location.origin + location.pathname + "?for=",
            checkSlugAvailability,
            getPrivateDsOwned,
            onSave: async({ url, slug, lifetime, privateDs }) => {
              saveSlug({ 
                pageId,
                onSave: ({url}) => callback(url), 
                url, 
                userId: logged.session.user.id, 
                slug, 
                lifetime, 
                pageConfig: state.getURLI(),
                privateDs
              });
            }
          });
        } else {
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
      });
    }
  }
}


