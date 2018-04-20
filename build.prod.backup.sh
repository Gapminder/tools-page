#!/usr/bin/env bash

cd /home

if [ -z "$1" ]; then
  now=$(date +%Y%m%d-%H%M%S)
  tar cvfz "backup-${now}.tar.gz" live/ && echo "✅ The current version is archived in backup-${now}.tar.gz"  
else
  tar cvfz "backup-$1.tar.gz" live/ && echo "✅ The current version is archived in backup-$1.tar.gz"
fi