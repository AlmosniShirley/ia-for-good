(function () {
  "use strict";
  var P = window.PLATEFORME || {};
  var ALL = (window.CONTENUS || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
  var ESPACES = P.espaces || [];
  var THEMES = {};
  (P.themes || []).forEach(function (t) { THEMES[t.id] = t; });

  var etat = { espace: "tout", theme: "", q: "" };

  var ICONES = {
    agents: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4M9 12h.01M15 12h.01M9.5 15.5h5"/></svg>',
    infographies: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    etudes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></svg>',
    autres: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>',
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function $(id) { return document.getElementById(id); }
  function nomEspace(id) { for (var i = 0; i < ESPACES.length; i++) if (ESPACES[i].id === id) return ESPACES[i]; return null; }

  function correspond(r) {
    if (etat.theme && r.theme !== etat.theme) return false;
    if (!etat.q) return true;
    var hay = norm([r.titre, r.description, r.type, r.pour, r.auteur, (r.tags || []).join(" "), THEMES[r.theme] ? THEMES[r.theme].nom : ""].join(" "));
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
    if (r.lien) return '<a class="btn btn-prim" href="' + esc(r.lien) + '"' + ext + ">" + esc(r.action || "Accéder") + "</a>" +
      (r.espace === "agents" ? "" : '<span class="prix">Gratuit</span>');
    return "";
  }

  function carte(r) {
    var t = THEMES[r.theme];
    var couv = r.espace === "agents" && !r.apercu
      ? '<div class="couv-agent">' + ICONES.agents + (r.pour ? '<span class="pour">Pour : ' + esc(r.pour) + "</span>" : "") + "</div>"
      : r.apercu ? '<div class="couv"><img src="' + esc(r.apercu) + '" alt="" loading="lazy"></div>' : "";
    return '<article class="carte">' + couv +
      '<div class="corps">' +
        '<div class="meta">' + badgeStatut(r) +
          (r.type ? '<span class="badge type">' + esc(r.type) + "</span>" : "") +
          (t ? '<span class="badge t-' + esc(t.couleur) + '">' + esc(t.nom) + "</span>" : "") +
        "</div>" +
        "<h3>" + esc(r.titre) + "</h3>" +
        (r.description ? '<p class="desc">' + esc(r.description) + "</p>" : "") +
        (r.auteur ? '<p class="auteur">' + esc(r.auteur) + "</p>" : "") +
        '<div class="actions">' + actions(r) + "</div>" +
      "</div></article>";
  }

  function vide(e) {
    var filtre = etat.q || etat.theme;
    return '<div class="vide"><strong>' + (filtre ? "Aucun résultat ici" : "Bientôt en ligne") + "</strong>" +
      (filtre ? "Essayez un autre mot-clé ou un autre thème." : "Les premiers contenus « " + esc(e.nom) + " » arrivent très vite.") + "</div>";
  }

  /* ---------- Rendu ---------- */
  function rendre() {
    var visibles = ALL.filter(correspond);
    var liste = etat.espace === "tout" ? ESPACES : ESPACES.filter(function (e) { return e.id === etat.espace; });
    var html = "";
    liste.forEach(function (e) {
      var items = visibles.filter(function (r) { return r.espace === e.id; });
      // En vue « Tout », on masque les espaces vides seulement pendant une recherche
      if (etat.espace === "tout" && !items.length && (etat.q || etat.theme)) return;
      var limite = etat.espace === "tout" ? 3 : items.length;
      html += '<section class="section" id="s-' + esc(e.id) + '" aria-labelledby="h-' + esc(e.id) + '">' +
        '<div class="section-tete"><div><h2 id="h-' + esc(e.id) + '">' + esc(e.nom) + "</h2><p>" + esc(e.intro) + "</p></div>" +
        (etat.espace === "tout" && items.length > limite ? '<button class="voir" data-espace="' + esc(e.id) + '">Tout voir (' + items.length + ") →</button>" : "") +
        "</div>" +
        (items.length ? '<div class="grille">' + items.slice(0, limite).map(carte).join("") + "</div>" : vide(e)) +
        "</section>";
    });
    $("sections").innerHTML = html || '<div class="vide"><strong>Aucun résultat</strong>Essayez un autre mot-clé.</div>';
    var n = visibles.filter(function (r) { return etat.espace === "tout" || r.espace === etat.espace; }).length;
    $("compte").textContent = (etat.q || etat.theme) ? n + " résultat" + (n > 1 ? "s" : "") : "";
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

  function rendreThemes() {
    var html = '<button class="chip" data-theme="" aria-pressed="' + !etat.theme + '">Tous les thèmes</button>';
    (P.themes || []).forEach(function (t) {
      if (!ALL.some(function (r) { return r.theme === t.id; })) return;
      html += '<button class="chip" data-theme="' + esc(t.id) + '" aria-pressed="' + (etat.theme === t.id) + '">' + esc(t.nom) + "</button>";
    });
    $("themes").innerHTML = html;
  }

  function choisirEspace(id, defiler) {
    etat.espace = nomEspace(id) ? id : "tout";
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
    var n = ALL.filter(function (r) { return r.espace === e.id; }).length;
    return '<button class="pilier" data-espace="' + esc(e.id) + '"><span class="ico">' + (ICONES[e.id] || ICONES.autres) + "</span>" +
      "<span><strong>" + esc(e.nom) + "</strong><small>" + (n ? n + " contenu" + (n > 1 ? "s" : "") : "Bientôt") + "</small></span></button>";
  }).join("");

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-espace]");
    if (b) { choisirEspace(b.getAttribute("data-espace"), !b.classList.contains("onglet")); return; }
    var c = ev.target.closest("[data-theme]");
    if (c) { etat.theme = c.getAttribute("data-theme"); rendreThemes(); rendre(); }
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

  etat.espace = nomEspace(location.hash.slice(1)) ? location.hash.slice(1) : "tout";
  rendreThemes();
  rendre();
})();
