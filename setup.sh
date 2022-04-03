#!/bin/bash

cp -n infra/config/git-ignored/config.json infra/config
cp -n infra/config/git-ignored/databases.json infra/config

source ~/.nvm/nvm.sh
nvm use v12.15.0
npm install

sequelize db:migrate --env=main
