#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:prepublish

# navigate into the build output directory
cd docs/.vuepress/dist


git init
git add -A
git commit -m 'deploy'


# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/wdc-molfar/amqp-client master:gh-pages

cd -