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
cd /home 
rm -rf "v${VERSION}" && mkdir "v${VERSION}" && cp -r tools-page/build/tools/* "v${VERSION}" && echo "✅ Build output copied to folder v${VERSION}. Served at http://tools-blue.gapminder.org:8080/tools/"