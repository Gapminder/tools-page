#!/usr/bin/env bash

# use env. vars from visual tests
declare -A env_vars
while IFS=$'\001' read -r name value; do
    env_vars[$name]=$value
done < <(curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Travis-API-Version: 3" \
  -H "Authorization: token ${TRAVIS_ACCESS_TOKEN}" \
  "https://api.travis-ci.org/repo/21799381/env_vars" | jq -r '.env_vars[] | "\(.name)\u0001\(.value)"')

for name in "${!env_vars[@]}"; do
    #echo "$name is ${env_vars[$name]}"
    if [ "$name" == "GOOGLE_PRIVATE_KEY" ]; then 
      continue; 
    else 
      export $name="${env_vars[$name]}"
    fi
done

# remove old & installed new version of nodejs
rm -rf /home/travis/.nvm/versions/node/v8.12.0/bin/node
rm -rf /usr/bin/nodejs
rm -rf /home/travis/.nvm/versions/node/v8.12.0/bin/npm
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v

# clone visual-tests repo
git clone --branch=develop https://github.com/Gapminder/visual-tests.git "Gapminder/visual-tests"
cd "Gapminder/visual-tests"
git branch
npm install
npm run smoke:tools-page