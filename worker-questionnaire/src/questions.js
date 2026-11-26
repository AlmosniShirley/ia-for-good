/* Questions du questionnaire préparatoire (envoyées à la page seulement après un code valide).
   Modifier une question : changer son texte (garder l'id), puis npx wrangler deploy. */
export const SECTIONS = [
    {
      titre: "Situation actuelle",
      questions: [
        { id: "situation", q: "Quelle est ta situation professionnelle aujourd'hui ?" },
        { id: "pourquoi", q: "Pourquoi demandes-tu un accompagnement maintenant ?" },
        { id: "preoccupe", q: "Qu'est-ce qui te préoccupe le plus ?" },
        { id: "compris", q: "Qu'aimerais-tu avoir compris à la fin de la séance ?" },
        { id: "analyse-ia", q: "As-tu déjà utilisé une analyse IA de ton CV ?", type: "ouinon" },
        { id: "analyse-juste", q: "Qu'est-ce qui t'a semblé juste dans cette analyse ?", si: "analyse-ia" },
        { id: "analyse-faux", q: "Qu'est-ce qui t'a semblé faux, incomplet ou frustrant ?", si: "analyse-ia" },
      ],
    },
    {
      titre: "Parcours",
      questions: [
        { id: "trois-exp", q: "Quelles sont les trois expériences professionnelles les plus importantes de ton parcours ?", lignes: 5 },
        { id: "appris", q: "Laquelle t'a le plus appris ?" },
        { id: "energie", q: "Laquelle t'a donné le plus d'énergie ?" },
        { id: "epuise", q: "Laquelle t'a le plus épuisé·e ?" },
        { id: "fierte", q: "De quelle réalisation es-tu le plus fier / la plus fière ?" },
        { id: "concret", q: "Qu'est-ce que tu faisais concrètement dans cette réalisation ?" },
        { id: "demandes", q: "Qu'est-ce que les autres viennent généralement te demander ?" },
      ],
    },
    {
      titre: "Fonctionnement professionnel",
      questions: [
        { id: "mieux", q: "Dans quelles situations travailles-tu le mieux ?" },
        { id: "cadre", q: "Préfères-tu avoir un cadre clair ou beaucoup d'autonomie ?" },
        { id: "flou", q: "Comment réagis-tu lorsqu'une tâche est floue ?" },
        { id: "apprendre", q: "Qu'est-ce qui t'aide à apprendre ?" },
        { id: "perdre", q: "Qu'est-ce qui te fait perdre tes moyens ou ton énergie ?" },
        { id: "efficace", q: "De quoi as-tu besoin pour te sentir efficace ?" },
        { id: "contraintes-travail", q: "Quelles contraintes doivent absolument être prises en compte ?" },
      ],
    },
    {
      titre: "Projection",
      questions: [
        { id: "attire", q: "Quels métiers ou environnements t'attirent aujourd'hui ?" },
        { id: "precisement", q: "Qu'est-ce qui t'attire précisément dans ces pistes ?" },
        { id: "plus-vivre", q: "Qu'est-ce que tu ne veux plus vivre professionnellement ?" },
        { id: "non-negociables", q: "Quelles sont tes contraintes non négociables : financières, géographiques, familiales, horaires ?" },
        { id: "tester", q: "Qu'aimerais-tu tester sans forcément t'engager immédiatement ?" },
      ],
    },
];

export const DOCUMENTS = [
    { id: "cv", titre: "Ton CV actuel", aide: "Fortement conseillé." },
    { id: "analyse", titre: "Le résultat de l'analyse IA de ton CV", aide: "Si tu en as une.", si: "analyse-ia" },
    { id: "offre1", titre: "Une offre d'emploi qui t'intéresse", aide: "Facultatif : fichier, texte ou lien." },
    { id: "offre2", titre: "Une deuxième offre", aide: "Facultatif." },
];
