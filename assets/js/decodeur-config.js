/* =====================================================================
   DÉCODEUR D'OFFRES — réglages (fichier public : aucun secret ici !)
   ===================================================================== */
window.DECODEUR = {
  // Adresse du relais Cloudflare (ex. "https://ia-for-good-decodeur.xxx.workers.dev").
  // Vide = la page affiche « Le Décodeur ouvre très bientôt ».
  API_URL: "",

  // true = un code d'accès est demandé (code personnel, puis code Payhip).
  CODE_REQUIS: true,

  // Lien pour obtenir un code (page Payhip). Vide = on invite à écrire.
  LIEN_CODE: "",
  CONTACT: "mailto:shirley.chiche@buildrh.co?subject=D%C3%A9codeur%20d'offres%20%E2%80%94%20code%20d'acc%C3%A8s",

  MAX_CARACTERES: 60000,     // doit rester cohérent avec le relais
  ATTENTE_MAX_MINUTES: 10,   // recherches web + 16 points : prévoir large
};
