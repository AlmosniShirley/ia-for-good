/* =====================================================================
   CATALOGUE IA FOR GOOD — c'est le seul fichier à modifier !
   =====================================================================

   La plateforme compte 4 espaces (champ "espace") :
   - "agents"        : vos produits Agents / outils IA
   - "infographies"  : vos infographies marchés
   - "etudes"        : vos études (neuroatypisme, IA & travail…)
   - "autres"        : tout le reste (guides, carrousels, outils…)

   POUR AJOUTER UN CONTENU : copiez un bloc { ... } de la liste CONTENUS
   (de l'accolade ouvrante à la virgule qui suit l'accolade fermante),
   collez-le en haut de la liste et modifiez les informations.

   CHAMPS COMMUNS :
   - titre        : le titre affiché (obligatoire)
   - espace       : "agents", "infographies", "etudes" ou "autres"
   - theme        : l'identifiant d'un thème ci-dessous (ex. "neuro")
   - type         : ex. "agent IA", "infographie", "étude", "livre blanc", "carrousel"
   - description  : une ou deux phrases de présentation
   - apercu       : (facultatif) image de couverture, ex. "assets/apercus/mon-image.jpg"
   - tags         : mots-clés entre guillemets, séparés par des virgules
   - date         : date de publication au format AAAA-MM-JJ
   - auteur       : (facultatif) l'auteur, la source ou le format

   ACCÈS — choisissez UNE des trois formules :
   - gratuit      : lien: "https://..."             (bouton « Accéder »)
   - payant       : payant: true, prix: "5 €", achat: "https://payhip.com/b/…",
                    extrait: "https://…" (facultatif)
   - à venir      : statut: "bientôt"                (bouton désactivé)

   CHAMPS EN PLUS POUR UN AGENT IA :
   - statut       : "disponible", "bêta" ou "bientôt"
   - action       : le texte du bouton, ex. "Lancer l'analyse"
   - pour         : à qui il s'adresse, ex. "Candidats Tech"

   ⚠️ Tout ce qui est dans ce dépôt est public : ne déposez jamais la
      version complète d'un document payant. Elle va uniquement sur Payhip.
   ===================================================================== */

window.PLATEFORME = {
  nom: "IA FOR GOOD",
  accroche: "L'IA au service",
  accrocheAccent: "de l'humain.",
  sousTitre:
    "Des agents IA utiles, des infographies pour lire le marché et des études pour comprendre le travail tel qu'il est vécu, notamment par les personnes neuroatypiques. Sourcé, actionnable, inclusif.",
  contact: "mailto:shirley.chiche@buildrh.co",

  // Textes des quatre espaces (onglets et en-têtes de section)
  espaces: [
    {
      id: "agents",
      nom: "Agents & outils IA",
      court: "Agents IA",
      intro: "Des assistants IA conçus pour un usage précis, avec des garde-fous clairs : pas de chiffres inventés, pas de décision à votre place.",
    },
    {
      id: "infographies",
      nom: "Infographies marchés",
      court: "Infographies",
      intro: "Le marché de l'emploi, des métiers et de l'IA en une page : tendances, salaires, compétences qui montent.",
    },
    {
      id: "etudes",
      nom: "Études",
      court: "Études",
      intro: "Neuroatypisme, IA et organisation du travail : des synthèses de recherche, des retours de terrain et des actions concrètes.",
    },
    {
      id: "autres",
      nom: "Autres sujets",
      court: "Autres sujets",
      intro: "Guides, outils et méthodes sur les RH, l'inclusion et le recrutement.",
    },
  ],

  // Thèmes (filtres). couleurs possibles : magenta, violet, teal, bleu, jaune
  themes: [
    { id: "ia", nom: "IA & travail", couleur: "violet" },
    { id: "neuro", nom: "Neuroatypisme", couleur: "magenta" },
    { id: "inclusion", nom: "Inclusion", couleur: "teal" },
    { id: "carriere", nom: "Carrière", couleur: "bleu" },
    { id: "marche", nom: "Marché de l'emploi", couleur: "jaune" },
  ],

  // Liens affichés en bas de page
  liens: [
    { nom: "La bibliothèque BUILD RH", url: "https://almosnishirley.github.io/bibliotheque-ressources/" },
    { nom: "Le Bon Angle", url: "https://almosnishirley.github.io/le-bon-angle/" },
    { nom: "Le blog Prompt humain", url: "https://prompt-humain.ghost.io/" },
    { nom: "La chaîne YouTube", url: "https://www.youtube.com/@TDArHH" },
    { nom: "BUILD RH", url: "https://build-rh.io/" },
  ],
};

window.CONTENUS = [
  /* ---------------- AGENTS & OUTILS IA ---------------- */
  {
    titre: "Décodeur d'offres",
    espace: "agents",
    theme: "carriere",
    type: "agent IA",
    statut: "bêta",
    pour: "Candidats et candidates Tech qui veulent voir derrière l'annonce",
    description:
      "Collez une offre d'emploi et votre CV : l'agent décrypte le vrai terrain de jeu, la culture derrière les mots, les red flags, la santé financière et la compatibilité neuroatypisme, puis calcule votre % de matching et rédige votre message d'approche. 16 points, méthode DEV.",
    lien: "decodeur.html",
    action: "Décoder une offre",
    tags: ["offre d'emploi", "red flags", "matching", "CV", "neuroatypisme", "Glassdoor", "salaire"],
    date: "2026-11-22",
    auteur: "BUILD RH · méthode Shirley Almosni Chiche",
  },
  {
    titre: "Analyse de parcours Le Bon Angle",
    espace: "agents",
    theme: "carriere",
    type: "agent IA",
    statut: "disponible",
    pour: "Profils Tech en recherche ou en transition",
    description:
      "Collez votre CV et l'offre visée : l'agent vérifie la correspondance des intitulés, note la lisibilité ATS et la clarté sur 5, et vous rend des pistes concrètes. Gratuit pendant le lancement.",
    lien: "https://almosnishirley.github.io/le-bon-angle/atelier.html",
    action: "Lancer l'analyse gratuite",
    tags: ["CV", "ATS", "carrière", "Tech", "gratuit"],
    date: "2026-11-21",
    auteur: "BUILD RH · Le Bon Angle",
  },

  /* ---------------- INFOGRAPHIES MARCHÉS ---------------- */
  // Ajoutez ici vos infographies (espace: "infographies").

  /* ---------------- ÉTUDES ---------------- */
  {
    titre: "Neuroatypies au travail : changez le travail",
    espace: "etudes",
    theme: "neuro",
    type: "carrousel",
    description:
      "Ne demandez pas aux personnes neuroatypiques de mieux se masquer. Recruter sur le réel, onboarder sans sous-entendus, aménager avant l'épuisement, RQTH et confidentialité, manager autrement.",
    payant: true,
    prix: "1,50 €",
    achat: "https://payhip.com/b/QkswI",
    extrait: "https://almosnishirley.github.io/bibliotheque-ressources/documents/extraits/neuroatypies-au-travail-extrait.pdf",
    apercu: "assets/apercus/neuroatypies-au-travail.jpg",
    tags: ["neuroatypie", "recrutement", "onboarding", "aménagements", "RQTH", "management"],
    date: "2026-11-18",
    auteur: "BUILD RH · 8 pages",
  },
  {
    titre: "TDAH au travail",
    espace: "etudes",
    theme: "neuro",
    type: "carrousel",
    description:
      "Ce n'est pas un défaut de volonté, c'est un autre mode de fonctionnement. Comprendre les forces, les frictions invisibles et les conditions de réussite, puis recruter et manager sans abîmer.",
    payant: true,
    prix: "1,50 €",
    achat: "https://payhip.com/b/gd3XQ",
    extrait: "https://almosnishirley.github.io/bibliotheque-ressources/documents/extraits/tdah-au-travail-extrait.pdf",
    apercu: "assets/apercus/tdah-au-travail.jpg",
    tags: ["TDAH", "hyperfocus", "recrutement", "management"],
    date: "2026-11-13",
    auteur: "BUILD RH · 10 pages",
  },
  {
    titre: "Design organisationnel à l'ère de l'IA",
    espace: "etudes",
    theme: "ia",
    type: "livre blanc",
    description:
      "Construire les nouveaux rôles, la frontière humain–machine et les mécanismes de confiance : AI Product Manager, Context Engineer, AgentOps, gouvernance, formation, rémunération et feuille de route 90 jours.",
    payant: true,
    prix: "5 €",
    achat: "https://payhip.com/b/MW63r",
    extrait: "https://almosnishirley.github.io/bibliotheque-ressources/documents/extraits/design-organisationnel-ia-extrait.pdf",
    apercu: "assets/apercus/design-organisationnel-ia.jpg",
    tags: ["IA", "nouveaux rôles", "gouvernance", "AI Act"],
    date: "2026-11-20",
    auteur: "BUILD RH · 21 pages",
  },
  {
    titre: "Du développeur au pilote de systèmes augmentés",
    espace: "etudes",
    theme: "ia",
    type: "livre blanc",
    description:
      "Les métiers de l'IT à l'ère des agents IA : où se déplace la valeur, les rôles qui émergent, quatre cas clients (Back Market, SFEIR, ACS, Skello), une roadmap 90 jours et les garde-fous de confiance.",
    payant: true,
    prix: "5 €",
    achat: "https://payhip.com/b/vPlSC",
    extrait: "https://almosnishirley.github.io/bibliotheque-ressources/documents/extraits/developpeur-pilote-systemes-augmentes-extrait.pdf",
    apercu: "assets/apercus/developpeur-pilote-systemes-augmentes.jpg",
    tags: ["IA", "IT", "agents IA", "nouveaux métiers", "AI Act"],
    date: "2026-11-18",
    auteur: "BUILD RH · 10 pages",
  },

  /* ---------------- AUTRES SUJETS ---------------- */
  // Ajoutez ici vos autres contenus (espace: "autres").
];
