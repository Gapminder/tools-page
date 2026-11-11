# Vizabi Pages

Tools-page is a static website that loads configuration and renders interactive Vizabi charts. See [Gapminder Tools](https://gapminder.org/tools/) for a live example.

## Run locally

From this repository, with Node.js and npm installed:

```sh
npm install
npm start
```

Open <http://localhost:4200/>. This runs a development build in watch mode and serves the output over HTTP. The development base defaults to `/`. Choose one of the configuration modes below before starting, or leave the bundled defaults in place to try the existing setup.

## Run standalone with local configuration files

Set these overrides in [src/runtime-config.js](src/runtime-config.js) to use the bundled Gapminder example without connecting to Supabase:

```js
window.VIZABI_CONFIG = {
  site: "gapminder",
  S_URL: "",
  S_KEY: ""
};
```

For your own site, set `site` to its identifier and provide either:

- Individual files under `src/config/SITE/`. Use [src/config/gapminder/](src/config/gapminder/) as an example: `toolset.json` selects charts, `datasources.json` points to the data, and the chart-specific JavaScript files set chart defaults. Shared defaults such as theme and locales come from [src/properties.json](src/properties.json). Put a variant's files in `src/config/SITE--SLUG/`.
- A published configuration snapshot at `src/config/SITE/fallback.json` for home or `src/config/SITE--SLUG/fallback.json` for a variant. See the [snapshot export instructions](https://github.com/vizabi/deploy#installation-specific-local-fallback). A snapshot must match the selected site and slug.

Run `npm start` to preview, or [build and publish the static files](#build-and-host-the-standalone-site). Local configuration can still point to external data and assets. Supabase sign-in is unavailable when its connection is disabled.

## Run standalone with an external Supabase

Set the browser-facing connection settings in [src/runtime-config.js](src/runtime-config.js):

```js
window.VIZABI_CONFIG = {
  S_URL: "https://YOUR_PROJECT.supabase.co",
  S_KEY: "YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY",
  site: "YOUR_CMS_SITE",
  verkstad_url: "https://verkstad.example.com/"
};
```

Use a project with the tools-page CMS schema and functions, and a published home page for the chosen site. Datasource definitions in the CMS determine which data endpoints the browser uses, including any external Waffle servers. The runtime config is publicly served; use only an anon or publishable key.

Run `npm start` to preview, or build and deploy as below. You can also edit the deployed `runtime-config.js` beside `index.html` without rebuilding. For OAuth on the hosted site, allowlist the actual callback URL in Supabase Auth, for example `https://example.com/tools/auth/`. The default callback path `auth/` resolves against the site's base; `auth_redirect_path` overrides it.

When the initial CMS lookup fails or times out after two seconds, tools-page tries the matching local snapshot, then the individual local files. The default snapshot directory is `config/` relative to the site's base; set `fallback_path` to use a different directory. A home snapshot does not stand in for a missing variant.

## Build and host the standalone site

```sh
npm install
BASE=/ npm run build
```

Serve the **contents** of `build/` over HTTP from the location matching `BASE`. To preview a root build locally, run `npm run serve` and open <http://localhost:4200/>.

| Build setting | Mount point | Example variant URL |
| --- | --- | --- |
| `BASE=/` | Domain root | `https://example.com/healthatlas` |
| `BASE=/tools/` | Known subpath | `https://example.com/tools/healthatlas` |
| `BASE=./` | Relative to the page location | Virtual variants are not supported |

The first segment after an absolute base selects the CMS slug. The HTML base keeps asset and config URLs anchored to the mount point even when you open a variant directly. The web server must serve existing files normally and internally serve the site's `index.html` for variant URLs, preserving the browser URL.

For nginx at the domain root, with the contents of `build/` copied into `/app/client/live`:

```nginx
root /app/client/live;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}
```

For a subpath such as `/tools/`, map that prefix to the published files and make the fallback the site's `/tools/index.html`.

## Run in Docker with Verkstad

Follow the [Docker setup in vizabi/deploy](https://github.com/vizabi/deploy#local-setup) for the Compose files, build and startup commands, and per-installation settings. The package runs tools-page and Verkstad as separate services and connects them to an external Supabase and the data servers configured in its CMS. It sets the base path and variant routing at container startup, and can mount per-installation fallback snapshots.

## How deployment configuration works

- [Runtime settings](src/properties.js) overlay bundled defaults before the app connects to Supabase. This lets a deployment select its backend and site without rebuilding.
- The [CMS loader](src/app/core/cms.js) keeps the existing local JSON and JavaScript configuration path and adds support for published snapshots.
- [Asset path helpers](src/app/core/utilsForAssetPaths.js) resolve paths against the site's base and identify the first segment after it as the variant.
- The [OAuth callback](src/auth/index.html) is included in the build, uses the same Supabase settings as the app, and resolves under the configured base by default. Admin links use the configured Verkstad URL.
