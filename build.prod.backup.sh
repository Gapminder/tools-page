#!/usr/bin/env bash

cd /home

tar cvfz "backup-$1.tar.gz" live/ && echo "✅ The current version is archived in backup-$1.tar.gz"