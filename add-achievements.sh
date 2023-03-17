#!/bin/bash

HOST=http://localhost:3000

PATHNAME=achievements

ACHIEVEMENTS=(
    '{"achievementName":"rookie","description":"Play your first match","photoUrl":"https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/open-sourcerer-default.png"}'
    '{"achievementName":"hardcore","description":"Win 2 matches in a row","photoUrl":"https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/quickdraw-default.png"}'
    '{"achievementName":"superior","description":"Win 2 lower rank players","photoUrl":"https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/starstruck-default.png"}'
    '{"achievementName":"giant killer","description":"Win 2 higher rank players","photoUrl":"https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/galaxy-brain-default.png"}'
)
IFS=$'\n' #Internal Field Separator (IFS) drops space and sets newline as element delimiter in array.

for ach in ${ACHIEVEMENTS[@]}
do
    curl -s $HOST/$PATHNAME \
            -H "Content-Type: application/json" \
            -d $ach
done
