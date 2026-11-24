/* =====================================================================
   COACH D'ENTRETIEN ANNUEL — réglages (fichier public : aucun secret ici !)
   ===================================================================== */
window.COACH = {
  // Adresse du relais Cloudflare. Vide = la page affiche « ouvre très bientôt ».
  API_URL: "https://ia-for-good-coach-entretien.shirley-chiche.workers.dev",

  // true = un code d'accès est demandé (code personnel, codes testeurs, puis Payhip).
  CODE_REQUIS: true,

  // Lien pour obtenir un code (page Payhip). Vide = on invite à écrire.
  LIEN_CODE: "",
  CONTACT: "mailto:shirley.chiche@buildrh.co?subject=Coach%20d'entretien%20annuel%20%E2%80%94%20code%20d'acc%C3%A8s",
  EMAIL: "shirley.chiche@buildrh.co",

  MAX_CARACTERES: 60000,     // doit rester cohérent avec le relais
  ATTENTE_MAX_MINUTES: 10,
};
