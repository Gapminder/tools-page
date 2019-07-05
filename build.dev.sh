#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home/root || return
ssh-add /home/root/vizabi_tools_deploy_ssh

git config --global user.email "dev@gapminder.org"
git config --global user.name "gapminderdeploy"

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b development
cd tools-page || return
npm cache clean -f
npm i json -g --depth 0 --unsafe-perm

if [ -z "$1" ]; then
  echo && echo 🗂 $PWD && echo "👉 rm -rf node_modules/"
  rm -rf node_modules/
fi

echo && echo 🗂 $PWD && echo "👉 git pull, set versions of all vizabi tools and readers to 'latest', npm i"
git pull origin development 
# npm view vizabi versions | sed "s/'/\"/g" | json -- -1
json -I -f package.json -e 'this.dependencies["vizabi"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-bubblechart"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-bubblemap"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-linechart"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-mountainchart"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-popbyage"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-barrankchart"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-spreadsheet"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-config-systema_globalis"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-ddfcsv-reader"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-csv-reader"]="latest"'
json -I -f package.json -e 'this.dependencies["vizabi-ws-reader"]="latest"'
npm i --quiet --depth 0 --unsafe-perm
  
echo && echo 🗂 $PWD && echo "👉 npm run build"
npm run build && echo "✅ Tools page build done"
git reset --hard origin/development
