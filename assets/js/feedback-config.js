/* =====================================================================
   FEEDBACK D'ENTRETIEN DE RECRUTEMENT — réglages (fichier public : aucun secret ici !)
   ===================================================================== */
window.FEEDBACK_ENTRETIEN = {
  // Adresse du relais Cloudflare. Vide = la page affiche « ouvre très bientôt ».
  API_URL: "https://ia-for-good-coach-recrutement.shirley-chiche.workers.dev",

  // true = un code d'accès est demandé (code personnel, codes testeurs, puis Payhip).
  CODE_REQUIS: true,

  // Lien pour obtenir un code (page Payhip). Vide = on invite à écrire.
  LIEN_CODE: "",
  CONTACT: "mailto:shirley.chiche@buildrh.co?subject=Feedback%20d'entretien%20de%20recrutement%20%E2%80%94%20code%20d'acc%C3%A8s",
  EMAIL: "shirley.chiche@buildrh.co",

  MAX_CARACTERES: 120000,     // doit rester cohérent avec le relais
  ATTENTE_MAX_MINUTES: 10,
};
