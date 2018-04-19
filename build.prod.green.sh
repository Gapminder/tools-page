#!/usr/bin/env bash

cd /home

if [ ! -d ./$1 ]
  then
    echo "🚧 Version $1 was not found. Doing nothing."
  else
    now=$(date +%Y%m%d-%H%M%S)
    tar cvfz "backup-${now}.tar.gz" live/ && echo "✅ The current version is archived in backup-${now}.tar.gz"
    rm -rf live/ && echo "✅ The current version is deleted"
    mkdir live
    cp -r $1/* live/ && echo "✅ Green prod $1 is now served from live/"
fi