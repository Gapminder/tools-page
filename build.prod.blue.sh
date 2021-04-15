#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home
ssh-add /home/vizabi_tools_deploy_ssh

git config --global user.email "dev@gapminder.org"
git config --global user.name "gapminderdeploy"

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b master
cd tools-page || return
npm cache clean -f
npm i json -g --depth 0 --unsafe-perm

echo && echo 🗂 $PWD && echo "👉 rm -rf node_modules/"
rm -rf node_modules/ && echo "✅ removed node_modules"

echo && echo 🗂 $PWD && echo "👉 git pull"
git pull origin master && echo "✅ git pull done"

echo && echo 🗂 $PWD && echo "👉 npm install"
npm i --quiet --depth 0 --unsafe-perm && echo "✅ npm install done"
  
echo && echo 🗂 $PWD && echo "👉 npm run build:prod"
npm run build:prod && echo "✅ Tools page build done. Blue prod is served from /home/tools-page/build/tools/"

echo && echo 🗂 $PWD && echo "👉 copy build output into a special folder for this version"
VERSION="$(json -f package.json dependencies.vizabi-reactive)"
COMMIT_ID="$(git rev-parse --verify HEAD)"
cd /home 
rm -rf "v${VERSION}" && mkdir "v${VERSION}" && cp -r tools-page/build/tools/* "v${VERSION}" \
&& echo "✅ Build output is served from /home/tools-page/build at http://tools-blue.gapminder.org:8080/tools/" \
&& echo "and copied to folder v${VERSION}. Run sh green.sh v${VERSION} to make it live."

echo && echo 🗂 $PWD && echo "👉 Rollbar source maps management"
ROLLBAR_TOKEN="eb246f4a36a34433b86b8490187aa972"
TOOLSPAGE_HOST="https://gapminder.org/tools/"
cd /home/"v${VERSION}" && sed -i -e "s/version-to-be-replaced-by-a-bash-script/${COMMIT_ID}/g" ./index.html \
&& echo "✅ replaced version in v${VERSION}/index.html"
curl https://api.rollbar.com/api/1/sourcemap -F access_token="${ROLLBAR_TOKEN}" -F version="${COMMIT_ID}" -F minified_url="${TOOLSPAGE_HOST}"toolspage.min.js -F source_map=@toolspage.min.js.map \
&& curl https://api.rollbar.com/api/1/sourcemap -F access_token="${ROLLBAR_TOKEN}" -F version="${COMMIT_ID}" -F minified_url="${TOOLSPAGE_HOST}"tools.min.js -F source_map=@tools.min.js.map \
&& curl https://api.rollbar.com/api/1/sourcemap -F access_token="${ROLLBAR_TOKEN}" -F version="${COMMIT_ID}" -F minified_url="${TOOLSPAGE_HOST}"vendor.min.js -F source_map=@vendor.min.js.map \
&& echo "" \
&& echo "✅ scheduled uploading of source maps to rollbar API"