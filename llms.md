# Tools Page — LLM Context Document

> Gapminder Tools Page is a static SPA that wraps the Vizabi chart framework with a CMS-driven configuration layer. It hosts interactive data visualizations (bubble charts, line charts, bar ranks, maps, etc.) on gapminder.org and white-label partner sites.

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Charts** | Vizabi framework (`@vizabi/core`, `@vizabi/shared-components`, individual chart packages) | MobX-based reactive data model, D3-rendered UI components |
| **Data model / reactivity** | MobX 5 | Used inside Vizabi; tools-page itself uses `mobx.observable`, `autorun`, `reaction`, `toJS`, `runInAction` |
| **DOM manipulation** | D3 v6 | Used as the primary DOM library (not just for SVG), see "D3 as DOM Library" section |
| **Maps** | Mapbox GL JS, Deck.gl | Loaded on-demand for map tools (`extapimap`, `combo`, `bubblechart`) |
| **Styling** | Stylus → CSS, CSS custom properties, runtime CSS injection from CMS | Compiled by `rollup-plugin-stylus-compiler` + PostCSS |
| **Bundler** | Rollup 4 (ESM output) | Tools (charts) are lazy-loaded via dynamic `import()`, vendors loaded as UMD `<script>` tags |
| **Backend / CMS** | Supabase (PostgreSQL + Auth + RPC) | All site configuration, theme, toolset, configs, permalinks, ACL |
| **URL serialization** | URLON | Compact JSON-like encoding in the URL hash |
| **Hosting** | DigitalOcean VM (nginx, static files) or Cloudflare Workers/Pages | Blue/green deployment via bash scripts; see Key Commands |
| **Telemetry** | Google Analytics (gtag.js), Rollbar (error tracking) | Conditional on hostname |
| **Package management** | npm | `package.json` with `"type": "module"` (ESM) |

## Project Structure

```
tools-page/
├── src/
│   ├── index.js                 # Entry point: registers data readers, launches App()
│   ├── index.html               # SPA shell with <script> tags for vendor UMDs
│   ├── app/
│   │   ├── app.js               # Main App() async function — bootstraps everything
│   │   ├── index.styl           # Root stylesheet importing all component styles
│   │   ├── d3extensions.js      # D3 v3→v4 compatibility shim (d3.rebind)
│   │   ├── core/                # Services and utilities
│   │   │   ├── url.js           # URL state management (URLON hash, history API)
│   │   │   ├── cms.js           # CMS data loader (Supabase RPC + JSON fallbacks)
│   │   │   ├── tool.js          # Tool lifecycle: lazy-load, instantiate, wire MobX→URL
│   │   │   ├── theme.js         # Runtime theming: CSS injection, layout DOM, fonts
│   │   │   ├── language.js      # i18n translator using Intl.DisplayNames + CMS strings
│   │   │   ├── default-config.service.js  # Preferential config save/restore (ACL-gated)
│   │   │   ├── bitly.service.js # URL shortening (Bitly fallback) + share-link modal
│   │   │   ├── location.service.js  # URL hash + embed URL helpers
│   │   │   ├── links-resolve.js # Permalink/short-link resolution via Supabase
│   │   │   ├── chart-transition.js  # State transfer between chart types (select/show/time)
│   │   │   ├── deprecated-url.js    # URL upgrader pipeline (legacy URL format support)
│   │   │   ├── embedded-bridge.js   # postMessage bridge for iframe embedding
│   │   │   ├── event-analytics.service.js  # GA timing events for chart loads
│   │   │   ├── utils.js         # deepExtend, debounce, translateNode, URLON helpers
│   │   │   ├── utilsForAssetPaths.js  # Path resolution for slugs + <base href>
│   │   │   ├── table.js         # Generic JSONB table editor (D3 data-join based)
│   │   │   ├── icons.js         # Inline SVG icon constants (ICON_GAPMINDER, etc.)
│   │   │   ├── download-utils.js    # SVG screenshot export
│   │   │   ├── timelogger.js    # Performance timer for splash/full load metrics
│   │   │   └── deprecated-url.rules/ # URL migration rules (concept renames, v1→v2, etc.)
│   │   ├── auth/                # Authentication
│   │   │   ├── supabase.service.js  # Supabase client init, login/logout/signup/delete
│   │   │   ├── user-login.js       # Login/signup UI (email+password, OAuth GitHub/Google)
│   │   │   └── user-login.styl
│   │   ├── chart-switcher/      # Tool selector dropdown + icon-bar variant
│   │   ├── language-switcher/   # Locale dropdown
│   │   ├── social-buttons/      # Share (Twitter, Facebook, mail, link, download, embed code)
│   │   ├── menu/                # Desktop nav menu + hamburger mobile menu
│   │   ├── logo/                # Configurable logo component
│   │   ├── footer/              # Footer links + partner logos
│   │   ├── howto/               # Video tutorial dialog
│   │   ├── see-also/            # Thumbnail grid of other chart types
│   │   ├── related-items/       # Related content links + video block
│   │   ├── message/             # Toast/banner message component
│   │   ├── page/                # Global page styles + RTL + vizabi overrides
│   │   └── _resources/          # Stylus variables, mixins, font definitions
│   ├── config/                  # Per-site static config fallbacks
│   │   ├── properties.json      # Build-time injected site properties (Supabase keys, site ID)
│   │   ├── gapminder/           # Gapminder-specific: toolset.json, datasources.json, chart configs
│   │   ├── boendebarometern/    # White-label site: Boendebarometern
│   │   └── boendebarometern--healthatlas/  # Sub-page config variant
│   ├── assets/                  # Static assets (fonts, images, i18n JSONs, translation JSONs)
│   ├── data/                    # Embedded CSV data (basic.csv)
│   └── shims/                   # Node builtin shims (empty.js for `fs`)
├── vizabi-tools.js              # Lazy-loader registry: dynamic import() for each chart tool + CSS/Mapbox/Deck
├── rollup.config.js             # Build config (ESM output, vendor copy, stylus, aliases)
├── dev-server.js                # Express dev server with slug rewriting + SPA fallback
├── build.prod.blue.sh           # Blue production build + deploy script
├── build.prod.green.sh          # Green swap script (make blue build live)
├── build.prod.backup.sh         # Backup current green to /home/green.bak
├── build.prod.restore.sh        # Restore green.bak
├── build.stage.sh               # Stage environment build
├── build.dev.sh                 # Dev environment build (all deps → "latest")
└── package.json
```

## Architecture & Patterns

### App Bootstrap Sequence

`index.js` → registers data readers (DDFcsv, Excel, DDFservice) into `Vizabi.stores.dataSources` → calls `App(properties)`.

`App()` in `app.js`:
1. Resolves page slug from URL path via `getPageSlug()`
2. Loads CMS data from Supabase (`cms.load()`) — toolset, configs, theme, locales, etc.
3. Resolves short-links/permalinks if `?for=slug` query param present
4. Initializes URL state service (`url.init()`) — parses URLON hash, upgrades deprecated URLs
5. Initializes translator, bitly service, preferential config service
6. Creates `Tool` instance (the chart lifecycle manager)
7. Applies theme (DOM layout injection + CSS variables + fonts)
8. Instantiates all UI view components (Logo, ChartSwitcher, Menu, Footer, etc.)
9. Wires event dispatch listeners for tool changes, language, projector mode, auth
10. Calls `tool.setTool()` to render the initial chart

### SPA Routing

The app uses **hash-based routing** with `window.history.pushState/replaceState`. The URL structure is:

```
https://domain.com/[optional-page-slug]/?[query-params]#chart-type=bubbles&url=v2&model=...&ui=...
```

- **Page slug**: Optional path segment after base (e.g., `/tools/healthatlas/`). Detected by `getPageSlug()` — if the last path segment isn't part of `<base href>`, it's treated as a slug that selects a CMS theme/config.
- **Query params**: `?for=slugname` for permalinks, `?embedded=true` for iframe mode.
- **Hash**: URLON-encoded state object containing `chart-type`, `url` (version), `model` (data config), `ui` (UI config).

URL state is managed by `url.js`:
- `init()` — parse URL, apply defaults, return state API
- `updateURL()` (debounced 310ms) — serialize current model+UI diff into hash
- `popState()` — handle browser back/forward
- `d3.dispatch` — central event bus with named events (`toolChanged`, `languageChanged`, `projectorChanged`, `authStateChange`, etc.)

**Legacy URL support**: `deprecated-url.js` applies a pipeline of upgrade rules to handle old URL formats (v1→v2, concept renames, entityset renames, legacy tools-page format, world adapter).

### View Pattern

Every UI component follows the same constructor pattern:

```js
const ComponentName = function({ dom, translator, state, data, getTheme }) {
  const template = `<div class="...">...</div>`;

  const CLASS = "ComponentName";
  const theme = getTheme(CLASS) || {};
  const placeHolders = d3.selectAll(dom);
  if (!placeHolders || placeHolders.empty()) return;
  placeHolders.html(template);

  // Apply CMS theme styles
  if (theme.style)
    Object.entries(theme.style).forEach(([key, value]) => placeHolders.style(key, value));

  // ... component logic, event listeners, data joins ...

  // Translation support
  translate();
  state.dispatch.on("translate.componentName", translate);
  function translate() {
    placeHolders.selectAll("[data-text]").each(utils.translateNode(translator));
  }
};
```

**Key conventions**:
- Constructor receives `{ dom, translator, state, data, getTheme }` — the CSS selector, i18n function, URL state service, CMS data, and theme getter.
- Template is an HTML string injected via `d3.selection.html()`.
- DOM is managed entirely via D3 selections (no framework).
- CMS theme styling is applied inline from `theme.style` object.
- Translation uses `data-text` attributes resolved by `translateNode()`.
- Events are wired via `state.dispatch.on("eventName.namespace", handler)` — D3 dispatch with namespacing.
- No virtual DOM, no reactive rendering — imperative D3 manipulation.

### D3 as DOM Library

D3 is used as a general-purpose DOM library far beyond SVG charting:

- **Selection & manipulation**: `d3.select(".too-header")`, `.html()`, `.text()`, `.classed()`, `.style()`, `.attr()`
- **Data joins**: `selectAll().data().join()` for lists (menu items, chart switcher options, footer links)
- **Event handling**: `.on("click", handler)`, `d3.dispatch()` for app-wide events
- **HTTP**: `d3.json()`, `d3.csv()` for loading config files and remote data
- **Utilities**: `d3.rollup()`, `d3.timeFormat()`
- **D3 is loaded as a UMD global** (`window.d3`) — not imported via ESM

### Data Flow

```
┌─────────────┐    ┌──────────────┐    ┌───────────┐
│  Supabase    │───>│  cms.js      │───>│  App()    │
│  (CMS data)  │    │  (load +     │    │  toolset, │
│              │    │   validate)  │    │  configs   │
└─────────────┘    └──────────────┘    └─────┬─────┘
                                             │
                                             v
┌─────────────┐    ┌──────────────┐    ┌───────────┐
│  URL hash   │<──>│  url.js      │<──>│  tool.js  │
│  (URLON)    │    │  (state mgr) │    │  (Vizabi  │
│             │    │  + dispatch  │    │  lifecycle)│
└─────────────┘    └──────────────┘    └─────┬─────┘
                                             │
                                             v
                                       ┌───────────┐     ┌──────────────┐
                                       │  Vizabi   │────>│  Data Reader │
                                       │  (MobX    │     │  (DDFcsv /   │
                                       │   model)  │     │   DDFservice)│
                                       └───────────┘     └──────┬───────┘
                                                                │
                                                                v
                                                          ┌───────────┐
                                                          │  Waffle   │
                                                          │  Server   │
                                                          │  (BW API) │
                                                          └───────────┘
```

1. **CMS data** loads at startup from Supabase via `get_known_page` RPC → returns toolset, datasources, theme, configs, locales, etc.
2. **Fallback chain**: Supabase DB → local JSON files in `src/config/` → hardcoded defaults in `properties.json`.
3. **URL state** is the single source of truth for the active tool and its configuration. Parsed from URLON hash, managed in `url.js`.
4. **Tool lifecycle** (`tool.js`): When a tool changes, it lazy-loads the chart JS, instantiates Vizabi with merged config (essential → preferential → URL state), and sets up a MobX `autorun` that diffs the model against defaults and writes meaningful changes back to the URL hash.
5. **Data readers** fetch data from the Waffle Server (small-waffle.gapminder.org) using the DDF query protocol. The reader type (`ddfbw`, `ddfcsv`, `excel`) is configured per datasource in `datasources.json`.

### Supabase Tables (inferred from code)

| Table/RPC | Purpose | Key columns |
|---|---|---|
| `get_known_page` (RPC) | Returns full page config for a site+slug | `_site`, `_slug` → returns: `id`, `toolset`, `datasources`, `theme_*`, `locales`, `menu_items`, `footer_*`, `concept_mapping`, `entityset_mapping`, `related` |
| `get_known_deepconfigs` (RPC) | Returns tool configs for a page | `_page_id` → returns array with `tool_id`, `config`, `type` ("essential"/"preferential") |
| `configs` | Tool configurations | `tool_id`, `config` (JSONB), `page_id`, `type` ("essential"/"preferential"/"user"), `note` |
| `links` | Permalinks/short links | `slug`, `page_id`, `page_config` (JSONB), `created_by`, `created_at`, `expires_at` |
| `is_editor_or_owner_acl` (RPC) | ACL check | `s` (scope: "page"/"site"), `r` (resource path) → returns boolean |
| `soft-delete-user` (Edge Function) | Account deletion | Called via `supabase.functions.invoke()` |

### ACL System

Access control is handled by the `is_editor_or_owner_acl` Supabase RPC function:

- **Scopes**: `"page"` (specific page within a site) and `"site"` (entire site)
- **Resources**: formatted as `"site/slug"` (e.g., `"gapminder/healthatlas"`) or `"site/__home__"` for root pages
- **Usage**: `PreferentialConfigService` checks editor/owner status before allowing preferential config save/restore operations
- **UI gating**: The "Save current view as preferential" and "Reset preferential view" buttons in the user login panel are only functional for page editors

### JSONB Editors (Reusable Components)

`table.js` exports a reusable D3-based component for editing tabular JSONB data:

- Renders as nested `<table>` with `<tr>` rows for each key-value pair
- Supports cell types: inline contenteditable text, checkbox toggle, dropdown select
- Emits events via `d3.dispatch`: `"edit"`, `"remove"`, `"prop_change"`
- Used for datasource configuration editing
- Pattern: `d3.select(container).call(Table(), { rowdata, propTypes })`

### Waffle Server Integration

Data is fetched from "Small Waffle" server at `small-waffle.gapminder.org`:

- **Protocol**: DDF (Data Description Format) query protocol
- **Reader**: `DDFServiceReader` (registered as `"ddfbw"` reader type in Vizabi)
- **Datasources**: Each datasource in `datasources.json` specifies `url`, `dataset`, and `branch`
- **Auth**: Data readers accept `authToken` and `permalinkToken` for access to private datasets. Tokens are propagated from the Supabase session through `tool.js` → reader config.
- **Datasets**: `fasttrack`, `sg`, `wdi`, `population`, `povcalnet`, `billy`, `country-flags`

### Embedded Mode

When loaded in an iframe (`?embedded=true`):
- `embedded-bridge.js` sets up a `postMessage` bridge with the parent window
- Parent can send `response-config` messages to set chart state
- Child sends `set-right-config` messages when URL state changes
- The wrapper element gets class `embedded-view` to hide chrome

## Key Commands

| Command | Description |
|---|---|
| `npm start` | Dev mode: rollup watch + Express dev server on port 4200 |
| `npm run dev` | Rollup watch only (NODE_ENV=development) |
| `npm run build` | Production build (requires `BASE` env var) |
| `npm run serve` | Start Express dev server only |
| `BASE=/ npm run build` | Build for root deployment (supports page slugs) |
| `BASE=/tools/ npm run build` | Build for `/tools/` subfolder (Gapminder.org production) |
| `BASE=./ npm run build` | Build for relative paths (works in any folder, no slug support) |

### Deployment Scripts (run on the DO VM)

| Script | Description |
|---|---|
| `build.prod.blue.sh` | Builds "blue" production: clones from `main`, installs, builds with `BASE=/tools/`, copies to versioned folder, uploads Rollbar source maps, triggers Percy visual tests |
| `build.prod.green.sh` | Makes a versioned blue build live: `cp -r /home/vX.Y.Z/* /home/tools-page/build/tools/` |
| `build.prod.backup.sh` | Backs up current green to `/home/green.bak/` |
| `build.prod.restore.sh` | Restores from `/home/green.bak/` |
| `build.stage.sh` | Builds stage from `main` with `BASE=/` |
| `build.dev.sh` | Builds dev from `develop` with all `@vizabi/*` deps set to `"latest"` |

### Blue/Green Deployment

- **Blue** = newly built version, served at `tools-blue.gapminder.org:8080`
- **Green** = live production at `www.gapminder.org/tools/`
- Flow: `build.prod.blue.sh` → verify on blue → `build.prod.backup.sh` (safety) → `build.prod.green.sh vX.Y.Z` (promote)
- Rollback: `build.prod.restore.sh`

## Styling

### Stylus Architecture

- **Entry**: `src/app/index.styl` imports all component stylesheets
- **Variables**: `_resources/variables.styl` defines breakpoints and CSS custom property defaults (theme tokens)
- **Mixins**: `_resources/mixins.styl` defines `css-var()` helper, `:root` defaults, responsive breakpoints
- **Components**: Each component dir has its own `.styl` file, scoped with `.too-` prefix
- **Vizabi overrides**: `page/override-vizabi.styl` injects theme variables into Vizabi's CSS scope
- **RTL support**: `page/page.rtl.styl`

### CSS Custom Properties (Theme Tokens)

Theme tokens are defined as CSS custom properties and can be overridden at runtime from CMS:

```
--color-primary, --color-grey, --color-black, --color-background,
--color-button-border, --color-button-background, --color-button-hover,
--color-logotext, --color-menutext, --color-chartswitchertext,
--color-footer-text, --color-footer-link,
--header-height-small, --header-height-large, --header-height-xlarge,
--body-min-width, ...
```

### Runtime Theme Injection (ThemeService)

`theme.js` applies CMS-driven theming at runtime:
1. **Layout**: Reads `theme_layout` and appends DOM elements into wrapper selectors (e.g., `".too-header .too-start": ["too-logo", "too-chart-switcher"]`)
2. **CSS Variables**: Reads `theme_variables` and injects `:root { --token: value; }` via `<style>` tag
3. **Custom CSS**: Reads `theme_style` and injects generic CSS rules via `<style>` tag
4. **Fonts**: Reads `theme_fonts` and generates `@font-face` declarations
5. **Meta**: Applies `theme_meta` (title, favicon, og:tags, social share image)

This enables the same codebase to serve visually distinct sites (Gapminder, Boendebarometern, etc.) via CMS-only configuration.

### Responsive Breakpoints

| Name | Range |
|---|---|
| `small` | ≤ 728px |
| `medium` | 729px – 1023px |
| `large` | ≥ 1024px |
| `xlarge` | ≥ 1366px |

## Vendor Libraries (loaded as UMD globals via script tags)

Loaded from `build/vendor/` via `<script>` tags in `index.html` (not bundled):

| File | Global | Purpose |
|---|---|---|
| `d3.js` | `d3` | D3 v6 — DOM, data, HTTP, SVG |
| `mobx.js` | `mobx` | MobX 5 — reactive state |
| `Vizabi.js` | `Vizabi` | Vizabi core — data model, stores, dataframes |
| `VizabiSharedComponents.js` | `VizabiSharedComponents` | Shared UI components (LayoutService, LocaleService, Utils) |
| `supabase.js` | `supabase` | Supabase JS client |
| `reader-ddfcsv.js` | `DDFCsvReader` | DDF CSV file reader |
| `reader-ddfservice.js` | `DDFServiceReader` | DDF Waffle Server reader |
| `reader-excel.js` | `ExcelReader` | Excel file reader |
| `urlon.js` | `urlon` | URL-safe object notation |
| `mapbox-gl.js` | `mapboxgl` | Mapbox GL (loaded on-demand for map tools) |
| `deck.js` | `deck` | Deck.gl core+layers (loaded on-demand, concatenated at build time) |

**Chart tool JS is NOT in vendor** — it's loaded via dynamic `import()` from `vizabi-tools.js`. Each chart's CSS is injected as a `<link>` tag on first use.

### Rollup externals config

These packages are mapped to globals via `rollup-plugin-external-globals` and excluded from the bundle:
```js
"@vizabi/core" → "Vizabi"
"@vizabi/shared-components" → "VizabiSharedComponents"
"@deck.gl/core" → "deck"
"@deck.gl/layers" → "deck"
"d3" → "d3"
"mobx" → "mobx"
```

## Authentication

### Supabase Auth

- **Client init**: `supabase.service.js` creates a Supabase client from `S_URL` and `S_KEY` (anon key) in `properties.json`
- **Methods**: email+password signup/login, OAuth (GitHub, Google) via popup window
- **Session management**: `supabase.auth.onAuthStateChange()` fires on login/logout/token refresh → sets auth token in URL state → propagates to data readers for private dataset access
- **Account actions**: change email, change password, soft-delete account (via Edge Function)
- **OAuth redirect**: Uses `redirectTo: location.origin + "/tools/auth/"` with popup window pattern

### Auth Token Flow

1. User logs in → Supabase returns JWT session
2. `onAuthStateChange` handler calls `state.setAuthToken({event, session})`
3. `url.js` stores token and dispatches `"authStateChange"` event
4. `tool.js` listens → calls `setVizabiUserAuth()` → pushes token to each data reader's `setAuthToken()`
5. Data readers include token in requests to waffle server for private datasets
6. Permalink tokens: separate `permalinkToken` allows shared access to private data via short links

## Important Conventions

### Naming
- CSS classes use `too-` prefix for tools-page components, `vzb-` prefix for Vizabi components
- Component constructors are PascalCase functions (not classes)
- Config IDs use lowercase with hyphens (`bubbles`, `barrank`, `linechart`)
- `site` = deployment target ID (e.g., `"gapminder"`, `"boendebarometern"`)
- `pageSlug` = optional URL path segment selecting a sub-configuration within a site

### Configuration Hierarchy (highest priority first)
1. URL hash state (user interaction → URLON)
2. Permalink state (`?for=slug` → loaded from `links` table)
3. Preferential config (editor-saved config from `configs` table, type `"preferential"`)
4. Essential config (base config from `configs` table, type `"essential"`)
5. Local fallback config (JS module in `src/config/{site}/`)
6. Vizabi component defaults in multiple layers: root component (tool), then subcompoent defaults following the tree 

### Multi-Site Support
The same codebase serves multiple sites via:
- `properties.json` — build-time injected via Rollup alias (`toolsPage_properties`) — contains `site`, `S_URL`, `S_KEY`, and inline fallback theme/config
- `src/config/{site}/` — per-site fallback config files (toolset.json, datasources.json, chart configs)
- `src/config/{site}--{slug}/` — page-slug-specific config overrides
- CMS (Supabase) — runtime config taking precedence over local files

### `<base href>` and Asset Resolution
- The `<base href>` tag in `index.html` is set at build time by the `BASE` env variable
- All asset URLs must go through `resolveAssetUrl()` or `resolvePublicUrl()` from `utilsForAssetPaths.js`
- These functions honor `<base href>` and correctly resolve paths whether deployed at root, in a subfolder, or with a virtual page slug

### Event System
`d3.dispatch` is used as the central event bus. Events use namespacing (`"eventName.listenerId"`):

| Event | Payload | Triggered when |
|---|---|---|
| `toolChanged` | `{ id, previousToolId }` | Chart type switches |
| `toolStateChangeFromPage` | `{ model, ui }` | Browser back/forward triggers state update |
| `toolReset` | — | Tool reset to defaults |
| `languageChanged` | locale id | Locale changes |
| `projectorChanged` | boolean | Projector mode toggles |
| `authStateChange` | event | Login/logout/token refresh |
| `showMessage` | `{ message, timeout }` | Display toast |
| `translate` | locale id | Re-translate all components |
| `menuOpen` / `menuClose` | — | Mobile menu state |
| `setPreferentialConfig` | — | Editor saves current view |
| `restorePreferentialConfig` | — | Editor resets to essential |

### Known Gotchas
- **Vendor exports**: Some `@vizabi/*` packages have `exports` fields that block deep path resolution via `require.resolve()`. Use `path.resolve(__dirname, "node_modules/...")` as workaround in rollup config.
- **URLON hash encoding**: `#` symbols in color codes must be encoded as `%23` in URLON strings. The app handles this in `encodeUrlHash()`/`decodeUrlHash()`.
- **D3 is not imported**: D3, MobX, Vizabi, etc. are UMD globals. Don't add `import d3 from "d3"` — use `d3` directly.
- **No framework**: This is vanilla JS with D3. No React, Vue, Svelte, or similar.
- **MobX version**: MobX 5 (not 6+). API differences: no `makeObservable`, uses decorators-free `observable()`, `autorun()`, `reaction()`.
- **Page slug detection**: Based on URL path analysis against `<base href>`. Adding new slugs doesn't require code changes — just CMS config.
