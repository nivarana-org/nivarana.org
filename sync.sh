#!/bin/bash
set -e
source ./.env
echo "Do you want to run npm install on remote?"
NPMINSTALL=$(gum choose "No" "Yes")

set -ex

git push
rsync -avz --exclude='/.git' --filter="dir-merge,- .gitignore" ./ $REMOTE:$REMOTE_DIR/
rsync -avz .env $REMOTE:$REMOTE_DIR/.env
if [ "$NPMINSTALL" == "Yes" ]; then
    ssh $REMOTE -t "rm -rf $REMOTE_DIR.tmp && cp -r $REMOTE_DIR $REMOTE_DIR.tmp && cd $REMOTE_DIR.tmp && npm install --legacy-peer-deps && npm run build && cd .. && mv nivarana.org nivarana.org.bak && mv nivarana.org.tmp nivarana.org && systemctl --user restart nivarana.org && rm -rf nivarana.org.bak"
else
    ssh $REMOTE -t "rm -rf $REMOTE_DIR.tmp && cp -r $REMOTE_DIR $REMOTE_DIR.tmp && cd $REMOTE_DIR.tmp && npm run build && cd .. && mv nivarana.org nivarana.org.bak && mv nivarana.org.tmp nivarana.org && systemctl --user restart nivarana.org && rm -rf nivarana.org.bak"
fi
