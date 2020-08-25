# Gapminder Tools Page

### Run locally
Environment: node v12.13.0, npm 6.12.0. Probably works with a bit higher and lower versions too, but check versions if it doesn't.  

1. `npm install`
2. `npm start`
3. Open `http://localhost:4200/tools/` in the browser. note the trailing shash

### Build
`npm run build`
concatenated but not minified JS assets, dev config for toolset and datasources

`npm run build:prod:stage`
concatenated and minified JS assets, stage config for toolset and datasources

`npm run build:prod`
concatenated and minified JS assets, prod config for toolset and datasources
