#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home/root || return
ssh-add /home/root/vizabi_tools_deploy_ssh

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b development
cd tools-page || return

if [ -z "$1" ]; then
  echo && echo 🗂 $PWD && echo "👉 git pull && rm -rf node_modules/ && npm i"
  git pull origin development && rm -rf node_modules/ && npm i --quiet --depth 0 --unsafe-perm
  echo && echo "👉 npm i all vizabi tools from latest versions"
  npm i --quiet --depth 0 --unsafe-perm -S vizabi@latest vizabi-barrankchart@latest vizabi-bubblechart@latest vizabi-mountainchart@latest vizabi-linechart@latest vizabi-popbyage@latest vizabi-bubblemap@latest 
else
  echo && echo 🗂 $PWD && echo "👉 git pull && npm i"
  git pull origin development && npm i --quiet --depth 0 --unsafe-perm
  echo && echo "👉 npm i only a specific vizabi part"
  npm i --quiet --depth 0 --unsafe-perm -S $(echo "$1" | sed -e "s/vizabi\///g")@latest
fi
  
echo && echo "👉 npm run build"
npm run build && echo "✅ Tools page build done"
git reset --hard origin/development
