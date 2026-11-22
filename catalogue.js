/* =====================================================================
   CATALOGUE IA FOR GOOD — c'est le seul fichier à modifier !
   =====================================================================

   Rubriques (champ "espace") — voir la liste "espaces" plus bas :
   - "analyse-parcours" : Agent IA · Analyse de parcours (Le Bon Angle)
   - "scan-annonce"     : Agent IA · Scan d'annonce (Décodeur d'offres)
   - "documentation-ia" : livres blancs (type "livre blanc") et
                          infographies (type "infographie") sur l'IA
   - "neuro"            : neuroatypisme & inclusion
   - "autres"           : tout le reste

   POUR AJOUTER UN CONTENU : copiez un bloc { ... } de la liste CONTENUS
   (de l'accolade ouvrante à la virgule qui suit l'accolade fermante),
   collez-le en haut de la liste et modifiez les informations.

   CHAMPS COMMUNS :
   - titre        : le titre affiché (obligatoire)
   - espace       : l'identifiant d'une rubrique (voir ci-dessus)
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
   - points       : la liste de ce que l'on obtient (affichée en puces)

   ⚠️ Tout ce qui est dans ce dépôt est public : ne déposez jamais la
      version complète d'un document payant. Elle va uniquement sur Payhip.
   ===================================================================== */

window.PLATEFORME = {
  nom: "IA FOR GOOD",
  accroche: "L'IA au service",
  accrocheAccent: "de l'humain.",
  sousTitre:
    "Deux agents IA pour avancer dans votre carrière (analyser votre parcours, scanner une annonce), et une documentation pour comprendre l'IA au travail et le neuroatypisme. Sourcé, actionnable, inclusif.",
  contact: "mailto:shirley.chiche@buildrh.co",

  // LES RUBRIQUES (dans l'ordre d'affichage)
  // - vedette: true      → grande carte (pour un produit phare, ex. un agent)
  // - sousRubriques      → regroupe les contenus par "type" (livre blanc, infographie…)
  // - masquerSiVide: true → la rubrique n'apparaît que lorsqu'elle a du contenu
  // icone possible : "parcours", "scan", "doc", "neuro", "autres"
  espaces: [
    {
      id: "analyse-parcours",
      nom: "Agent IA · Analyse de parcours",
      court: "Analyse de parcours",
      icone: "parcours",
      vedette: true,
      intro: "Votre CV face au poste que vous visez : intitulés, lisibilité ATS, clarté, et des pistes concrètes pour repositionner votre trajectoire.",
    },
    {
      id: "scan-annonce",
      nom: "Agent IA · Scan d'annonce",
      court: "Scan d'annonce",
      icone: "scan",
      vedette: true,
      intro: "Une annonce, c'est une vitrine. L'agent lit ce qu'il y a derrière avant que vous ne postuliez.",
    },
    {
      id: "documentation-ia",
      nom: "Documentation IA",
      court: "Documentation IA",
      icone: "doc",
      intro: "Livres blancs et infographies pour comprendre comment l'IA transforme les métiers, les organisations et le marché de l'emploi.",
      sousRubriques: [
        { type: "livre blanc", nom: "Livres blancs" },
        { type: "infographie", nom: "Infographies" },
      ],
    },
    {
      id: "neuro",
      nom: "Neuroatypisme & inclusion",
      court: "Neuroatypisme",
      icone: "neuro",
      intro: "TDAH, neuroatypies et travail : comprendre, recruter et manager sans abîmer. Des actions concrètes, pas des slogans.",
    },
    {
      id: "autres",
      nom: "Autres sujets",
      court: "Autres sujets",
      icone: "autres",
      masquerSiVide: true,
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
    espace: "scan-annonce",
    theme: "carriere",
    type: "agent IA",
    statut: "bêta",
    pour: "Candidats Tech qui veulent voir derrière l'annonce",
    description:
      "Collez une offre d'emploi et votre CV : l'agent décrypte le vrai terrain de jeu, la culture derrière les mots, les red flags, la santé financière et la compatibilité neuroatypisme, puis calcule votre % de matching et rédige votre message d'approche. 16 points, méthode DEV.",
    points: [
      "Le vrai terrain de jeu : startup, scale-up, grand groupe, ESN, éditeur…",
      "Les red flags (10 patterns) et les green flags, avec leur gravité",
      "Culture, santé financière, avis Glassdoor, diversité",
      "Compatibilité avec un fonctionnement neuroatypique",
      "% de matching, CV à retravailler, message d'approche et questions d'entretien",
    ],
    lien: "decodeur.html",
    action: "Décoder une offre",
    tags: ["offre d'emploi", "red flags", "matching", "CV", "neuroatypisme", "Glassdoor", "salaire"],
    date: "2026-11-22",
    auteur: "BUILD RH · méthode Shirley Almosni Chiche",
  },
  {
    titre: "Analyse de parcours Le Bon Angle",
    espace: "analyse-parcours",
    theme: "carriere",
    type: "agent IA",
    statut: "disponible",
    pour: "Profils Tech en recherche ou en transition",
    description:
      "Collez votre CV et l'offre visée : l'agent vérifie la correspondance des intitulés, note la lisibilité ATS et la clarté sur 5, et vous rend des pistes concrètes. Gratuit pendant le lancement.",
    points: [
      "Correspondance entre vos intitulés et le rôle visé",
      "Notes de lisibilité ATS et de clarté, sur 5",
      "Reformulations concrètes pour votre CV et votre LinkedIn",
      "Priorités d'amélioration, dans l'ordre",
    ],
    lien: "https://almosnishirley.github.io/le-bon-angle/atelier.html",
    action: "Lancer l'analyse gratuite",
    tags: ["CV", "ATS", "carrière", "Tech", "gratuit"],
    date: "2026-11-21",
    auteur: "BUILD RH · Le Bon Angle",
  },

  /* ---------------- DOCUMENTATION IA & NEUROATYPISME ----------------
     Infographie : espace "documentation-ia", type "infographie". */
  {
    titre: "Neuroatypies au travail : changez le travail",
    espace: "neuro",
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
    espace: "neuro",
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
    espace: "documentation-ia",
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
    espace: "documentation-ia",
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
