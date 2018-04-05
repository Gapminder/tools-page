#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home/root
ssh-add /home/root/vizabi_tools_deploy_ssh

# CLONE: Vizabi, Tools Page ------------------------------------

git clone git@github.com:vizabi/vizabi.git -b develop
git clone git@github.com:vizabi/vizabi-barrankchart.git -b develop
git clone git@github.com:vizabi/vizabi-bubblechart.git -b develop
git clone git@github.com:vizabi/vizabi-mountainchart.git -b develop
git clone git@github.com:vizabi/vizabi-linechart.git -b develop
git clone git@github.com:vizabi/vizabi-popbyage.git -b develop
git clone git@github.com:vizabi/vizabi-bubblemap.git -b develop

git clone git@github.com:Gapminder/tools-page.git -b development

# BUILD: Vizabi ------------------------------------------------
cd vizabi
yes '' | sed 5q && echo $PWD && git pull origin develop && npm i --quiet --unsafe-perm && npm run build && cd ..
cd vizabi-barrankchart
yes '' | sed 5q && echo $PWD && git pull origin develop && npm i --quiet --unsafe-perm && npm run build && cd ..
cd vizabi-bubblechart
yes '' | sed 5q && echo $PWD && git pull origin develop && npm i --quiet --unsafe-perm && npm run build && cd ..
cd vizabi-mountainchart
yes '' | sed 5q && echo $PWD && git pull origin develop && npm i --quiet --unsafe-perm && npm run build && cd ..
cd vizabi-linechart
yes '' | sed 5q && echo $PWD && git pull origin develop && npm i --quiet --unsafe-perm && npm run build && cd ..
cd vizabi-popbyage
yes '' | sed 5q && echo $PWD && git pull origin develop && npm i --quiet --unsafe-perm && npm run build && cd ..
cd vizabi-bubblemap
yes '' | sed 5q && echo $PWD && git pull origin develop && npm i --quiet --unsafe-perm && npm run build && cd ..

# BUILD: Tools Page --------------------------------------------
cd tools-page
yes '' | sed 5q && echo $PWD && git pull origin development && rm -rf node_modules && npm i --quiet --unsafe-perm
npm i --unsafe-perm ../vizabi ../vizabi-barrankchart ../vizabi-bubblechart ../vizabi-mountainchart ../vizabi-linechart ../vizabi-popbyage ../vizabi-bubblemap 
npm rebuild

npm run build
