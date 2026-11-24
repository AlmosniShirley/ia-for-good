/* =====================================================================
   IA FOR GOOD — Coach d'entretien de recrutement (page coach-recrutement.html)
   1. Lecture d'un document dans le navigateur (PDF, DOCX, TXT)
   2. Envoi au relais Cloudflare (POST /analyze puis GET /result)
   3. Affichage du résultat (Markdown nettoyé par DOMPurify)
   Rien n'est stocké : ni cookie, ni base de données.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.COACH_RECRUTEMENT || {};
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

  /* ---------- 1. Lecture des documents (offre, CV) ---------- */
  function readPdf(file) {
    var pdfjs = window.pdfjsLib;
    if (!pdfjs) return Promise.reject(new Error("Lecteur PDF indisponible. Collez son texte dans le champ prévu."));
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
      if (!window.mammoth) return Promise.reject(new Error("Lecteur Word indisponible. Collez son texte."));
      return file.arrayBuffer().then(function (buf) { return window.mammoth.extractRawText({ arrayBuffer: buf }); }).then(function (r) { return r.value; });
    }
    if (name.endsWith(".txt") || name.endsWith(".md") || file.type.indexOf("text/") === 0) return file.text();
    if (name.endsWith(".doc")) return Promise.reject(new Error("Le format .doc n'est pas pris en charge : enregistrez le document en .docx ou en PDF."));
    return Promise.reject(new Error("Format non pris en charge. Utilisez un PDF, un .docx ou un fichier texte."));
  }

  function handleFile(file, k) {
    if (!file) return;
    var st = $(k + "-status");
    st.textContent = "Lecture de « " + file.name + " »…";
    readFile(file).then(function (text) {
      text = (text || "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
      st.textContent = text.length < 200
        ? "Peu de texte trouvé. S'il s'agit d'un document scanné, copiez-collez son texte ci-dessous."
        : "« " + file.name + " » lu. Relisez le texte ci-dessous : c'est exactement ce qui sera transmis.";
      $(k + "-text").value = text;
      updateCount(k);
    }).catch(function (e) { st.textContent = e.message || "Impossible de lire ce fichier."; });
  }

  function updateCount(k) {
    var n = $(k + "-text").value.trim().length;
    $(k + "-count").textContent = n ? n.toLocaleString("fr-FR") + " caractères" : "";
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
    var parts = ["Bonjour. Je suis candidat·e et je souhaite préparer un entretien de recrutement à partir des informations ci-dessous."];

    var ctx = [];
    if (val("poste")) ctx.push("- Poste visé : " + clean(val("poste")));
    if (val("entreprise")) ctx.push("- Entreprise : " + clean(val("entreprise")));
    if (val("type-entretien")) ctx.push("- Type d'entretien : " + val("type-entretien"));
    if (val("date-entretien")) ctx.push("- Date de l'entretien : " + val("date-entretien"));
    if (val("contexte")) ctx.push("### Ce que je sais déjà (interlocuteurs, format, étapes)\n" + clean(val("contexte")));
    parts.push("## 1. L'entretien\n" + (ctx.length ? ctx.join("\n") : "Non précisé."));

    parts.push("## 2. L'offre d'emploi\n" + clean(val("annonce-text")));
    parts.push("## 3. Mon CV\n" + (val("cv-text") ? clean(val("cv-text")) : "Non fourni. Signale-le dans la synthèse et appuie-toi sur ce que je dis de moi ci-dessous."));

    var moi = [];
    if (val("motivation")) moi.push("### Pourquoi ce poste m'intéresse\n" + clean(val("motivation")));
    if (val("exemples")) moi.push("### Expériences ou réussites que j'aimerais mettre en avant\n" + clean(val("exemples")));
    if (val("sensibles")) moi.push("### Points sensibles ou questions que je redoute\n" + clean(val("sensibles")));
    parts.push("## 4. Moi\n" + (moi.length ? moi.join("\n\n") : "Non précisé."));

    parts.push("Réponds en français, en Markdown, en t'adressant directement à moi. Commence par une section « ## Synthèse » de 4 à 6 lignes, puis une section de niveau 2 (##) par grande partie de ta méthode. N'invente aucune expérience, aucune réalisation ni aucun chiffre : appuie-toi uniquement sur mon CV et ce que je t'ai dit ; si une information manque, signale-le et propose comment la formuler honnêtement. Important : cette demande est unique, je ne pourrai pas te répondre. Livre donc la préparation complète en une seule réponse, sans étape de validation ni question finale qui attend une réponse : si une information manque, fais une hypothèse explicite, signale-la et poursuis. Inclus notamment ce que le recruteur cherche vraiment à vérifier, mon pitch de présentation, les questions probables avec des pistes de réponse fondées sur mes expériences réelles, la façon d'aborder mes points sensibles, les questions à poser au recruteur et une check-list pour la veille de l'entretien.");
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
    }, function () { throw new Error("Connexion impossible au Coach. Vérifiez votre connexion Internet, puis réessayez."); });
  }

  var ETAPES = [
    [6, "L'outil relit l'offre et votre parcours…"],
    [18, "Repérage de ce que le recruteur cherche à vérifier…"],
    [36, "Préparation de votre pitch et de vos réponses…"],
    [60, "Rédaction des questions à poser au recruteur…"],
    [90, "Toujours en cours : les préparations complètes prennent parfois un peu plus de temps…"],
  ];
  function poll(cId, n) {
    return new Promise(function (res) { setTimeout(res, POLL_MS); }).then(function () {
      return api("/result?c=" + encodeURIComponent(cId));
    }).then(function (data) {
      if (data.status === "done") return data.content || "";
      if (data.status === "error") throw new Error(data.error || "La préparation n'a pas abouti. Écrivez-moi : votre préparation sera recréditée.");
      if (n >= POLL_MAX) throw new Error("La préparation prend plus de temps que prévu. Écrivez-moi si le problème persiste.");
      ETAPES.forEach(function (e) { if (n === e[0]) $("progress-text").textContent = e[1]; });
      return poll(cId, n + 1);
    });
  }

  function setBusy(busy) {
    $("submit-btn").disabled = busy;
    $("form").hidden = busy;
    $("progress").hidden = !busy;
    if (busy) { $("progress-text").textContent = "Préparation en cours…"; $("progress").focus(); }
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

    if (val("annonce-text").length < 200) return showError("Ajoutez le texte de l'offre d'emploi (déposez-la ou collez-la au bloc 2).", $("annonce-text"));
    if (val("cv-text").length + val("exemples").length + val("motivation").length < 80) return showError("Ajoutez votre CV ou, à défaut, décrivez votre parcours et ce que vous aimeriez mettre en avant (bloc 4).", $("cv-text"));
    if (CODE_REQUIS && !val("access")) return showError("Saisissez votre code d'accès.", $("access"));
    if (!$("consent").checked) return showError("Cochez la case d'accord pour lancer la préparation.", $("consent"));
    var message = buildMessage();
    if (message.length > MAX) return showError("L'ensemble dépasse " + MAX.toLocaleString("fr-FR") + " caractères : raccourcissez vos textes ou les documents.", $("annonce-text"));

    lastRequest = {
      poste: [val("poste"), val("entreprise")].filter(Boolean).join(" · "),
      type: val("type-entretien"),
      cv: !!val("cv-text"),
    };
    setBusy(true);
    api("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, accessCode: val("access") }),
    }).then(function (data) {
      var rem = $("remaining");
      rem.hidden = typeof data.remaining !== "number";
      if (!rem.hidden) rem.textContent = data.remaining > 0 ? "Il vous reste " + data.remaining + " préparation" + (data.remaining > 1 ? "s" : "") + " avec ce code." : "C'était la préparation incluse avec ce code.";
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

  var lastRequest = {};
  function remplirSuites() {
    var sujet = "Coach d'entretien de recrutement — je souhaite être recontacté·e";
    var corps = "Bonjour Shirley,\n\nJ'ai utilisé le Coach d'entretien de recrutement sur IA FOR GOOD.\nJe souhaiterais échanger avec vous (simulation d'entretien ou préparation).\n\nPoste visé :\n\nDate de mon entretien :\n\nMes disponibilités :\n\n";
    $("recontact-btn").href = "mailto:" + (C.EMAIL || "") + "?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(corps);
    $("recontact-btn").closest(".recontact").hidden = !C.EMAIL;
    $("print-email").textContent = C.EMAIL || "";
  }

  function showResult(markdown) {
    // Retire les marqueurs de citation internes de Dust (ex. « :cite[bpe] »)
    markdown = String(markdown || "").replace(/[ \t]*:cite\[[^\]]*\]/g, "");
    lastMarkdown = markdown;
    $("sum-poste").textContent = lastRequest.poste || "Non précisé";
    $("sum-type").textContent = lastRequest.type || "Non précisé";
    $("sum-annonce").textContent = "Fournie";
    $("sum-cv").textContent = lastRequest.cv ? "Fourni" : "Non fourni";
    remplirSuites();
    $("print-date").textContent = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
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
    a.download = "preparation-entretien-recrutement.md";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    $("copy-status").textContent = "Fichier téléchargé (format Markdown).";
  }

  function printResult() {
    var d = new Date(), prev = document.title, pad = function (n) { return (n < 10 ? "0" : "") + n; };
    $("print-date").textContent = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    document.title = "Préparation entretien de recrutement IA FOR GOOD " + pad(d.getDate()) + "-" + pad(d.getMonth() + 1) + "-" + d.getFullYear();
    var restore = function () { document.title = prev; window.removeEventListener("afterprint", restore); };
    window.addEventListener("afterprint", restore);
    $("copy-status").textContent = "Dans la fenêtre qui s'ouvre, choisissez « Enregistrer au format PDF » comme destination.";
    setTimeout(function () { window.print(); }, 50);
  }

  function restart() {
    $("result").hidden = true;
    $("result-body").innerHTML = "";
    $("copy-status").textContent = "";
    lastMarkdown = "";
    $("app").hidden = false;
    setBusy(false);
    $("poste").focus();
    $("outil").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Initialisation ---------- */
  if (!API) { $("app").hidden = true; $("ferme").hidden = false; return; }
  if (!CODE_REQUIS) $("code-wrap").hidden = true;
  if (C.LIEN_CODE) $("code-aide").innerHTML = 'Pas encore de code ? <a href="' + encodeURI(C.LIEN_CODE) + '" target="_blank" rel="noopener">Obtenez-le ici</a>.';

  ["annonce", "cv"].forEach(function (k) {
    var fi = $(k + "-file"), dz = $(k + "-dropzone");
    fi.addEventListener("change", function () { handleFile(fi.files[0], k); });
    $(k + "-text").addEventListener("input", function () { updateCount(k); });
    ["dragenter", "dragover"].forEach(function (t) { dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.add("survol"); }); });
    ["dragleave", "drop"].forEach(function (t) { dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.remove("survol"); }); });
    dz.addEventListener("drop", function (e) { var f = e.dataTransfer && e.dataTransfer.files[0]; if (f) handleFile(f, k); });
  });

  $("form").addEventListener("submit", onSubmit);
  $("copy-btn").addEventListener("click", copyResult);
  $("download-btn").addEventListener("click", downloadResult);
  $("print-btn").addEventListener("click", printResult);
  $("restart-btn").addEventListener("click", restart);
})();
