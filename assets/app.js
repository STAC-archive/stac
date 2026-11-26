
/* STAC – How the website works.
   The data (all READMEs) and settings come from index.html,
   which GitHub generates automatically from the READMEs when publishing. */
const SITE = window.STAC_SITE;
const DATA = window.STAC_DATA;

const ON_COLOR = { "Personality and Individual Differences": "var(--ink)" };
const COLORS = { "Art and Aesthetics": "var(--art)", "Creativity": "var(--creativity)", "Personality and Individual Differences": "var(--personality)" };
const FORMAT_ORDER = ["PDF", "Word", "Qualtrics", "MediaLab", "Excel", "Archive", "Image"];
const VIEW_NAMES = { list: "List", grid: "Tiles", folders: "Folders" };
const VIEWS = (SITE.views || ["list"]).filter(v => VIEW_NAMES[v]);
if (!VIEWS.length) VIEWS.push("list");
const state = { section: null, sub: null, lang: "", fmt: "", q: "", view: VIEWS.includes(SITE.defaultView) ? SITE.defaultView : VIEWS[0] };
try { const v = localStorage.getItem("stac-view"); if (VIEWS.includes(v)) state.view = v; } catch {}
const openFolders = new Set();
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const formatsOf = it => FORMAT_ORDER.filter(f => it.files.some(x => x.fmt === f));
const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
const fileUrl = p => p.split("/").map(encodeURIComponent).join("/");
const FMT = { ".pdf": "PDF", ".docx": "Word", ".doc": "Word", ".qsf": "Qualtrics", ".que": "MediaLab", ".xlsx": "Excel", ".zip": "Archive", ".jpg": "Image", ".jpeg": "Image", ".png": "Image" };
const SECTION_ORDER = SITE.sections || [];
DATA.forEach(it => {
  it.acronym = it.acronym || "";
  it.languages = it.languages || [];
  it.groups = it.groups || [];  /* sub-folders between section and measure, e.g. ["Tasks", "Divergent Thinking"] */
  it.text = it.text || "";
  it.files.forEach(f => { f.fmt = FMT[(f.ext || "").toLowerCase()] || "Other"; f.href = SITE.base + fileUrl(f.path); });
  it.files.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
});
const sortKey = s => s.toLowerCase().replace(/^["\s]+/, "");
DATA.sort((a, b) => (SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section)) || sortKey(a.title).localeCompare(sortKey(b.title)));
const allLangs = [...new Set(DATA.flatMap(i => i.languages))];
const fileCount = DATA.reduce((n, i) => n + i.files.length, 0);

async function copyText(text, statusEl) {
  try { await navigator.clipboard.writeText(text); statusEl.textContent = "Copied"; }
  catch { statusEl.textContent = "Select the text to copy it"; }
}
function sectionBoxes() {
  return `<ul class="sections">${SITE.sections.map(s => {
    const n = DATA.filter(i => i.section === s).length;
    return `<li><button class="section-btn" style="--c:${COLORS[s]};--on-c:${ON_COLOR[s] || "#fff"}" data-section="${esc(s)}" aria-pressed="${state.section === s}">
      <span class="count">${n}</span><span class="name">${esc(s)}</span></button></li>`;
  }).join("")}</ul>`;
}

/* ---------- Tab 1: Welcome ---------- */
function renderWelcome() {
  const a = SITE.article;
  $("#main").innerHTML = `
    <section class="hero">
      <h1 class="wordmark">STAC</h1>
      <p class="fullname">Scales and Tasks for Art and Creativity Assessment</p>
      <p class="facts">${DATA.length} measures, ${fileCount} files, ${allLangs.length} languages. Free for academic and non-commercial use.</p>
      <div class="cta">
        <a class="btn big" href="#measures">Browse measures</a>
        <a class="btn big secondary" href="#contribute">Contribute a measure</a>
      </div>
    </section>

    ${sectionBoxes()}

    <div class="about welcome-text">
      ${SITE.welcomeSections.map(s => `<h2>${esc(s.heading)}</h2>${s.html}`).join("")}
    </div>

    <div class="article-strip">
      <p><strong>The STAC article:</strong> ${esc(a.authors)} (2026). ${esc(a.title)}. <em>${esc(a.journal)}</em>, ${esc(a.volume)}.</p>
      <div class="actions">
        <a class="btn secondary" href="${esc(a.doi)}">Read the article</a>
        ${SITE.preview ? `<a class="btn secondary" aria-disabled="true">Download PDF</a>` : `<a class="btn secondary" href="${esc(SITE.base + "/" + fileUrl(a.pdf))}" download>Download PDF</a>`}
      </div>
    </div>
    <p class="supported">${esc(SITE.supported)}</p>`;
  bindSectionBoxes(true);
}

/* ---------- Tab 2: Measures ---------- */
function renderList() {
  const langs = [...allLangs].sort();
  /* Buttons for the first level of sub-folders of the chosen section */
  const subs = [...new Set(DATA.filter(i => i.section === state.section && i.groups.length).map(i => i.groups[0]))].sort();
  $("#main").innerHTML = `
    <header class="masthead">
      <h1 class="detail-acr" style="font-size:44px">Measures</h1>
      <p class="intro">Search or pick a section, then open a measure to read how to use it and download its files.</p>
    </header>
    ${sectionBoxes()}
    ${subs.length ? `<div class="subs">${subs.map(s =>
      `<button class="sub-btn" data-sub="${esc(s)}" aria-pressed="${state.sub === s}">${esc(s)}</button>`).join("")}</div>` : ""}
    <div class="controls">
      <input class="search" id="q" type="search" placeholder="Search by name, acronym or topic" aria-label="Search" value="${esc(state.q)}">
      <select id="lang" aria-label="Language"><option value="">All languages</option>
        ${langs.map(l => `<option ${state.lang === l ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>
      <select id="fmt" aria-label="File format"><option value="">All formats</option>
        ${FORMAT_ORDER.map(f => `<option ${state.fmt === f ? "selected" : ""}>${f}</option>`).join("")}</select>
    </div>
    <div class="status"><span id="count"></span>
      <span class="status-right"><span id="reset"></span>
        ${VIEWS.length > 1 ? `<span class="view-toggle" role="group" aria-label="View">
          ${VIEWS.map(v => `<button type="button" data-view="${v}" aria-pressed="${state.view === v}">${VIEW_NAMES[v]}</button>`).join("")}
        </span>` : ""}
      </span>
    </div>
    <ul class="list ${state.view}" id="list"></ul>`;
  $("#main").querySelectorAll(".view-toggle button").forEach(b => b.onclick = () => {
    state.view = b.dataset.view;
    try { localStorage.setItem("stac-view", state.view); } catch {}
    $("#list").className = "list " + state.view;
    fillList(DATA.filter(matches));
    $("#main").querySelectorAll(".view-toggle button").forEach(x => x.setAttribute("aria-pressed", x.dataset.view === state.view));
  });
  fillList(DATA.filter(matches));
  bindSectionBoxes(false);
  $("#main").querySelectorAll(".sub-btn").forEach(b => b.onclick = () => {
    state.sub = state.sub === b.dataset.sub ? null : b.dataset.sub; renderList();
  });
  $("#q").oninput = e => { state.q = e.target.value; fillList(DATA.filter(matches)); };
  $("#lang").onchange = e => { state.lang = e.target.value; fillList(DATA.filter(matches)); };
  $("#fmt").onchange = e => { state.fmt = e.target.value; fillList(DATA.filter(matches)); };
}
function bindSectionBoxes(goToList) {
  $("#main").querySelectorAll(".section-btn").forEach(b => b.onclick = () => {
    if (goToList) { Object.assign(state, { section: b.dataset.section, sub: null, lang: "", fmt: "", q: "" }); location.hash = "measures"; return; }
    state.section = state.section === b.dataset.section ? null : b.dataset.section; state.sub = null; renderList();
  });
}
function matches(it) {
  if (state.section && it.section !== state.section) return false;
  if (state.sub && it.groups[0] !== state.sub) return false;
  if (state.lang && !it.languages.includes(state.lang)) return false;
  if (state.fmt && !it.files.some(f => f.fmt === state.fmt)) return false;
  if (state.q) {
    const words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = (it.acronym + " " + it.title + " " + it.text).toLowerCase();
    if (!words.every(w => hay.includes(w))) return false;
  }
  return true;
}
function fillList(hits) {
  const filtered = state.section || state.sub || state.lang || state.fmt || state.q;
  $("#count").textContent = filtered ? `${hits.length} of ${plural(DATA.length, "measure")}` : plural(DATA.length, "measure");
  $("#reset").innerHTML = filtered ? `<button class="linkish" id="clear">Clear filters</button>` : "";
  if ($("#clear")) $("#clear").onclick = clearFilters;
  if (state.view === "folders" && hits.length) { $("#list").innerHTML = folderTree(hits, filtered); bindFolders(); return; }
  $("#list").innerHTML = hits.length ? hits.map(it => `
    <li class="row" style="--c:${COLORS[it.section]}"><a href="#${it.id}">
      <span class="name"><span class="title">${esc(it.title)}</span>${it.acronym ? ` <span class="acr">${esc(it.acronym)}</span>` : ""}</span>
      <span class="meta">${esc([it.groups.join(" › "), it.languages.join(", ")].filter(Boolean).join(" – "))}</span>
      <span class="formats">${formatsOf(it).map(f => `<span class="fmt">${f}</span>`).join("")}</span>
    </a></li>`).join("")
    : `<li class="empty">No measures match these filters.<br><br><button class="btn secondary" id="clear2">Clear filters</button></li>`;
  if ($("#clear2")) $("#clear2").onclick = clearFilters;
}
/* ---------- Folder view (like on OSF) ---------- */
const FOLDER_ICON = `<svg class="ficon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2h8A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/></svg>`;
function folderTree(hits, filtered) {
  const leaf = it => `<li class="leaf"><a href="#${it.id}">
      <span class="name"><span class="title">${esc(it.title)}</span>${it.acronym ? ` <span class="acr">${esc(it.acronym)}</span>` : ""}</span>
      <span class="meta">${esc(it.languages.join(", "))}</span></a></li>`;
  const folder = (key, name, count, inner, color) => !count ? "" : `
    <li class="folder"${color ? ` style="--c:${color}"` : ""}><details data-key="${esc(key)}"${filtered || openFolders.has(key) ? " open" : ""}>
      <summary>${FOLDER_ICON}<span class="fname">${esc(name)}</span><span class="fcount">${count}</span></summary>
      <ul>${inner}</ul></details></li>`;
  /* Build the tree from the folder path of each measure: section > sub-folders > measure */
  const tree = { folders: {}, items: [] };
  hits.forEach(it => {
    let node = tree;
    [it.section, ...it.groups].forEach(name => node = node.folders[name] = node.folders[name] || { folders: {}, items: [] });
    node.items.push(it);
  });
  const total = node => node.items.length + Object.values(node.folders).reduce((n, f) => n + total(f), 0);
  /* Sub-folders first (A to Z), then the measures */
  const inner = (node, key) => Object.keys(node.folders).sort((a, b) => a.localeCompare(b))
      .map(name => folder(key + "/" + name, name, total(node.folders[name]), inner(node.folders[name], key + "/" + name))).join("")
    + node.items.map(leaf).join("");
  return SITE.sections.filter(sec => tree.folders[sec])
    .map(sec => folder(sec, sec, total(tree.folders[sec]), inner(tree.folders[sec], sec), COLORS[sec])).join("");
}
function bindFolders() {
  $("#list").querySelectorAll("details").forEach(d => d.addEventListener("toggle", () => {
    d.open ? openFolders.add(d.dataset.key) : openFolders.delete(d.dataset.key);
  }));
}
function clearFilters() { Object.assign(state, { section: null, sub: null, lang: "", fmt: "", q: "" }); renderList(); }

/* ---------- Page of a single measure ---------- */
function renderDetail(it) {
  const pdfLink = f => SITE.preview
    ? `<a class="btn secondary" aria-disabled="true" title="Works once the site is online">View</a>`
    : `<a class="btn secondary" href="${esc(f.href)}" target="_blank" rel="noopener">View</a>`;
  const dlLink = f => SITE.preview
    ? `<a class="btn" aria-disabled="true" title="Works once the site is online">Download</a>`
    : `<a class="btn" href="${esc(f.href)}" download>Download</a>`;
  $("#main").innerHTML = `
    <a class="back" href="#measures">Back to all measures</a>
    <article style="--c:${COLORS[it.section]}">
      <div class="detail-head">
        <p class="detail-section">${esc([it.section, ...it.groups].join(" › "))}</p>
        <h1 class="detail-acr">${esc(it.acronym || it.title)}</h1>
        ${it.acronym ? `<p class="detail-title">${esc(it.title)}</p>` : ""}
        ${it.languages.length ? `<p class="detail-langs">Available in ${esc(it.languages.join(", "))}</p>` : ""}
        <p class="downloads" id="dlCount" title="Includes ${it.osf.toLocaleString("en-US")} downloads on OSF until ${esc(SITE.osfDate)}"><strong>${it.osf.toLocaleString("en-US")}</strong> downloads</p>
      </div>
      <div class="detail-grid">
        <div class="readme" id="readme"><p class="loading">Loading…</p></div>
        <aside class="files" aria-label="Files">
          <h2>${plural(it.files.length, "file")}</h2>
          ${it.files.map(f => `<div class="file"><span class="fname">${esc(f.name)}</span>
            <div class="actions"><span class="fmt">${f.fmt}</span>${dlLink(f)}${f.fmt === "PDF" ? pdfLink(f) : ""}</div></div>`).join("")}
          ${SITE.repo ? `<a class="github" href="${esc(SITE.repo)}/tree/main/${fileUrl(it.path)}">See this folder on GitHub</a>` : ""}
        </aside>
      </div>
    </article>`;
  $("#main").querySelectorAll("a[download]").forEach(a => a.addEventListener("click", () => countDownload(it, a)));
  showDownloads(it);
  loadReadme(it);
}

/* Load the README text (GitHub turns every README into a small page) */
const readmeCache = {};
async function loadReadme(it) {
  let html = readmeCache[it.id];
  if (!html) {
    try {
      const r = await fetch(it.url);
      if (!r.ok) throw new Error(r.status);
      const doc = new DOMParser().parseFromString(await r.text(), "text/html");
      const box = doc.getElementById("readme-content");
      const h1 = box && box.querySelector("h1");
      if (h1) h1.remove();
      html = readmeCache[it.id] = box ? box.innerHTML : "";
    } catch {
      html = `<p>The description could not be loaded. You can read it <a href="${esc(SITE.repo ? SITE.repo + "/tree/main/" + fileUrl(it.path) : it.url)}">on GitHub</a>.</p>`;
    }
  }
  const el = $("#readme");
  if (el && location.hash.slice(1) === it.id) el.innerHTML = html;
}

/* ---------- Download counter ----------
   Starting value = downloads on OSF (until the move to GitHub).
   New downloads counted by GoatCounter are added on top. */
const counterPath = it => "download/" + it.id;
function countDownload(it, link) {
  if (window.goatcounter && window.goatcounter.count)
    window.goatcounter.count({ path: counterPath(it), title: link.closest(".file")?.querySelector(".fname")?.textContent || it.title, event: true });
}
async function showDownloads(it) {
  if (!SITE.goatcounter) return;
  let extra = 0;
  try {
    const r = await fetch(`https://${SITE.goatcounter}.goatcounter.com/counter/${encodeURIComponent(counterPath(it))}.json`);
    if (r.ok) extra = parseInt(String((await r.json()).count).replace(/\D/g, ""), 10) || 0;
  } catch { /* counter not reachable: show the OSF value only */ }
  const el = $("#dlCount strong");
  if (el && location.hash.slice(1) === it.id) el.textContent = (it.osf + extra).toLocaleString("en-US");
}

/* ---------- Tab 3: Contribute ---------- */
function renderContribute() {
  const c = SITE.contact;
  $("#main").innerHTML = `
    <div class="about">
      <h1>Contribute</h1>
      ${SITE.contributeSections.map(s => `<h2>${esc(s.heading)}</h2>${s.html}`).join("")}

      <h2>README template</h2>
      <p>The block between the two <code>---</code> lines is used for search and filters on this website. Keep its structure and replace the text in brackets.</p>
      <div class="template">
        <pre id="tpl">Loading…</pre>
        <div class="actions">
          <button class="btn" id="copyTpl" type="button">Copy template</button>
          ${SITE.templateUrl ? `<a class="btn secondary" href="${esc(SITE.templateUrl)}">Open template file</a>` : ""}
          <span id="tplCopied" role="status"></span>
        </div>
      </div>

      <h2>Contact</h2>
      <ul class="people">
        ${c.people.map(p => `<li><strong>${esc(p.name)}</strong><span>${esc(p.place)}</span>${p.email ? `<br><span>${esc(p.email)}</span>` : ""}</li>`).join("")}
      </ul>
    </div>`;
  $("#copyTpl").onclick = () => copyText($("#tpl").textContent, $("#tplCopied"));
  $("#main").querySelectorAll('a[href="#tpl"]').forEach(a => a.onclick = e => { e.preventDefault(); $("#tpl").scrollIntoView({ behavior: "smooth" }); });
  loadTemplate();
}
async function loadTemplate() {
  let text = "";
  try { const r = await fetch(SITE.templateUrl); if (r.ok) text = await r.text(); } catch {}
  const el = $("#tpl");
  if (el) el.textContent = text || "The template could not be loaded. Use the button below to open it.";
}

/* ---------- Which page is shown? ---------- */
function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  const it = DATA.find(i => i.id === h);
  const tab = it ? "measures" : (h === "about" ? "contribute" : (["measures", "contribute"].includes(h) ? h : "welcome"));
  document.querySelectorAll(".tabs a").forEach(a => a.toggleAttribute("aria-current", false));
  document.querySelector(`.tabs a[data-tab="${tab}"]`).setAttribute("aria-current", "page");
  if (it) renderDetail(it);
  else if (tab === "measures") renderList();
  else if (tab === "contribute") renderContribute();
  else renderWelcome();
  $("#main").querySelectorAll('[aria-disabled="true"]').forEach(a => a.onclick = e => e.preventDefault());
  window.scrollTo(0, 0);
}

$("#citeText").textContent = SITE.citation;
$("#copyCite").onclick = () => copyText(SITE.citation, $("#copied"));
if (SITE.goatcounter) {
  const s = document.createElement("script");
  s.async = true; s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${SITE.goatcounter}.goatcounter.com/count`;
  s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
  document.head.appendChild(s);
}
window.addEventListener("hashchange", route);
route();
