(function () {
  "use strict";
  var P = window.PLATEFORME || {};
  var ALL = (window.CONTENUS || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
  var ESPACES = (P.espaces || []).filter(function (e) {
    return !e.masquerSiVide || ALL.some(function (r) { return r.espace === e.id; });
  });

  var etat = { espace: "tout", q: "" };

  var ICONES = {
    parcours: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5"/></svg>',
    scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></svg>',
    neuro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3a3 3 0 0 0-3 3 3 3 0 0 0-2.5 4.5A3 3 0 0 0 5 16a3 3 0 0 0 4.5 4V3zM14.5 3a3 3 0 0 1 3 3 3 3 0 0 1 2.5 4.5A3 3 0 0 1 19 16a3 3 0 0 1-4.5 4V3z"/></svg>',
    autres: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function $(id) { return document.getElementById(id); }
  function trouverEspace(id) { for (var i = 0; i < ESPACES.length; i++) if (ESPACES[i].id === id) return ESPACES[i]; return null; }

  function correspond(r) {
    if (!etat.q) return true;
    var e = trouverEspace(r.espace);
    var hay = norm([r.titre, r.description, r.type, r.pour, r.auteur, (r.tags || []).join(" "), (r.points || []).join(" "), e ? e.nom : ""].join(" "));
    return norm(etat.q).split(/\s+/).every(function (m) { return hay.indexOf(m) !== -1; });
  }

  /* ---------- Cartes ---------- */
  function badgeStatut(r) {
    var s = norm(r.statut);
    if (!s) return "";
    if (s === "disponible") return '<span class="badge ok">disponible</span>';
    if (s === "beta") return '<span class="badge beta">bêta</span>';
    return '<span class="badge bientot">bientôt</span>';
  }

  function actions(r) {
    var ext = ' target="_blank" rel="noopener"';
    if (norm(r.statut) === "bientot") return '<span class="btn btn-prim" aria-disabled="true">Bientôt disponible</span>';
    if (r.payant) {
      var h = r.achat
        ? '<a class="btn btn-prim" href="' + esc(r.achat) + '"' + ext + '>Acheter</a>'
        : '<span class="btn btn-prim" aria-disabled="true">Bientôt en vente</span>';
      if (r.extrait) h += '<a class="btn btn-sec" href="' + esc(r.extrait) + '"' + ext + '>Lire un extrait</a>';
      if (r.prix) h += '<span class="prix">' + esc(r.prix) + "</span>";
      return h;
    }
    if (r.lien) return '<a class="btn btn-prim" href="' + esc(r.lien) + '"' + (/^https?:/.test(r.lien) ? ext : "") + ">" + esc(r.action || "Accéder") + "</a>";
    return "";
  }

  function meta(r) {
    return '<div class="meta">' + badgeStatut(r) + (r.type ? '<span class="badge type">' + esc(r.type) + "</span>" : "") + "</div>";
  }

  function carte(r) {
    var couv = r.apercu ? '<div class="couv"><img src="' + esc(r.apercu) + '" alt="" loading="lazy"></div>' : "";
    return '<article class="carte">' + couv +
      '<div class="corps">' + meta(r) +
        "<h3>" + esc(r.titre) + "</h3>" +
        (r.description ? '<p class="desc">' + esc(r.description) + "</p>" : "") +
        (r.auteur ? '<p class="auteur">' + esc(r.auteur) + "</p>" : "") +
        '<div class="actions">' + actions(r) + "</div>" +
      "</div></article>";
  }

  /* Grande carte pour un produit phare (agent IA) */
  function carteVedette(r, e) {
    return '<article class="vedette">' +
      '<div class="vedette-panneau">' +
        '<span class="vedette-ico">' + (ICONES[e.icone] || ICONES.autres) + "</span>" +
        '<p class="vedette-kicker">' + esc(e.nom) + "</p>" +
        (r.pour ? '<p class="vedette-pour">Pour : ' + esc(r.pour) + "</p>" : "") +
      "</div>" +
      '<div class="corps">' + meta(r) +
        "<h3>" + esc(r.titre) + "</h3>" +
        (r.description ? '<p class="desc">' + esc(r.description) + "</p>" : "") +
        (r.points && r.points.length ? '<ul class="obtenez">' + r.points.map(function (p) { return "<li>" + ICONES.check + "<span>" + esc(p) + "</span></li>"; }).join("") + "</ul>" : "") +
        '<div class="actions">' + actions(r) + (r.auteur ? '<span class="auteur">' + esc(r.auteur) + "</span>" : "") + "</div>" +
      "</div></article>";
  }

  function vide(nom) {
    return '<div class="vide"><strong>' + (etat.q ? "Aucun résultat ici" : "Bientôt en ligne") + "</strong>" +
      (etat.q ? "Essayez un autre mot-clé." : "Les premiers contenus « " + esc(nom) + " » arrivent très vite.") + "</div>";
  }

  function grille(items, limite, nom) {
    return items.length ? '<div class="grille">' + items.slice(0, limite).map(carte).join("") + "</div>" : vide(nom);
  }

  /* ---------- Rendu ---------- */
  function rendre() {
    var visibles = ALL.filter(correspond);
    var vueTout = etat.espace === "tout";
    var liste = vueTout ? ESPACES : ESPACES.filter(function (e) { return e.id === etat.espace; });
    var html = "";
    liste.forEach(function (e) {
      var items = visibles.filter(function (r) { return r.espace === e.id; });
      if (vueTout && !items.length && etat.q) return;
      var limite = vueTout && !e.vedette ? 3 : items.length;
      var corps;
      if (e.vedette) {
        corps = items.length ? '<div class="pile">' + items.map(function (r) { return carteVedette(r, e); }).join("") + "</div>" : vide(e.nom);
      } else if (e.sousRubriques) {
        corps = e.sousRubriques.map(function (sr) {
          var sous = items.filter(function (r) { return norm(r.type) === norm(sr.type); });
          if (!sous.length && etat.q) return "";
          return '<div class="sous"><h3 class="sous-titre">' + esc(sr.nom) + ' <span class="n">' + sous.length + "</span></h3>" + grille(sous, limite, sr.nom) + "</div>";
        }).join("");
        var connus = e.sousRubriques.map(function (sr) { return norm(sr.type); });
        var reste = items.filter(function (r) { return connus.indexOf(norm(r.type)) === -1; });
        if (reste.length) corps += '<div class="sous"><h3 class="sous-titre">Autres formats</h3>' + grille(reste, limite, e.nom) + "</div>";
      } else {
        corps = grille(items, limite, e.nom);
      }
      html += '<section class="section" id="s-' + esc(e.id) + '" aria-labelledby="h-' + esc(e.id) + '">' +
        '<div class="section-tete"><div class="section-titre"><span class="section-ico">' + (ICONES[e.icone] || ICONES.autres) + "</span>" +
        '<div><h2 id="h-' + esc(e.id) + '">' + esc(e.nom) + "</h2><p>" + esc(e.intro) + "</p></div></div>" +
        (vueTout && !e.vedette && items.length > 3 ? '<button class="voir" data-espace="' + esc(e.id) + '">Tout voir (' + items.length + ") →</button>" : "") +
        "</div>" + corps + "</section>";
    });
    $("sections").innerHTML = html || '<div class="vide"><strong>Aucun résultat</strong>Essayez un autre mot-clé.</div>';
    var n = visibles.filter(function (r) { return vueTout || r.espace === etat.espace; }).length;
    $("compte").textContent = etat.q ? n + " résultat" + (n > 1 ? "s" : "") : "";
    rendreOnglets(visibles);
  }

  function rendreOnglets(visibles) {
    var tabs = [{ id: "tout", court: "Tout" }].concat(ESPACES);
    $("onglets").innerHTML = tabs.map(function (e) {
      var n = e.id === "tout" ? visibles.length : visibles.filter(function (r) { return r.espace === e.id; }).length;
      return '<button class="onglet" data-espace="' + esc(e.id) + '" aria-current="' + (etat.espace === e.id) + '">' +
        esc(e.court || e.nom) + '<span class="n">' + n + "</span></button>";
    }).join("");
  }

  function choisirEspace(id, defiler) {
    etat.espace = trouverEspace(id) ? id : "tout";
    history.replaceState(null, "", etat.espace === "tout" ? location.pathname : "#" + etat.espace);
    rendre();
    if (defiler) $("onglets").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Initialisation ---------- */
  document.title = P.nom || document.title;
  $("accroche").textContent = P.accroche || "";
  $("accroche-accent").textContent = P.accrocheAccent || "";
  $("sous-titre").textContent = P.sousTitre || "";
  if (P.contact) $("contact").href = P.contact;
  $("pied-liens").innerHTML = (P.liens || []).map(function (l) {
    return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.nom) + "</a></li>";
  }).join("");
  $("piliers").innerHTML = ESPACES.map(function (e) {
    var items = ALL.filter(function (r) { return r.espace === e.id; });
    var sous = e.vedette && items[0] ? items[0].titre : items.length ? items.length + " contenu" + (items.length > 1 ? "s" : "") : "Bientôt";
    return '<button class="pilier' + (e.vedette ? " pilier-agent" : "") + '" data-espace="' + esc(e.id) + '"><span class="ico">' + (ICONES[e.icone] || ICONES.autres) + "</span>" +
      "<span><strong>" + esc(e.nom) + "</strong><small>" + esc(sous) + "</small></span></button>";
  }).join("");

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-espace]");
    if (b) choisirEspace(b.getAttribute("data-espace"), !b.classList.contains("onglet"));
  });
  $("q").addEventListener("input", function (e) { etat.q = e.target.value.trim(); rendre(); });

  var conf = $("confort");
  function appliquerConfort(on) {
    document.documentElement.classList.toggle("confort", on);
    conf.setAttribute("aria-pressed", String(on));
    try { localStorage.setItem("iafg-confort", on ? "1" : "0"); } catch (e) {}
  }
  try { appliquerConfort(localStorage.getItem("iafg-confort") === "1"); } catch (e) {}
  conf.addEventListener("click", function () { appliquerConfort(conf.getAttribute("aria-pressed") !== "true"); });

  var h = location.hash.slice(1);
  etat.espace = trouverEspace(h) ? h : "tout";
  rendre();
})();
