#!/usr/bin/env bash

cd /home

if [ ! -f ./backup-$1.tar.gz ]
  then
    echo "🚧 Backup was not found under name backup-$1.tar.gz - doing nothing"
  else
    rm -rf live/ && echo "✅ The current version is deleted" 
    tar xvf backup-$1.tar.gz && echo "✅ Green prod restored from backup-$1.tar.gz and is now served from live/"
fi