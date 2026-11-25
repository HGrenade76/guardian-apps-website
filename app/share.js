/* MileGuard shared report viewer. Reads one snapshot from MileGuard's public iCloud database by the
   random name in the link's #fragment (the fragment never reaches a server). No sign-in needed. */
(function () {
  "use strict";
  const CFG = window.MG_CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const t = (location.hash || "").replace(/^#/, "").replace(/[^0-9a-f]/gi, "");
  const view = $("#view");
  const stop = (title, text) => { view.innerHTML = `<div class="card empty"><b>${esc(title)}</b>${esc(text)}</div>`; };

  function show(snap, exp) {
    const money = (n) => (n || 0).toLocaleString(snap.loc || "en-US", { style: "currency", currency: snap.cur || "USD" });
    const date = (ms) => new Date(ms).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const money2 = new Set([9, 10, 11, 12]);
    const rows = snap.rows || [];
    const shown = rows.slice(0, 500);
    view.innerHTML = `<div class="card">
      <div class="topbar"><div><h1 style="font-size:24px">${esc(snap.title)}</h1>
        <div class="meta">${esc([snap.by, snap.scope].filter(Boolean).join(" · "))}</div>
        <div class="meta">Made ${date(snap.made)} · link works until ${date(exp)}</div></div>
        <div class="right"><button class="btn" id="csv">CSV</button><button class="btn primary" id="pdf">PDF</button></div></div>
      <table class="sumtable" style="margin-top:16px;max-width:560px"><tbody>${(snap.sum || []).map((p) => `<tr><td>${esc(p[0])}</td><td>${esc(p[1])}</td></tr>`).join("")}</tbody></table>
    </div>
    ${rows.length ? `<div class="card" style="padding:0;overflow:hidden"><div class="table-wrap"><table><thead><tr>${snap.head.map((h, i) => `<th class="${i >= 5 && i !== 6 && i !== 7 && i !== 8 ? "n" : ""}">${esc(h)}</th>`).join("")}</tr></thead><tbody>
      ${shown.map((r) => `<tr>${r.map((v, i) => `<td class="${i >= 5 && i !== 6 && i !== 7 && i !== 8 ? "n" : ""}">${esc(money2.has(i) ? (v ? money(v) : "") : v)}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div></div>${rows.length > shown.length ? `<p class="hint">Showing ${shown.length} of ${rows.length}. The CSV and PDF have them all.</p>` : ""}` : ""}`;
    const stem = "MileGuard-" + snap.title.replace(/[^A-Za-z0-9]+/g, "-").replace(/-+$/, "");
    $("#csv").onclick = () => {
      const cell = (v) => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
      const lines = [snap.head.map(cell).join(","), ...rows.map((r) => r.map(cell).join(",")), "", "Summary", ...(snap.sum || []).map((p) => p.map(cell).join(","))];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + lines.join("\n") + "\n"], { type: "text/csv;charset=utf-8" }));
      a.download = stem + ".csv"; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 500);
    };
    $("#pdf").onclick = async () => {
      const load = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
      if (!window.jspdf) { await load("vendor/jspdf.umd.min.js"); await load("vendor/jspdf.plugin.autotable.min.js"); }
      const doc = new window.jspdf.jsPDF({ orientation: rows.length ? "landscape" : "portrait", unit: "pt", format: "letter" });
      doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(snap.title, 40, 50);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(91, 103, 99);
      doc.text([snap.by, snap.scope, "Made with MileGuard on " + date(snap.made)].filter(Boolean).join("  ·  "), 40, 66);
      doc.autoTable({ startY: 84, body: snap.sum || [], theme: "plain", tableWidth: 360, styles: { fontSize: 10, cellPadding: 3 }, columnStyles: { 1: { halign: "right", fontStyle: "bold" } } });
      if (rows.length) doc.autoTable({ startY: doc.lastAutoTable.finalY + 16, head: [snap.head], body: rows.map((r) => r.map((v, i) => (money2.has(i) ? (v ? Number(v).toFixed(2) : "") : v))),
        styles: { fontSize: 7.5, cellPadding: 3 }, headStyles: { fillColor: [14, 138, 99], textColor: 255 }, alternateRowStyles: { fillColor: [246, 248, 247] } });
      doc.save(stem + ".pdf");
    };
  }

  function demo() {
    try {
      const x = JSON.parse(localStorage.getItem("mg-demo-share-" + t) || "null");
      if (x && x.exp > Date.now()) { show(x.snap, x.exp); return true; }
    } catch (e) {}
    return false;
  }

  async function start() {
    if (!t) return stop("This link isn't complete", "Ask the person who sent it for the full link.");
    if (demo()) return;
    if (!window.CloudKit || !CFG.apiToken) return stop("Couldn't load the report", "Check your connection and try again.");
    CloudKit.configure({ containers: [{ containerIdentifier: CFG.container, apiTokenAuth: { apiToken: CFG.apiToken }, environment: CFG.environment || "production" }] });
    try {
      const res = await CloudKit.getDefaultContainer().publicCloudDatabase.fetchRecords([{ recordName: t }]);
      const r = res.records && res.records[0];
      if (!r || r.serverErrorCode || !r.fields) return stop("This link has been turned off", "It expired or the person who shared it turned it off. Ask them for a new one.");
      const exp = r.fields.expires && r.fields.expires.value;
      if (exp && exp < Date.now()) return stop("This link has expired", "Ask the person who shared it for a new one.");
      show(JSON.parse(r.fields.payload.value), exp);
    } catch (e) {
      console.error(e);
      stop("Couldn't load the report", "Check your connection and try again.");
    }
  }

  if (demo()) return;
  if (window.CloudKit) start();
  else {
    window.addEventListener("cloudkitloaded", start);
    setTimeout(() => { if (!window.CloudKit && !demo()) stop("Couldn't load the report", "Check your connection, or turn off any content blocker for this page, then reload."); }, 12000);
  }
})();
