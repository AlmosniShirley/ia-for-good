(function () {
  "use strict";
  var P = window.PLATEFORME || {};
  var ALL = (window.CONTENUS || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function $(id) { return document.getElementById(id); }

  /* ---------- Cartes de ressources ---------- */
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
    if (r.lien) return '<a class="btn btn-prim" href="' + esc(r.lien) + '"' + (/^https?:/.test(r.lien) ? ext : "") + ">" + esc(r.action || "Accéder") + "</a>" +
      (r.exemple ? '<a class="btn btn-sec" href="' + esc(r.exemple) + '"' + ext + ">Voir un exemple</a>" : "") + '<span class="prix">Gratuit</span>';
    return "";
  }

  function carte(r) {
    var couv = r.apercu ? '<div class="couv"><img src="' + esc(r.apercu) + '" alt="" loading="lazy"></div>' : "";
    return '<article class="carte">' + couv +
      '<div class="corps">' +
        '<div class="meta">' + (r.type ? '<span class="badge type">' + esc(r.type) + "</span>" : "") + "</div>" +
        "<h3>" + esc(r.titre) + "</h3>" +
        (r.pour ? '<p class="pour-qui">Pour : <strong>' + esc(r.pour) + "</strong></p>" : "") +
        (r.description ? '<p class="desc">' + esc(r.description) + "</p>" : "") +
        (r.auteur ? '<p class="auteur">' + esc(r.auteur) + "</p>" : "") +
        '<div class="actions">' + actions(r) + "</div>" +
      "</div></article>";
  }

  function vide(nom) {
    return '<div class="vide"><strong>Bientôt en ligne</strong>Les premiers contenus « ' + esc(nom) + " » arrivent très vite.</div>";
  }
  function grille(items, nom) {
    return items.length ? '<div class="grille">' + items.map(carte).join("") + "</div>" : vide(nom);
  }

  /* Remplit une section de ressources à partir d'une rubrique du catalogue */
  function remplir(espaceId, cible, intro, section) {
    var e = (P.espaces || []).filter(function (x) { return x.id === espaceId; })[0];
    if (!e || !$(cible)) return;
    var items = ALL.filter(function (r) { return r.espace === espaceId; });
    if (section && e.masquerSiVide && !items.length) return;
    if (section) $(section).hidden = false;
    if ($(intro)) $(intro).textContent = e.intro || "";
    var html;
    if (e.sousRubriques) {
      html = e.sousRubriques.map(function (sr) {
        var sous = items.filter(function (r) { return norm(r.type) === norm(sr.type); });
        return '<div class="sous"><h3 class="sous-titre">' + esc(sr.nom) + ' <span class="n">' + sous.length + "</span></h3>" + grille(sous, sr.nom) + "</div>";
      }).join("");
      var connus = e.sousRubriques.map(function (sr) { return norm(sr.type); });
      var reste = items.filter(function (r) { return connus.indexOf(norm(r.type)) === -1; });
      if (reste.length) html += '<div class="sous"><h3 class="sous-titre">Autres formats</h3>' + grille(reste, e.nom) + "</div>";
    } else {
      html = grille(items, e.nom);
    }
    $(cible).innerHTML = html;
  }

  remplir("documentation-ia", "grille-ia", "intro-ia");
  remplir("neuro", "grille-neuro", "intro-neuro");
  remplir("autres", "grille-autres", "intro-autres", "ressources-autres");

  /* ---------- Pied de page, contact ---------- */
  if (P.contact && $("contact")) $("contact").href = P.contact;
  if ($("pied-liens")) $("pied-liens").innerHTML = (P.liens || []).map(function (l) {
    return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.nom) + "</a></li>";
  }).join("");

  /* ---------- Lecture confort ---------- */
  var conf = $("confort");
  function appliquerConfort(on) {
    document.documentElement.classList.toggle("confort", on);
    conf.setAttribute("aria-pressed", String(on));
    try { localStorage.setItem("iafg-confort", on ? "1" : "0"); } catch (e) {}
  }
  if (conf) {
    try { appliquerConfort(localStorage.getItem("iafg-confort") === "1"); } catch (e) {}
    conf.addEventListener("click", function () { appliquerConfort(conf.getAttribute("aria-pressed") !== "true"); });
  }
})();
