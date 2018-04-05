#!/usr/bin/env bash

eval "$(ssh-agent -s)"
cd /home/root || return
ssh-add /home/root/vizabi_tools_deploy_ssh

# BUILD: Vizabi ------------------------------------------------
npm cache clean -f

if [ "$1" = "vizabi/vizabi" ] || [ -z "$1" ]; then
  git clone git@github.com:vizabi/vizabi.git -b develop
  cd vizabi || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 0 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-barrankchart" ] || [ -z "$1" ]; then
  git clone git@github.com:vizabi/vizabi-barrankchart.git -b develop
  cd vizabi-barrankchart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 0 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-bubblechart" ] || [ -z "$1" ]; then
  git clone git@github.com:vizabi/vizabi-bubblechart.git -b develop
  cd vizabi-bubblechart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 0 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-mountainchart" ] || [ -z "$1" ]; then
  git clone git@github.com:vizabi/vizabi-mountainchart.git -b develop
  cd vizabi-mountainchart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 0 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-linechart" ] || [ -z "$1" ]; then
  git clone git@github.com:vizabi/vizabi-linechart.git -b develop
  cd vizabi-linechart || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 0 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-popbyage" ] || [ -z "$1" ]; then
  git clone git@github.com:vizabi/vizabi-popbyage.git -b develop
  cd vizabi-popbyage || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 0 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

if [ "$1" = "vizabi/vizabi-bubblemap" ] || [ -z "$1" ]; then
  git clone git@github.com:vizabi/vizabi-bubblemap.git -b develop
  cd vizabi-bubblemap || return
  echo 🗂 $PWD && git pull origin develop && npm i --quiet --depth 0 --unsafe-perm && npm rebuild node-sass --unsafe-perm && npm run build && cd .. && echo 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸  && echo
fi

# BUILD: Tools Page --------------------------------------------
git clone git@github.com:Gapminder/tools-page.git -b development
cd tools-page || return
if [ -z "$1" ]; then
  echo && echo "👉 git pull && rm -rf node_modules && npm i"
  echo 🗂 $PWD && git pull origin development && rm -rf node_modules && npm i --quiet --depth 0 --unsafe-perm
  echo && echo "👉 npm i all vizabi tools from neighboring folders"
  npm i --quiet --depth 0 --unsafe-perm ../vizabi ../vizabi-barrankchart ../vizabi-bubblechart ../vizabi-mountainchart ../vizabi-linechart ../vizabi-popbyage ../vizabi-bubblemap 
else
  echo && echo "👉 git pull && npm i"
  echo 🗂 $PWD && git pull origin development && npm i --quiet --depth 0 --unsafe-perm
  echo && echo "👉 npm i only a specific vizabi part"
  npm i --quiet --depth 0 --unsafe-perm ../$(echo "$1" | sed -e "s/vizabi\///g")
fi
  
echo && echo "👉 npm run build"
npm run build && echo "✅ Tools page build done"
