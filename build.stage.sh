#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home || return
ssh-add /home/vizabi_tools_deploy_ssh

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b master
cd tools-page || return
npm cache clean -f

echo && echo 🗂 $PWD && echo "👉 rm -rf node_modules/"
rm -rf node_modules/ && echo "✅ removed node_modules"

echo && echo 🗂 $PWD && echo "👉 git pull"
git pull origin master && echo "✅ git pull done"

echo && echo 🗂 $PWD && echo "👉 npm install"
npm i --quiet --depth 0 --unsafe-perm && echo "✅ npm install done"
  
echo && echo 🗂 $PWD && echo "👉 npm run build:prod:stage"
npm run build:prod && echo "✅ Tools page build done"
