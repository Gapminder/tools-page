#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home/root || return
ssh-add /home/root/vizabi_tools_deploy_ssh

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b master
cd tools-page || return
npm cache clean -f

echo && echo 🗂 $PWD && echo "👉 git pull && rm -rf node_modules && npm i"
git pull origin master && rm -rf node_modules && npm i --quiet --depth 0 --unsafe-perm
  
echo && echo "👉 npm run build:prod"
npm run build:prod && echo "✅ Tools page build done"
