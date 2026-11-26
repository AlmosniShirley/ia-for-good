#!/bin/bash
# Crée un code unique (usage unique) pour une personne accompagnée.
# Usage :  ./nouveau-code.sh "Prénom Nom"
# Lister les codes :  ./nouveau-code.sh --liste
set -e
cd "$(dirname "$0")"

if [ "$1" = "--liste" ]; then
  for k in $(npx wrangler kv key list --binding QUESTIONNAIRE --remote --prefix "code:" 2>/dev/null | grep -o '"code:[^"]*"' | tr -d '"'); do
    echo "${k#code:}  $(npx wrangler kv key get "$k" --binding QUESTIONNAIRE --remote 2>/dev/null)"
  done
  exit 0
fi

NOM="$1"
if [ -z "$NOM" ]; then echo 'Usage : ./nouveau-code.sh "Prénom Nom"'; exit 1; fi

# Code lisible : Q-XXXX-XXXX (sans 0/O/1/I pour éviter les confusions)
ALPHA="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
gen() { local s=""; for _ in 1 2 3 4; do s="$s${ALPHA:$((RANDOM % ${#ALPHA})):1}"; done; echo "$s"; }
CODE="Q-$(gen)-$(gen)"

NOM_JSON=$(printf '%s' "$NOM" | sed 's/\\/\\\\/g; s/"/\\"/g')
npx wrangler kv key put "code:$CODE" "{\"nom\":\"$NOM_JSON\",\"cree\":\"$(date +%Y-%m-%d)\"}" --binding QUESTIONNAIRE --remote >/dev/null

echo ""
echo "Code créé pour $NOM : $CODE"
echo "Lien à envoyer : https://almosnishirley.github.io/le-bon-angle/questionnaire.html?code=$CODE"
