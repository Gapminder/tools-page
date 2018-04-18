#!/usr/bin/env bash

cd /home

if [ ! -d ./v$1 ]
  then
    echo "🚧 Version v$1 was not found. Doing nothing."
  else
    now=$(date +%Y%m%d-%H%M%S)
    tar cvfz "backup-${now}.tar.gz" live/ && echo "✅ The current version is archived in backup-${now}.tar.gz"
    rm -rf live/ && echo "✅ The current version is deleted"
    mkdir live
    cp -r v$1/* live/ && echo "✅ Green prod v$1 is now served from live/"
fi