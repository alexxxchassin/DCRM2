#!/bin/bash
sudo su dcrm <<'EOF'
cd /home/dcrm/DCRM2
git fetch
git rebase origin/master
EOF

sudo apachectl -k restart
