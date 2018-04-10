#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home/root || return
ssh-add /home/root/vizabi_tools_deploy_ssh

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b development
cd tools-page || return
npm cache clean -f
npm i npm-check-updates -g --quiet --depth 0 --unsafe-perm

if [ -z "$1" ]; then
  echo && echo 🗂 $PWD && echo "👉 rm -rf node_modules/"
  rm -rf node_modules/
fi
  
echo && echo 🗂 $PWD && echo "👉 git pull, ncu all vizabi tools and readers, npm i"
git pull origin development 
npm run ncu-vizabi
npm i --quiet --depth 0 --unsafe-perm
  
echo && echo 🗂 $PWD && echo "👉 npm run build"
npm run build && echo "✅ Tools page build done"
git reset --hard origin/development
