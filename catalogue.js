/* =====================================================================
   CATALOGUE IA FOR GOOD — c'est le seul fichier à modifier !
   =====================================================================

   ⚠️ Les deux outils (Le Bon Angle, Décodeur d'offres) sont décrits
      directement dans index.html. Ce catalogue alimente les RESSOURCES.

   Rubriques (champ "espace") :
   - "documentation-ia" : Comprendre l'IA au travail — livres blancs
                          (type "livre blanc") et infographies (type "infographie")
   - "neuro"            : Neuroatypies & inclusion
   - "autres"           : tout le reste (la section n'apparaît que si elle a du contenu)

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
  // - sousRubriques      → regroupe les contenus par "type" (livre blanc, infographie…)
  // - masquerSiVide: true → la section n'apparaît que lorsqu'elle a du contenu
  espaces: [
    {
      id: "documentation-ia",
      nom: "Comprendre l'IA au travail",
      court: "IA au travail",
      icone: "doc",
      intro: "Des ressources courtes, sourcées et actionnables pour comprendre les nouveaux rôles, les systèmes augmentés, les transformations du travail et les mécanismes de confiance.",
      sousRubriques: [
        { type: "livre blanc", nom: "Livres blancs" },
        { type: "infographie", nom: "Infographies" },
      ],
    },
    {
      id: "neuro",
      nom: "Neuroatypies & inclusion",
      court: "Neuroatypisme",
      icone: "neuro",
      intro: "Des repères concrets pour les RH, les managers et les entreprises qui veulent recruter, onboarder et manager sans demander aux personnes de masquer leur fonctionnement.",
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
  /* ---------------- DOCUMENTATION IA & NEUROATYPISME ----------------
     Infographie : espace "documentation-ia", type "infographie". */
  {
    titre: "Neuroatypies au travail : changez le travail",
    espace: "neuro",
    pour: "Entreprises, RH & managers",
    theme: "neuro",
    type: "carrousel",
    description:
      "Ne demandez pas aux personnes neuroatypiques de mieux se masquer. Recruter sur le réel, onboarder sans sous-entendus, aménager avant l'épuisement, RQTH et confidentialité, manager autrement.",
    payant: true,
    prix: "1,80 €",
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
    pour: "Entreprises, RH & managers",
    theme: "neuro",
    type: "carrousel",
    description:
      "Ce n'est pas un défaut de volonté, c'est un autre mode de fonctionnement. Comprendre les forces, les frictions invisibles et les conditions de réussite, puis recruter et manager sans abîmer.",
    payant: true,
    prix: "1,80 €",
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
