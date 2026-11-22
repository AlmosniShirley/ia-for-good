# Relais « Décodeur d'offres » (Cloudflare Worker)

Relais séparé de celui de Le Bon Angle : il garde la clé Dust secrète et appelle
l'agent « analyse de poste ». Mise en ligne depuis le tableau de bord Cloudflare
(pas besoin de Node) :

1. Cloudflare → Workers & Pages → Create → Worker → nommez-le `ia-for-good-decodeur` → Deploy.
2. Edit code : remplacez tout par le contenu de `src/index.js` → Deploy.
3. Settings → Variables and Secrets, ajoutez :
   - Texte : `DUST_BASE_URL` = `https://dust.tt`, `DUST_WORKSPACE_ID` = `LiNKoSV40F`,
     `DUST_AGENT_ID` = `V0aYuVjSL3`, `ALLOWED_ORIGINS` = `https://almosnishirley.github.io`,
     `PAYHIP_MAX_USES` = `1`
   - Secret : `DUST_API_KEY` (clé API Dust), `ACCESS_CODE` (votre code bêta)
4. Copiez l'adresse du Worker (`https://ia-for-good-decodeur.….workers.dev`) dans
   `assets/js/decodeur-config.js` → `API_URL`.

Plus tard, pour un accès via Payhip : ajoutez le secret `PAYHIP_SECRET` et
renseignez `LIEN_CODE` dans `decodeur-config.js`.

Côté Dust : l'agent doit avoir la recherche web et la lecture de pages activées
(points 1, 5, 8 et 13 de l'analyse).
