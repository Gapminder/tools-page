/*
  Path adapter
  Below is a small “path adapter” to use everywhere to resolve configs, 
  JS/CSS, and assets consistently across all 3 hosting scenarios. 

  1. in the root of a website like https://site.se/ ot locally at loclahost/
  2. in a root folder, but the second folder is being used as a "slug" parameter, 
     for example https://site.se/slug/ is the same page as https://site.se/ 
     but it applies the "slug" theme and config from CMS
  3. publicly in a true folder like https://static.gapminderdev.org/awsbucket/folder/

  Features:
  Honors <base href=""> (supports subfolders and “virtual” folder slugs).
  Normalizes leading “/”, “./”, and bare “assets/”.
  Leaves absolute URLs (https:, data:, blob:) untouched.
*/


export function getBaseHref() {
  const baseEl = document.querySelector('base[href]');
  return baseEl?.href || document.baseURI;
}

export function isExternalUrl(u = "") {
  return /^(https?:|data:|blob:|mailto:|tel:)/i.test(String(u).trim());
}

function normalizeLocalPath(p = "") {
  let s = String(p).trim();
  // strip leading "./"
  if (s.startsWith("./")) s = s.slice(2);
  // strip leading "/"
  if (s.startsWith("/")) s = s.slice(1);
  return s;
}

export function resolvePublicUrl(p) {
  if (!p) return "";
  if (isExternalUrl(p)) return p;
  const clean = normalizeLocalPath(p);
  return new URL(clean, getBaseHref()).toString();
}

export function resolveAssetUrl(p) {
  if (!p) return "";
  if (isExternalUrl(p)) return p;
  let clean = normalizeLocalPath(p);
  // If caller passed a bare filename or unknown folder, default to assets/
  if (!/^(assets\/|config\/|app\/|css\/|js\/)/.test(clean)) {
    clean = `assets/${clean}`;
  }
  return new URL(clean, getBaseHref()).toString();
}

export async function loadConfigModule(path) {
  const href = resolvePublicUrl(path);
  // keep the comment even on Rollup; harmless and prevents some bundlers from trying to pre-bundle
  const mod = await import(/* @vite-ignore */ href);
  return mod.VIZABI_MODEL;
}

