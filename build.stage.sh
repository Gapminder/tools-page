#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home || return
ssh-add /home/vizabi_tools_deploy_ssh

git config --global user.email "dev@gapminder.org"
git config --global user.name "gapminderdeploy"

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b main
cd tools-page || return
npm cache clean -f

echo && echo 🗂 $PWD && echo "👉 rm -rf node_modules/"
rm -rf node_modules/ && echo "✅ removed node_modules"

echo && echo 🗂 $PWD && echo "👉 git pull"
git pull origin main && echo "✅ git pull done"

echo && echo 🗂 $PWD && echo "👉 npm install"
npm i --quiet --depth 0 --unsafe-perm && echo "✅ npm install done"
  
echo && echo 🗂 $PWD && echo "👉 BASE=/ npm run build"
BASE=/ npm run build && echo "✅ Tools page build done"

echo && echo "👉 run visual testing via a github action"
gh workflow run manual-percy-toolspage.yml -f env=stage -R Gapminder/visual-tests
