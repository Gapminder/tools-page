#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home/root || return
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
npm cache clean -f

if [ "$1" = "vizabi/vizabi" ] || [ -z "$1" ]; then
  cd vizabi || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 1 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-barrankchart" ] || [ -z "$1" ]; then
  cd vizabi-barrankchart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 1 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-bubblechart" ] || [ -z "$1" ]; then
  cd vizabi-bubblechart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 1 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-mountainchart" ] || [ -z "$1" ]; then
  cd vizabi-mountainchart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 1 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-linechart" ] || [ -z "$1" ]; then
  cd vizabi-linechart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 1 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-popbyage" ] || [ -z "$1" ]; then
  cd vizabi-popbyage || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 1 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-bubblemap" ] || [ -z "$1" ]; then
  cd vizabi-bubblemap || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 1 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi


# BUILD: Tools Page --------------------------------------------
cd tools-page || return
if [ -z "$1" ]; then
  echo 🗂 $PWD && git pull origin development && rm -rf node_modules && npm i --quiet --depth 1 --unsafe-perm && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
  npm i --unsafe-perm ../vizabi ../vizabi-barrankchart ../vizabi-bubblechart ../vizabi-mountainchart ../vizabi-linechart ../vizabi-popbyage ../vizabi-bubblemap 
else
  npm i --unsafe-perm ../"$1"
fi
npm rebuild --quiet --depth 1
  
npm run build
