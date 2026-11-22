/* =====================================================================
   IA FOR GOOD — Décodeur d'offres (page decodeur.html)
   1. Lecture du CV dans le navigateur (PDF, DOCX, TXT)
   2. Envoi au relais Cloudflare (POST /analyze puis GET /result)
   3. Affichage du résultat (Markdown nettoyé par DOMPurify)
   Rien n'est stocké : ni cookie, ni base de données.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.DECODEUR || {};
  var API = String(C.API_URL || "").trim().replace(/\/$/, "");
  var CODE_REQUIS = C.CODE_REQUIS !== false;
  var MAX = C.MAX_CARACTERES || 60000;
  var POLL_MS = 5000;
  var POLL_MAX = Math.round(((C.ATTENTE_MAX_MINUTES || 10) * 60000) / POLL_MS);

  var $ = function (id) { return document.getElementById(id); };
  var lastMarkdown = "";

  /* ---------- Lecture confort (commune au site) ---------- */
  var conf = $("confort");
  function appliquerConfort(on) {
    document.documentElement.classList.toggle("confort", on);
    conf.setAttribute("aria-pressed", String(on));
    try { localStorage.setItem("iafg-confort", on ? "1" : "0"); } catch (e) {}
  }
  try { appliquerConfort(localStorage.getItem("iafg-confort") === "1"); } catch (e) {}
  conf.addEventListener("click", function () { appliquerConfort(conf.getAttribute("aria-pressed") !== "true"); });

  Array.prototype.forEach.call(document.querySelectorAll("[data-contact]"), function (a) { a.href = C.CONTACT || "index.html"; });

  /* ---------- 1. Lecture du CV ---------- */
  function readPdf(file) {
    var pdfjs = window.pdfjsLib;
    if (!pdfjs) return Promise.reject(new Error("Lecteur PDF indisponible. Collez le texte de votre CV dans le champ prévu."));
    pdfjs.GlobalWorkerOptions.workerSrc = "assets/vendor/pdf.worker.min.js";
    return file.arrayBuffer().then(function (buf) { return pdfjs.getDocument({ data: buf }).promise; }).then(function (pdf) {
      var pages = [];
      for (var i = 1; i <= pdf.numPages; i++) pages.push(i);
      return Promise.all(pages.map(function (n) {
        return pdf.getPage(n).then(function (p) { return p.getTextContent(); }).then(function (tc) {
          var lines = [], lastY = null, line = "";
          tc.items.forEach(function (it) {
            var y = Math.round(it.transform[5]);
            if (lastY !== null && Math.abs(y - lastY) > 2) { lines.push(line.trim()); line = ""; }
            line += it.str + (it.hasEOL ? "" : " ");
            lastY = y;
          });
          lines.push(line.trim());
          return lines.filter(Boolean).join("\n");
        });
      }));
    }).then(function (texts) { return texts.join("\n\n"); });
  }

  function readFile(file) {
    var name = (file.name || "").toLowerCase();
    if (file.size > 10 * 1024 * 1024) return Promise.reject(new Error("Fichier trop lourd (10 Mo maximum)."));
    if (name.endsWith(".pdf") || file.type === "application/pdf") return readPdf(file);
    if (name.endsWith(".docx")) {
      if (!window.mammoth) return Promise.reject(new Error("Lecteur Word indisponible. Collez le texte de votre CV."));
      return file.arrayBuffer().then(function (buf) { return window.mammoth.extractRawText({ arrayBuffer: buf }); }).then(function (r) { return r.value; });
    }
    if (name.endsWith(".txt") || name.endsWith(".md") || file.type.indexOf("text/") === 0) return file.text();
    if (name.endsWith(".doc")) return Promise.reject(new Error("Le format .doc n'est pas pris en charge : enregistrez le CV en .docx ou en PDF."));
    return Promise.reject(new Error("Format non pris en charge. Utilisez un PDF, un .docx ou un fichier texte."));
  }

  function handleFile(file) {
    if (!file) return;
    var st = $("file-status");
    st.textContent = "Lecture de « " + file.name + " »…";
    readFile(file).then(function (text) {
      text = (text || "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
      st.textContent = text.length < 200
        ? "Peu de texte trouvé. S'il s'agit d'un CV scanné, copiez-collez son texte ci-dessous."
        : "« " + file.name + " » lu. Relisez le texte ci-dessous : c'est exactement ce qui sera transmis.";
      $("cv-text").value = text;
      updateCount();
    }).catch(function (e) { st.textContent = e.message || "Impossible de lire ce fichier."; });
  }

  function updateCount() {
    var n = $("cv-text").value.trim().length;
    $("cv-count").textContent = n ? n.toLocaleString("fr-FR") + " caractères" : "";
  }

  /* ---------- 2. Message envoyé à l'agent ---------- */
  function redact(t) {
    return t
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[e-mail masqué]")
      .replace(/(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}/g, "[téléphone masqué]")
      .replace(/\+\d{1,3}[\s.-]?\d(?:[\s.-]?\d){6,12}/g, "[téléphone masqué]");
  }
  function val(id) { var el = $(id); return el ? el.value.trim() : ""; }

  function buildMessage() {
    var clean = $("redact").checked ? redact : function (t) { return t; };
    var parts = ["Bonjour. Je souhaite décoder l'offre d'emploi ci-dessous et évaluer son adéquation avec mon profil."];

    var annonce = [];
    if (val("annonce-lien")) annonce.push("Lien : " + val("annonce-lien"));
    if (val("annonce-texte")) annonce.push("Texte complet :\n" + val("annonce-texte"));
    parts.push("## 1. L'annonce\n" + annonce.join("\n\n"));

    parts.push("## 2. Mon CV\n" + (val("cv-text") ? clean(val("cv-text")) : "Non fourni. Fais une première lecture partielle et signale ce qui manque."));

    var infos = [];
    if (val("linkedin")) infos.push("- Profil LinkedIn : " + val("linkedin"));
    if (val("liens")) infos.push("- GitHub / portfolio / site : " + val("liens"));
    if (val("objectifs")) infos.push("### Objectifs et track souhaité\n" + clean(val("objectifs")));
    if (val("non-nego")) infos.push("### Valeurs et points non négociables\n" + clean(val("non-nego")));
    if (val("environnement")) infos.push("### Ce dont j'ai besoin pour bien travailler\n" + clean(val("environnement")));
    parts.push("## 3. Informations complémentaires\n" + (infos.length ? infos.join("\n") : "Aucune information complémentaire fournie."));

    parts.push("Réponds en français, en Markdown. Commence par une section « ## Synthèse » de 4 à 6 lignes (verdict global et % de matching), puis respecte ta structure en 16 points : une section de niveau 2 (##) par point, numérotée de 1 à 16.");
    return parts.join("\n\n");
  }

  /* ---------- 3. Appels au relais ---------- */
  function api(path, options) {
    return fetch(API + path, options).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) {
          var err = new Error(data.error || "Le service est momentanément indisponible. Réessayez dans quelques minutes.");
          err.status = r.status; err.path = path;
          throw err;
        }
        return data;
      });
    }, function () { throw new Error("Connexion impossible au Décodeur. Vérifiez votre connexion Internet, puis réessayez."); });
  }

  var ETAPES = [
    [6, "L'agent se renseigne sur l'entreprise…"],
    [18, "Recherche des red flags et des signaux faibles…"],
    [36, "Croisement avec votre CV et votre trajectoire…"],
    [60, "Rédaction du message d'approche…"],
    [90, "Toujours en cours : les analyses complètes prennent parfois un peu plus de temps…"],
  ];
  function poll(cId, n) {
    return new Promise(function (res) { setTimeout(res, POLL_MS); }).then(function () {
      return api("/result?c=" + encodeURIComponent(cId));
    }).then(function (data) {
      if (data.status === "done") return data.content || "";
      if (data.status === "error") throw new Error(data.error || "L'analyse n'a pas abouti. Écrivez-moi : votre analyse sera recréditée.");
      if (n >= POLL_MAX) throw new Error("L'analyse prend plus de temps que prévu. Écrivez-moi si le problème persiste.");
      ETAPES.forEach(function (e) { if (n === e[0]) $("progress-text").textContent = e[1]; });
      return poll(cId, n + 1);
    });
  }

  function setBusy(busy) {
    $("submit-btn").disabled = busy;
    $("form").hidden = busy;
    $("progress").hidden = !busy;
    if (busy) { $("progress-text").textContent = "Analyse en cours…"; $("progress").focus(); }
  }

  function showError(msg, el) {
    var box = $("form-error");
    box.textContent = msg; box.hidden = !msg;
    if (msg && el) { el.setAttribute("aria-invalid", "true"); el.focus(); }
  }

  function onSubmit(e) {
    e.preventDefault();
    showError("");
    $("service-full").hidden = true;
    Array.prototype.forEach.call(document.querySelectorAll("[aria-invalid]"), function (el) { el.removeAttribute("aria-invalid"); });

    var lien = val("annonce-lien"), texte = val("annonce-texte");
    if (!lien && texte.length < 150) return showError("Ajoutez l'annonce : son lien et, de préférence, son texte complet.", $("annonce-texte"));
    if (lien && !/^https?:\/\/\S+$/i.test(lien)) return showError("Le lien de l'annonce doit commencer par https://", $("annonce-lien"));
    if (CODE_REQUIS && !val("access")) return showError("Saisissez votre code d'accès.", $("access"));
    if (!$("consent").checked) return showError("Cochez la case d'accord pour lancer l'analyse.", $("consent"));
    var message = buildMessage();
    if (message.length > MAX) return showError("L'ensemble dépasse " + MAX.toLocaleString("fr-FR") + " caractères : raccourcissez le CV ou l'annonce.", $("cv-text"));

    setBusy(true);
    api("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, accessCode: val("access") }),
    }).then(function (data) {
      var rem = $("remaining");
      rem.hidden = typeof data.remaining !== "number";
      if (!rem.hidden) rem.textContent = data.remaining > 0 ? "Il vous reste " + data.remaining + " analyse" + (data.remaining > 1 ? "s" : "") + " avec ce code." : "C'était l'analyse incluse avec ce code.";
      return poll(data.conversationId, 1);
    }).then(showResult).catch(function (err) {
      setBusy(false);
      if (err && err.status === 502 && err.path === "/analyze") {
        var full = $("service-full");
        full.hidden = false; full.scrollIntoView({ block: "center" }); full.focus({ preventScroll: true });
        return;
      }
      showError(err.message || "Une erreur est survenue.");
      $("form-error").scrollIntoView({ block: "center" });
    });
  }

  /* ---------- 4. Résultat ---------- */
  function splitIntoParts(container) {
    var nodes = Array.prototype.slice.call(container.childNodes);
    var tag = null;
    ["H1", "H2", "H3"].some(function (t) { if (nodes.some(function (n) { return n.nodeName === t; })) { tag = t; return true; } return false; });
    var parts = [], current = null, toc = [];
    nodes.forEach(function (n) {
      if (n.nodeType === 3 && !n.textContent.trim()) return;
      if (!current || (tag && n.nodeName === tag)) {
        current = document.createElement("section");
        current.className = "partie";
        current.id = "point-" + (parts.length + 1);
        parts.push(current);
        if (tag && n.nodeName === tag) toc.push({ id: current.id, text: n.textContent.trim() });
      }
      current.appendChild(n);
    });
    container.innerHTML = "";
    parts.forEach(function (p) { container.appendChild(p); });
    return toc;
  }

  function showResult(markdown) {
    lastMarkdown = markdown;
    var html = window.marked ? window.marked.parse(markdown) : "";
    var safe = html && window.DOMPurify ? window.DOMPurify.sanitize(html) : "";
    var body = $("result-body");
    if (safe) body.innerHTML = safe;
    else { var pre = document.createElement("pre"); pre.textContent = markdown; body.innerHTML = ""; body.appendChild(pre); }
    Array.prototype.forEach.call(body.querySelectorAll("a"), function (a) { a.target = "_blank"; a.rel = "noopener noreferrer"; });

    var toc = splitIntoParts(body), list = $("toc");
    list.innerHTML = "";
    toc.forEach(function (t) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = "#" + t.id; a.textContent = t.text;
      li.appendChild(a); list.appendChild(li);
    });
    $("toc-wrap").hidden = toc.length < 3;

    $("progress").hidden = true;
    $("app").hidden = true;
    var s = $("result");
    s.hidden = false; s.focus(); s.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function copyResult() {
    var st = $("copy-status");
    if (!navigator.clipboard) { st.textContent = "Copie automatique indisponible : sélectionnez le texte manuellement."; return; }
    navigator.clipboard.writeText(lastMarkdown).then(function () { st.textContent = "Texte copié."; }, function () { st.textContent = "Copie impossible : sélectionnez le texte manuellement."; });
  }

  function downloadResult() {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lastMarkdown], { type: "text/markdown;charset=utf-8" }));
    a.download = "decodeur-offre.md";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    $("copy-status").textContent = "Fichier téléchargé (format Markdown).";
  }

  function printResult() {
    var d = new Date(), prev = document.title, pad = function (n) { return (n < 10 ? "0" : "") + n; };
    $("print-date").textContent = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    document.title = "Decodeur offre " + pad(d.getDate()) + "-" + pad(d.getMonth() + 1) + "-" + d.getFullYear();
    var restore = function () { document.title = prev; window.removeEventListener("afterprint", restore); };
    window.addEventListener("afterprint", restore);
    $("copy-status").textContent = "Choisissez « Enregistrer au format PDF » comme destination.";
    setTimeout(function () { window.print(); }, 50);
  }

  function restart() {
    $("result").hidden = true;
    $("result-body").innerHTML = "";
    $("copy-status").textContent = "";
    lastMarkdown = "";
    $("annonce-lien").value = ""; $("annonce-texte").value = "";
    $("app").hidden = false;
    setBusy(false);
    $("annonce-lien").focus();
    $("outil").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Initialisation ---------- */
  if (!API) { $("app").hidden = true; $("ferme").hidden = false; return; }
  if (!CODE_REQUIS) $("code-wrap").hidden = true;
  if (C.LIEN_CODE) $("code-aide").innerHTML = 'Pas encore de code ? <a href="' + encodeURI(C.LIEN_CODE) + '" target="_blank" rel="noopener">Obtenez-le ici</a>.';

  var fi = $("cv-file"), dz = $("dropzone");
  fi.addEventListener("change", function () { handleFile(fi.files[0]); });
  $("cv-text").addEventListener("input", updateCount);
  ["dragenter", "dragover"].forEach(function (t) { dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.add("survol"); }); });
  ["dragleave", "drop"].forEach(function (t) { dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.remove("survol"); }); });
  dz.addEventListener("drop", function (e) { var f = e.dataTransfer && e.dataTransfer.files[0]; if (f) handleFile(f); });

  $("form").addEventListener("submit", onSubmit);
  $("copy-btn").addEventListener("click", copyResult);
  $("download-btn").addEventListener("click", downloadResult);
  $("print-btn").addEventListener("click", printResult);
  $("restart-btn").addEventListener("click", restart);
})();
