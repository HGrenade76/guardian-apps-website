/* DECISIO on the web.
   Reads the person's own meetings from their private iCloud database with CloudKit JS. The iPhone app
   stores them with SwiftData mirrored to CloudKit, so records are CD_<Model> with CD_<field> values in
   the zone com.apple.coredata.cloudkit.zone. We read the v1 store (SessionModel, ActionModel,
   DecisionModel, RiskModel), which is what the app's own screens use. No Guardian Apps server is involved.
   Recordings live in iCloud Drive, which the web can't reach, so playback isn't here yet. */
(function () {
  "use strict";

  const CFG = window.DX_CONFIG || {};
  const ZONE = { zoneName: "com.apple.coredata.cloudkit.zone" };
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const I = {
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
  };

  // ---------- dates ----------
  const DAY = 86400000;
  const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const today0 = () => startOfDay(new Date());
  const fmtDate = (d) => d ? d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric" }) : "";
  const fmtDay = (d) => d ? d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) : "";
  const fmtTime = (d) => d ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "";
  const fmtDur = (s) => { s = Math.round(s || 0); if (s < 60) return s ? `${s}s` : ""; const m = Math.round(s / 60); return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`; };
  const isoDay = (d) => d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "";
  const relDue = (d) => {
    if (!d) return "";
    const n = Math.round((startOfDay(d) - today0()) / DAY);
    if (n === 0) return "Due today";
    if (n === 1) return "Due tomorrow";
    if (n === -1) return "1 day overdue";
    if (n < 0) return `${-n} days overdue`;
    if (n < 7) return `Due ${d.toLocaleDateString(undefined, { weekday: "long" })}`;
    return `Due ${fmtDate(d)}`;
  };

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.h);
    toast.h = setTimeout(() => t.classList.remove("show"), 3200);
  }

  // ---------- decoding SwiftData values ----------
  // [String] properties arrive as BYTES: a binary property list (or keyed archive), sometimes JSON.
  function b64bytes(s) { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }

  function bplist(b) {
    const n = b.length, dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const offSize = b[n - 26], refSize = b[n - 25];
    const uint = (o, sz) => { let v = 0; for (let i = 0; i < sz; i++) v = v * 256 + b[o + i]; return v; };
    const numObj = uint(n - 24, 8), top = uint(n - 16, 8), tableOff = uint(n - 8, 8);
    const offsets = []; for (let i = 0; i < numObj; i++) offsets.push(uint(tableOff + i * offSize, offSize));
    const seen = new Map();
    function len(o, low) {
      if (low !== 0xF) return [low, o + 1];
      const m = b[o + 1], sz = 1 << (m & 0xF);
      return [uint(o + 2, sz), o + 2 + sz];
    }
    function obj(i) {
      if (seen.has(i)) return seen.get(i);
      const o = offsets[i], m = b[o], hi = m >> 4, low = m & 0xF;
      let v;
      switch (hi) {
        case 0x0: v = low === 8 ? false : low === 9 ? true : null; break;
        case 0x1: v = uint(o + 1, 1 << low); break;
        case 0x2: v = low === 2 ? dv.getFloat32(o + 1) : dv.getFloat64(o + 1); break;
        case 0x3: v = new Date((dv.getFloat64(o + 1) + 978307200) * 1000); break;
        case 0x4: { const [l, s] = len(o, low); v = b.slice(s, s + l); break; }
        case 0x5: { const [l, s] = len(o, low); v = new TextDecoder("ascii").decode(b.slice(s, s + l)); break; }
        case 0x6: { const [l, s] = len(o, low); let t = ""; for (let k = 0; k < l; k++) t += String.fromCharCode(uint(s + k * 2, 2)); v = t; break; }
        case 0x7: { const [l, s] = len(o, low); v = new TextDecoder().decode(b.slice(s, s + l)); break; }
        case 0x8: v = { UID: uint(o + 1, low + 1) }; break;
        case 0xA: case 0xC: { const [l, s] = len(o, low); v = []; seen.set(i, v); for (let k = 0; k < l; k++) v.push(obj(uint(s + k * refSize, refSize))); return v; }
        case 0xD: { const [l, s] = len(o, low); v = {}; seen.set(i, v); for (let k = 0; k < l; k++) v[obj(uint(s + k * refSize, refSize))] = obj(uint(s + (l + k) * refSize, refSize)); return v; }
        default: v = null;
      }
      seen.set(i, v);
      return v;
    }
    return obj(top);
  }

  // NSKeyedArchiver output: resolve UIDs back into plain arrays and strings.
  function unarchive(p) {
    if (!p || typeof p !== "object" || !p.$objects || !p.$top) return p;
    const objs = p.$objects;
    const res = (x) => {
      if (x && typeof x === "object" && "UID" in x) x = objs[x.UID];
      if (x === "$null") return null;
      if (Array.isArray(x)) return x.map(res);
      if (x && typeof x === "object") {
        if (x["NS.objects"]) return x["NS.objects"].map(res);
        if (x["NS.string"] != null) return x["NS.string"];
        return x;
      }
      return x;
    };
    const root = p.$top.root || Object.values(p.$top)[0];
    return res(root);
  }

  function list(v) {
    if (v == null) return [];
    if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
    if (typeof v !== "string") return [];
    try {
      const b = b64bytes(v);
      const head = new TextDecoder().decode(b.slice(0, 8));
      let out;
      if (head === "bplist00") out = unarchive(bplist(b));
      else {
        const s = new TextDecoder().decode(b).trim();
        out = s.startsWith("[") || s.startsWith("{") ? JSON.parse(s) : [s];
      }
      return Array.isArray(out) ? out.filter((x) => typeof x === "string" && x.trim()) : [];
    } catch (e) { return []; }
  }

  // ---------- CloudKit ----------
  const F = (r, k) => { const f = r.fields && r.fields["CD_" + k]; return f ? f.value : undefined; };
  const str = (r, k) => F(r, k) || "";
  const num = (r, k) => Number(F(r, k) || 0);
  const bool = (r, k) => !!Number(F(r, k) || 0);
  const date = (r, k) => { const v = F(r, k); return v == null ? null : new Date(v); };

  const KEYS = {
    SessionModel: ["id", "title", "date", "duration", "statusRaw", "confidentialityRaw", "participants", "summary", "openQuestions",
      "beforeNextMeeting", "strategicThemes", "leadershipImplication", "audioURLString", "isArchived"],
    ActionModel: ["id", "actionDescription", "owner", "ownerEmail", "dueDate", "statusRaw", "priorityRaw", "notes", "timestamp",
      "completedDate", "originalDueDate", "rescheduleCount", "isDueDateConfirmed", "isArchived", "session"],
    DecisionModel: ["id", "statement", "timestamp", "statusRaw", "tags", "notes", "session"],
    RiskModel: ["id", "riskDescription", "typeRaw", "session"],
  };
  const DESIRED = [...new Set(Object.values(KEYS).flat())].map((k) => "CD_" + k);

  function sessionFrom(r) {
    return {
      rec: r.recordName, id: str(r, "id"), title: str(r, "title") || "Untitled meeting", date: date(r, "date") || new Date(0),
      duration: num(r, "duration"), status: str(r, "statusRaw") || "Complete", conf: str(r, "confidentialityRaw"),
      participants: list(F(r, "participants")), summary: list(F(r, "summary")), openQuestions: list(F(r, "openQuestions")),
      beforeNext: list(F(r, "beforeNextMeeting")), themes: list(F(r, "strategicThemes")),
      implication: str(r, "leadershipImplication"), hasAudio: !!str(r, "audioURLString"), archived: bool(r, "isArchived"),
    };
  }
  function actionFrom(r) {
    return {
      rec: r.recordName, tag: r.recordChangeTag, id: str(r, "id"), text: str(r, "actionDescription"), owner: str(r, "owner"),
      ownerEmail: str(r, "ownerEmail"), due: date(r, "dueDate"), status: str(r, "statusRaw") || "Open", priority: str(r, "priorityRaw") || "Medium",
      notes: str(r, "notes"), timestamp: str(r, "timestamp"), completed: date(r, "completedDate"), originalDue: date(r, "originalDueDate"),
      reschedules: num(r, "rescheduleCount"), confirmed: bool(r, "isDueDateConfirmed"), archived: bool(r, "isArchived"), session: str(r, "session"),
      mod: (r.modified && r.modified.timestamp) || 0,
    };
  }
  const decisionFrom = (r) => ({ rec: r.recordName, id: str(r, "id"), text: str(r, "statement"), timestamp: str(r, "timestamp"),
    status: str(r, "statusRaw") || "Active", tags: list(F(r, "tags")), notes: str(r, "notes"), session: str(r, "session"),
    mod: (r.modified && r.modified.timestamp) || 0 });
  const riskFrom = (r) => ({ rec: r.recordName, text: str(r, "riskDescription"), type: str(r, "typeRaw") || "Stated", session: str(r, "session") });

  const authErr = (e) => /AUTHENTICATION|NOT_AUTHENTICATED|ACCESS_DENIED|AUTH_PERSIST/i.test((e && (e.ckErrorCode || e.serverErrorCode || e.message)) || "");

  const Cloud = {
    db: null, token: null, _recs: {},

    async start() { this.db = CloudKit.getDefaultContainer().privateCloudDatabase; },

    async load() {
      let more = true, rounds = 0;
      while (more && rounds++ < 300) {
        const res = await this.db.fetchRecordZoneChanges([{ zoneID: ZONE, syncToken: this.token || undefined, desiredKeys: DESIRED, resultsLimit: 400 }]);
        if (res.hasErrors) {
          const e = res.errors[0];
          if (e && /ZONE_NOT_FOUND|NOT_FOUND/.test(e.ckErrorCode || e.serverErrorCode || "")) return { empty: true };
          throw e;
        }
        const z = res.zones[0];
        for (const r of z.records || []) {
          if (r.deleted) delete this._recs[r.recordName];
          else this._recs[r.recordName] = r;
        }
        this.token = z.syncToken;
        more = !!z.moreComing;
      }
      return this.build();
    },

    build() {
      const out = { sessions: [], actions: [], decisions: [], risks: [] };
      for (const r of Object.values(this._recs)) {
        switch (r.recordType) {
          case "CD_SessionModel": out.sessions.push(sessionFrom(r)); break;
          case "CD_ActionModel": out.actions.push(actionFrom(r)); break;
          case "CD_DecisionModel": out.decisions.push(decisionFrom(r)); break;
          case "CD_RiskModel": out.risks.push(riskFrom(r)); break;
        }
      }
      if (!out.sessions.length && !out.actions.length) out.empty = true;
      return out;
    },

    // Long text is kept inline, or as an asset once it passes CloudKit's field size.
    async text(rec, field) {
      const res = await this.db.fetchRecords([{ recordName: rec }], { zoneID: ZONE, desiredKeys: ["CD_" + field, "CD_" + field + "_ckAsset"] });
      const r = res.records && res.records[0];
      if (!r || !r.fields) return "";
      const inline = r.fields["CD_" + field] && r.fields["CD_" + field].value;
      if (inline) return inline;
      const asset = r.fields["CD_" + field + "_ckAsset"] && r.fields["CD_" + field + "_ckAsset"].value;
      if (!asset || !asset.downloadURL) return "";
      const url = asset.downloadURL.replace("${f}", field + ".txt");
      try {
        const resp = await fetch(url);
        const buf = new Uint8Array(await resp.arrayBuffer());
        return new TextDecoder().decode(buf);
      } catch (e) { return { url }; }
    },

    async saveDecision(d, changes) {
      const fields = {};
      if ("status" in changes) fields.CD_statusRaw = { value: changes.status, type: "STRING" };
      const rec = this._recs[d.rec];
      const attempt = async (tag) => this.db.saveRecords([{ recordName: d.rec, recordType: "CD_DecisionModel", recordChangeTag: tag, fields }], { zoneID: ZONE });
      let res = await attempt(rec && rec.recordChangeTag);
      if (res.hasErrors && /CONFLICT/.test(res.errors[0].ckErrorCode || res.errors[0].serverErrorCode || "")) {
        const fresh = await this.db.fetchRecords([{ recordName: d.rec }], { zoneID: ZONE, desiredKeys: DESIRED });
        const r = fresh.records && fresh.records[0];
        if (r) { this._recs[r.recordName] = r; res = await attempt(r.recordChangeTag); }
      }
      if (res.hasErrors) throw res.errors[0];
      const r = res.records[0];
      this._recs[r.recordName] = Object.assign({}, this._recs[r.recordName] || {}, r, { fields: Object.assign({}, (this._recs[r.recordName] || {}).fields, r.fields) });
      return decisionFrom(this._recs[r.recordName]);
    },

    async saveAction(a, changes) {
      const fields = {};
      const ts = (d) => ({ value: d ? d.getTime() : null, type: "TIMESTAMP" });
      if ("status" in changes) fields.CD_statusRaw = { value: changes.status, type: "STRING" };
      if ("priority" in changes) fields.CD_priorityRaw = { value: changes.priority, type: "STRING" };
      if ("text" in changes) fields.CD_actionDescription = { value: changes.text, type: "STRING" };
      if ("owner" in changes) fields.CD_owner = { value: changes.owner, type: "STRING" };
      if ("ownerEmail" in changes) fields.CD_ownerEmail = { value: changes.ownerEmail || null, type: "STRING" };
      if ("notes" in changes) fields.CD_notes = { value: changes.notes || null, type: "STRING" };
      if ("completed" in changes) fields.CD_completedDate = ts(changes.completed);
      if ("due" in changes) fields.CD_dueDate = ts(changes.due);
      if ("originalDue" in changes) fields.CD_originalDueDate = ts(changes.originalDue);
      if ("reschedules" in changes) fields.CD_rescheduleCount = { value: changes.reschedules, type: "INT64" };
      if ("confirmed" in changes) fields.CD_isDueDateConfirmed = { value: changes.confirmed ? 1 : 0, type: "INT64" };
      const attempt = async (tag) => this.db.saveRecords([{ recordName: a.rec, recordType: "CD_ActionModel", recordChangeTag: tag, fields }], { zoneID: ZONE });
      let res = await attempt(a.tag);
      if (res.hasErrors && /CONFLICT/.test(res.errors[0].ckErrorCode || res.errors[0].serverErrorCode || "")) {
        // Changed on the iPhone since we loaded it: take the latest tag and apply just our fields.
        const fresh = await this.db.fetchRecords([{ recordName: a.rec }], { zoneID: ZONE, desiredKeys: DESIRED });
        const r = fresh.records && fresh.records[0];
        if (r) { this._recs[r.recordName] = r; res = await attempt(r.recordChangeTag); }
      }
      if (res.hasErrors) throw res.errors[0];
      const r = res.records[0];
      const merged = Object.assign({}, this._recs[r.recordName] || {}, r, { fields: Object.assign({}, (this._recs[r.recordName] || {}).fields, r.fields) });
      this._recs[r.recordName] = merged;
      return actionFrom(merged);
    },
  };

  // ---------- demo ----------
  const Demo = (() => {
    const d = (days, h) => { const x = today0(); x.setDate(x.getDate() + days); x.setHours(h || 9, 0, 0, 0); return x; };
    const S1 = "s1", S2 = "s2", S3 = "s3";
    const data = {
      sessions: [
        { rec: S1, title: "Q1 Safety Leadership Review", date: d(-1, 10), duration: 2840, status: "Complete", conf: "Internal",
          participants: ["Hein Ellis", "Maria Lopez", "James Carter", "Priya Shah"],
          summary: ["Recordable rate is down 18% year to date, driven by the Dallas and Atlanta sites.", "Contractor onboarding is the biggest open gap; two sites still use the old checklist.", "Agreed to move the forklift refresher to a quarterly cadence."],
          openQuestions: ["Do we need a second auditor for the Southeast region?"], beforeNext: ["Circulate the updated contractor checklist", "Pull near-miss data by site"],
          themes: ["Contractor safety", "Leading indicators"], implication: "Contractor onboarding needs an owner at regional level before Q2.", hasAudio: true },
        { rec: S2, title: "Supplier audit catch-up plan", date: d(-3, 14), duration: 1910, status: "Complete", conf: "Confidential",
          participants: ["Hein Ellis", "Tom Reed", "Ana Silva"], summary: ["Eleven supplier audits are behind schedule.", "Two auditors will split the backlog by region."],
          openQuestions: [], beforeNext: ["Confirm audit dates with the three priority suppliers"], themes: ["Supplier quality"], implication: "", hasAudio: true },
        { rec: S3, title: "Weekly ops sync", date: d(-8, 9), duration: 1320, status: "Complete", conf: "Internal",
          participants: ["Hein Ellis", "Ops leads"], summary: ["Holiday peak staffing is on track.", "Two open CAPAs need closure evidence."],
          openQuestions: [], beforeNext: [], themes: [], implication: "", hasAudio: false },
      ],
      actions: [
        { rec: "a1", text: "Send updated contractor onboarding checklist to all site leads", owner: "Maria Lopez", due: d(-2), status: "Open", priority: "High", session: S1, notes: "" },
        { rec: "a2", text: "Pull near-miss data by site for the last two quarters", owner: "Hein Ellis", due: d(0), status: "In Progress", priority: "Medium", session: S1, notes: "" },
        { rec: "a3", text: "Schedule quarterly forklift refresher training", owner: "James Carter", due: d(4), status: "Open", priority: "Medium", session: S1, notes: "" },
        { rec: "a4", text: "Confirm audit dates with the three priority suppliers", owner: "Tom Reed", due: d(1), status: "Open", priority: "Urgent", session: S2, notes: "Start with the Memphis supplier." },
        { rec: "a5", text: "Split supplier audit backlog by region", owner: "Ana Silva", due: d(-5), status: "Done", priority: "Medium", session: S2, completed: d(-4), notes: "" },
        { rec: "a6", text: "Upload closure evidence for the two open CAPAs", owner: "Hein Ellis", due: d(9), status: "Blocked", priority: "High", session: S3, notes: "Waiting on site photos." },
      ],
      decisions: [
        { rec: "d1", text: "Forklift refresher training moves to a quarterly cadence", status: "Active", tags: ["Training"], session: S1 },
        { rec: "d2", text: "Two auditors split the supplier backlog by region", status: "Active", tags: ["Suppliers"], session: S2 },
        { rec: "d3", text: "Holiday peak staffing plan approved as presented", status: "Resolved", tags: [], session: S3 },
      ],
      risks: [{ rec: "r1", text: "Contractor onboarding gaps at two sites could lead to a recordable before Q2", type: "Stated", session: S1 }],
    };
    data.actions.forEach((a) => Object.assign(a, { reschedules: 0, confirmed: true, archived: false }));
    data.actions[1].confirmed = false; // one AI-suggested date, to show the Confirm button
    return {
      async start() {},
      async load() { return JSON.parse(JSON.stringify(data), (k, v) => (typeof v === "string" && /^\d{4}-\d\d-\d\dT/.test(v) ? new Date(v) : v)); },
      async text(rec, field) {
        return field === "focusedTranscript"
          ? "Hein: Let's start with the recordable numbers. We're down eighteen percent year to date.\n\nMaria: Most of that is Dallas and Atlanta. The contractor side is still where I'm worried.\n\nHein: Agreed. Maria, can you get the updated checklist out to every site lead this week?\n\nMaria: Yes, I'll send it by Friday.\n\nJames: On forklifts, I'd like to move the refresher to quarterly.\n\nHein: Let's do that. James, you own scheduling it."
          : "(Full transcript, including small talk, appears here.)";
      },
      async saveAction(a, changes) { const t = S.actions.find((x) => x.rec === a.rec); return Object.assign({}, t, changes); },
      async saveDecision(d, changes) { return Object.assign({}, d, changes); },
    };
  })();

  // ---------- state ----------
  const S = { source: null, sessions: [], actions: [], decisions: [], risks: [], bySession: {}, view: "today", filter: "open", q: "", owner: "", selected: null, tx: {}, txMode: "focusedTranscript", txQ: "" };
  const OPEN = ["Open", "In Progress", "Blocked"];
  const isOpen = (a) => OPEN.includes(a.status);
  const isOverdue = (a) => isOpen(a) && a.due && a.due < today0();
  const dueThisWeek = (a) => isOpen(a) && a.due && a.due >= today0() && a.due < new Date(today0().getTime() + 7 * DAY);
  const sess = (rec) => S.bySession[rec];

  // Same visibility rules as the app's AppState.allActions / allDecisions: only items attached to a
  // live (not archived) meeting, archived actions hidden, one per id. CloudKit can hold stray copies of
  // the same action or decision (left over from sync repairs), and orphans with no meeting; the app
  // never shows those, so neither do we. Where copies share an id, the most recently changed one wins.
  function newestById(items) {
    const by = new Map();
    for (const x of items) {
      const k = x.id || x.rec, cur = by.get(k);
      if (!cur || (x.mod || 0) > (cur.mod || 0)) by.set(k, x);
    }
    return [...by.values()];
  }
  function apply(data) {
    S.bySession = {}; data.sessions.forEach((s) => (S.bySession[s.rec] = s));
    const live = (rec) => { const s = S.bySession[rec]; return !!s && !s.archived; };
    S.sessions = data.sessions.filter((s) => !s.archived).sort((a, b) => b.date - a.date);
    S.actions = newestById(data.actions.filter((a) => a.text && live(a.session))).filter((a) => !a.archived).sort(actionSort);
    S.decisions = newestById(data.decisions.filter((d) => d.text && live(d.session)))
      .sort((a, b) => ((sess(b.session) || {}).date || 0) - ((sess(a.session) || {}).date || 0));
    S.risks = data.risks.filter((r) => live(r.session));
  }
  function actionSort(a, b) {
    const oa = isOpen(a) ? 0 : 1, ob = isOpen(b) ? 0 : 1;
    if (oa !== ob) return oa - ob;
    const da = a.due ? a.due.getTime() : Infinity, db = b.due ? b.due.getTime() : Infinity;
    if (da !== db) return da - db;
    return ((sess(b.session) || {}).date || 0) - ((sess(a.session) || {}).date || 0);
  }

  // ---------- boot ----------
  function gate(title, text, actions, help) {
    $("#app").hidden = true;
    $("#gate").hidden = false;
    $("#gate-title").textContent = title;
    $("#gate-text").textContent = text;
    $("#gate-actions").innerHTML = actions || "";
    const h = $("#gate-help");
    h.hidden = !help;
    if (help === "open") h.open = true;
  }

  function showApp() {
    $("#gate").hidden = true;
    $("#app").hidden = false;
    $("#who-name").textContent = S.user;
    route();
  }

  async function signedIn(identity) {
    const nc = identity && identity.nameComponents;
    S.user = nc && (nc.givenName || nc.familyName) ? [nc.givenName, nc.familyName].filter(Boolean).join(" ") : "Signed in";
    gate("Opening your meetings…", "Reading from your iCloud.", '<div class="spin"></div>');
    $("#apple-sign-in-button").hidden = true;
    try {
      await S.source.start();
      const data = await S.source.load();
      if (data.empty) {
        return gate("No DECISIO data yet",
          "We couldn't find DECISIO meetings in this iCloud account. Open DECISIO on your iPhone with the same Apple ID, check that iCloud sync is on in the app's Settings, then try again.",
          '<button class="btn primary block" id="retry">Check again</button><a class="btn block" href="/decisio.html">Get DECISIO for iPhone</a>' + signOutLink());
      }
      apply(data);
      showApp();
    } catch (e) {
      console.error("DECISIO load error", e);
      const code = errText(e);
      if (authErr(e)) {
        return gate("iCloud web access is turned off",
          "Apple is blocking web access to your iCloud data. This is usually because Advanced Data Protection is on. Follow the steps below, then sign in again.",
          '<button class="btn primary block" id="retry">I turned it on, try again</button>' + signOutLink() + code, "open");
      }
      gate("Couldn't reach iCloud", "Check your connection and try again. If it keeps happening, sign out and back in.",
        '<button class="btn primary block" id="retry">Try again</button>' + signOutLink() + code, true);
    }
  }
  // Shown small under the buttons so a screenshot tells us exactly what CloudKit said.
  const errText = (e) => {
    const parts = [e && (e.ckErrorCode || e.serverErrorCode), e && (e.reason || e.message)].filter(Boolean);
    return parts.length ? `<p class="fine">Details: ${esc(parts.join(" · ").slice(0, 200))}</p>` : "";
  };
  const signOutLink = () => '<button class="btn block" id="gate-out">Sign out</button>';

  function initCloud() {
    if (S.source) return;
    if (!CFG.apiToken) {
      return gate("Almost ready", "DECISIO on the web isn't switched on yet. Try the demo to see how it works.",
        '<a class="btn primary block" href="?demo#/today">See the demo</a>');
    }
    CloudKit.configure({
      containers: [{
        containerIdentifier: CFG.container,
        apiTokenAuth: { apiToken: CFG.apiToken, persist: true,
          signInButton: { id: "apple-sign-in-button", theme: "black" },
          signOutButton: { id: "apple-sign-out-button", theme: "white-with-outline" } },
        environment: CFG.environment || "production",
      }],
    });
    S.source = Cloud;
    const c = CloudKit.getDefaultContainer();
    const waitIn = () => {
      gate("Your meetings, on a bigger screen",
        "See your actions, decisions and meeting records from any computer. Sign in with the Apple ID you use on your iPhone.", "", true);
      $("#apple-sign-in-button").hidden = false;
      c.whenUserSignsIn().then(signedIn);
    };
    // setUpAuth only fails when the token or container setup is wrong, before the person has done anything.
    c.setUpAuth().then((id) => (id ? signedIn(id) : waitIn())).catch((e) => {
      console.error("DECISIO setUpAuth error", e);
      gate("Sign-in isn't available right now", "We couldn't start Apple sign-in for DECISIO. Please try again in a few minutes.",
        '<button class="btn primary block" id="retry">Try again</button>' + errText(e));
    });
    c.whenUserSignsOut().then(() => location.reload());
  }

  function boot() {
    if (new URLSearchParams(location.search).has("demo")) {
      S.source = Demo; S.user = "Demo account"; S.demo = true;
      $("#sign-out").hidden = true;
      $("#demo-out").hidden = false;
      $("#demo-out").href = location.pathname;
      Demo.load().then((d) => { apply(d); showApp(); });
      return;
    }
    gate("Your meetings, on a bigger screen", "Loading…", '<div class="spin"></div>');
    if (window.CloudKit) initCloud();
    else {
      window.addEventListener("cloudkitloaded", initCloud);
      setTimeout(() => { if (!window.CloudKit) gate("Couldn't load Apple's sign-in", "Check your connection, or turn off any content blocker for this page, then reload."); }, 12000);
    }
  }

  // Pick up changes made on the iPhone when the tab comes back into focus.
  let lastSync = Date.now();
  window.addEventListener("focus", async () => {
    if (S.source !== Cloud || Date.now() - lastSync < 30000 || S.dirty) return;
    if (document.activeElement && document.activeElement.closest("#action-form")) return;
    lastSync = Date.now();
    try { apply(await Cloud.load()); render(); } catch (e) { /* keep what's on screen */ }
  });

  // ---------- routing ----------
  function route() {
    const [, view, arg] = (location.hash || "#/today").split("/");
    const prev = S.view;
    S.view =["today", "actions", "sessions", "decisions"].includes(view) ? view : "today";
    if (S.view === "actions") S.filter = ["open", "overdue", "week", "done", "all"].includes(arg) ? arg : (S.filterA || "open");
    if (S.view === "decisions") S.filter = ["Active", "Resolved", "Reversed", "Superseded", "all"].includes(arg) ? arg : "Active";
    if (S.view === "sessions") S.selected = arg ? decodeURIComponent(arg) : (S.selectedSession || null);
    if (S.view === "actions") S.filterA = S.filter;
    if (prev !== S.view) S.q = "";
    document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.view === S.view));
    render();
    $("#main").focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", () => { if (!$("#app").hidden) route(); });

  function render() {
    const n = S.actions.filter(isOverdue).length;
    const b = $("#badge");
    b.hidden = !n; b.textContent = n;
    const views = { today: renderToday, actions: renderActions, sessions: renderSessions, decisions: renderDecisions };
    const typing = document.activeElement && document.activeElement.id === "q";
    $("#main").innerHTML = (S.demo ? '<div class="demo-bar">You\'re looking at sample data. Sign in to see your own meetings.</div>' : "") + views[S.view]();
    if (S.view === "sessions" && S.selected) loadTranscript();
    const q = $("#q");
    if (q && typing) { q.focus(); const v = q.value; q.value = ""; q.value = v; }
  }

  // ---------- shared pieces ----------
  const statusChip = (s) => {
    const c = { "Open": "", "In Progress": "blue", "Blocked": "amber", "Done": "green", "Cancelled": "" }[s] || "";
    return `<span class="chip ${c}">${esc(s)}</span>`;
  };
  const prioChip = (p) => p === "Urgent" ? '<span class="chip red">Urgent</span>' : p === "High" ? '<span class="chip amber">High</span>' : "";
  const decChip = (s) => `<span class="chip ${{ Active: "green", Resolved: "blue", Reversed: "red", Superseded: "" }[s] || ""}">${esc(s)}</span>`;

  function actionRow(a, opts) {
    const s = sess(a.session);
    const done = a.status === "Done";
    const due = a.due ? `<span class="${isOverdue(a) ? "chip red" : ""}">${esc(isOpen(a) ? relDue(a.due) : fmtDate(a.due))}</span>` : "";
    return `<div class="row ${done ? "done" : ""} ${S.view === "actions" && S.selectedAction === a.rec ? "sel" : ""}" data-action="${esc(a.rec)}">
      <button class="check ${done ? "on" : ""}" data-toggle="${esc(a.rec)}" title="${done ? "Mark as open" : "Mark as done"}" aria-label="${done ? "Mark as open" : "Mark as done"}"></button>
      <div class="body"><div class="t">${esc(a.text)}</div>
        <div class="m">${a.owner ? `<span>${esc(a.owner)}</span>` : ""}${due}${s && !(opts && opts.noMeeting) ? `<span>${esc(s.title)}</span>` : ""}</div></div>
      <div class="end">${a.status !== "Open" && a.status !== "Done" ? statusChip(a.status) : ""}${prioChip(a.priority)}</div>
    </div>`;
  }

  function sessionRow(s) {
    const n = S.actions.filter((a) => a.session === s.rec && isOpen(a)).length;
    return `<a class="row ${S.view === "sessions" && S.selected === s.rec ? "sel" : ""}" href="#/sessions/${encodeURIComponent(s.rec)}">
      <div class="body"><div class="t">${esc(s.title)}</div>
        <div class="m"><span>${esc(fmtDay(s.date))} · ${esc(fmtTime(s.date))}</span>${s.duration ? `<span>${esc(fmtDur(s.duration))}</span>` : ""}${s.participants.length ? `<span>${esc(s.participants.slice(0, 3).join(", "))}${s.participants.length > 3 ? ` +${s.participants.length - 3}` : ""}</span>` : ""}</div></div>
      <div class="end">${n ? `<span class="chip gold">${n} open</span>` : ""}${s.status !== "Complete" ? `<span class="chip">${esc(s.status)}</span>` : ""}</div>
    </a>`;
  }

  const searchBox = (ph) => `<label class="search">${icon(I.search)}<input id="q" type="search" placeholder="${esc(ph)}" value="${esc(S.q)}"></label>`;
  const has = (q, ...parts) => !q || parts.some((p) => (Array.isArray(p) ? p.join(" ") : String(p || "")).toLowerCase().includes(q));

  // ---------- Today ----------
  function renderToday() {
    const open = S.actions.filter(isOpen), over = open.filter(isOverdue), week = open.filter(dueThisWeek);
    const recent = S.sessions.filter((s) => s.date > new Date(Date.now() - 7 * DAY));
    const urgent = open.filter((a) => isOverdue(a) || dueThisWeek(a)).slice(0, 8);
    const hello = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";
    const first = (S.user || "").split(" ")[0];
    return `
      <div class="topbar"><h1>${esc(hello)}${first && first !== "Signed" && !S.demo ? ", " + esc(first) : ""}</h1><span class="muted">${esc(new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }))}</span></div>
      <div class="stats">
        <a class="stat" href="#/actions/open"><b class="num">${open.length}</b><span>Open actions</span></a>
        <a class="stat ${over.length ? "alert" : ""}" href="#/actions/overdue"><b class="num">${over.length}</b><span>Overdue</span></a>
        <a class="stat" href="#/actions/week"><b class="num">${week.length}</b><span>Due in the next 7 days</span></a>
        <a class="stat" href="#/sessions"><b class="num">${recent.length}</b><span>Meetings this week</span></a>
      </div>
      <div class="grid2">
        <div class="card"><h3>Needs attention</h3><div class="list">${urgent.length ? urgent.map((a) => actionRow(a)).join("") : '<div class="empty">Nothing overdue or due this week.</div>'}</div>
          ${open.length > urgent.length ? '<p><a href="#/actions/open">See all open actions →</a></p>' : ""}</div>
        <div class="card"><h3>Recent meetings</h3><div class="list">${S.sessions.slice(0, 6).map(sessionRow).join("") || '<div class="empty">No meetings yet.</div>'}</div>
          ${S.sessions.length > 6 ? '<p><a href="#/sessions">See all meetings →</a></p>' : ""}</div>
      </div>
      ${S.decisions.length ? `<div class="card"><h3>Latest decisions</h3><div class="list">${S.decisions.slice(0, 5).map(decisionRow).join("")}</div></div>` : ""}`;
  }

  // ---------- Actions ----------
  function actionsFiltered() {
    const q = S.q.toLowerCase();
    const base = {
      open: S.actions.filter(isOpen), overdue: S.actions.filter(isOverdue), week: S.actions.filter(dueThisWeek),
      done: S.actions.filter((a) => a.status === "Done").sort((a, b) => (b.completed || 0) - (a.completed || 0)), all: S.actions,
    }[S.filter] || [];
    return base.filter((a) => (!S.owner || a.owner === S.owner) && has(q, a.text, a.owner, a.notes, (sess(a.session) || {}).title));
  }

  function renderActions() {
    const counts = { open: S.actions.filter(isOpen).length, overdue: S.actions.filter(isOverdue).length, week: S.actions.filter(dueThisWeek).length, done: S.actions.filter((a) => a.status === "Done").length, all: S.actions.length };
    const names = { open: "Open", overdue: "Overdue", week: "Next 7 days", done: "Done", all: "All" };
    const owners = [...new Set(S.actions.map((a) => a.owner).filter(Boolean))].sort();
    const rows = actionsFiltered();
    const sel = S.actions.find((a) => a.rec === S.selectedAction);
    return `
      <div class="topbar"><h1>Actions</h1>
        <div class="right">${searchBox("Search actions")}
          <select class="sel" id="owner"><option value="">Everyone</option>${owners.map((o) => `<option ${o === S.owner ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>
          <button class="btn" id="csv">${icon(I.dl)}Export CSV</button></div></div>
      <div class="tabs">${Object.keys(names).map((k) => `<a href="#/actions/${k}" class="${S.filter === k ? "on" : ""}">${names[k]}<i>${counts[k]}</i></a>`).join("")}</div>
      <div class="split">
        <div class="card"><div class="list">${rows.length ? rows.map((a) => actionRow(a)).join("") : '<div class="empty">No actions here.</div>'}</div></div>
        <div class="card">${sel ? actionDetail(sel) : '<div class="empty">Pick an action to see details and update it.</div>'}</div>
      </div>`;
  }

  function actionDetail(a) {
    const s = sess(a.session);
    const st = ["Open", "In Progress", "Blocked", "Done", "Cancelled"], pr = ["Low", "Medium", "High", "Urgent"];
    return `<div class="detail">
      <div class="head"><h2>${esc(a.text)}</h2>
        <div class="m">${statusChip(a.status)}${prioChip(a.priority)}${a.due ? `<span class="${isOverdue(a) ? "chip red" : ""}">${esc(isOpen(a) ? relDue(a.due) : "Due " + fmtDate(a.due))}</span>` : ""}</div></div>
      <form id="action-form" class="kv">
        <label for="f-text">Action</label><textarea id="f-text" rows="2" required>${esc(a.text)}</textarea>
        <label for="f-owner">Owner</label><div class="combo"><input id="f-owner" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="owner-list" value="${esc(a.owner)}" placeholder="Who is responsible?"><ul id="owner-list" class="combo-list" role="listbox" hidden></ul></div>
        <label for="f-email">Owner email</label><input id="f-email" type="email" value="${esc(a.ownerEmail)}" placeholder="Optional">
        <label for="f-status">Status</label><select id="f-status">${st.map((x) => `<option ${x === a.status ? "selected" : ""}>${x}</option>`).join("")}</select>
        <label for="f-prio">Priority</label><select id="f-prio">${pr.map((x) => `<option ${x === a.priority ? "selected" : ""}>${x}</option>`).join("")}</select>
        <label for="f-due">Due date</label><input id="f-due" type="date" value="${isoDay(a.due)}">
        <label for="f-done" class="${a.status === "Done" ? "" : "dim"}">Completed on</label><div><input id="f-done" type="date" max="${isoDay(new Date())}" value="${a.status === "Done" ? isoDay(a.completed || new Date()) : ""}" ${a.status === "Done" ? "" : "disabled"}>
          <div class="hint">Used for your follow-through score. Set the day it was actually done, not the day you logged it.</div></div>
        <label for="f-notes">Notes</label><textarea id="f-notes" rows="3" placeholder="Optional">${esc(a.notes)}</textarea>
        <span></span><div><button class="btn primary" type="submit" id="save">Save changes</button></div>
      </form>
      <div class="kv">
        ${s ? `<label>From</label><div><a href="#/sessions/${encodeURIComponent(s.rec)}">${esc(s.title)}</a> · ${esc(fmtDate(s.date))}${a.timestamp && !/^0?0:00(:00)?$/.test(a.timestamp) ? ` · at ${esc(a.timestamp)}` : ""}</div>` : ""}
        <label>Date status</label><div>${a.due ? (a.confirmed ? '<span class="chip green">Confirmed</span>'
          : `Suggested by AI, not yet confirmed <button type="button" class="btn sm" data-confirm="${esc(a.rec)}">Confirm date</button>
             <div class="hint">Confirming makes this the date your follow-through score measures against.</div>`) : "No due date"}</div>
        ${a.reschedules ? `<label>Rescheduled</label><div>${a.reschedules} time${a.reschedules > 1 ? "s" : ""}${a.originalDue ? ` · first due ${esc(fmtDate(a.originalDue))}` : ""}</div>` : ""}
        ${a.completed && a.status === "Done" ? `<label>Completed</label><div>${esc(fmtDate(a.completed))}${(a.originalDue || a.due) ? (startOfDay(a.completed) > startOfDay(a.originalDue || a.due) ? ' <span class="chip red">Late</span>' : ' <span class="chip green">On time</span>') : ""}</div>` : ""}
      </div>
    </div>`;
  }

  async function updateAction(a, want) {
    // Same rules as AppState.updateAction in the app, so the follow-through score reads web edits correctly.
    const changes = {};
    const status = want.status !== undefined ? want.status : a.status;
    if (status !== a.status) changes.status = status;
    if (status === "Done") {
      const done = want.completed || a.completed || new Date();
      if (isoDay(done) !== isoDay(a.completed)) changes.completed = done;
    } else if (a.completed) changes.completed = null;
    if (want.priority !== undefined && want.priority !== a.priority) changes.priority = want.priority;
    for (const k of ["text", "owner", "ownerEmail", "notes"]) {
      if (want[k] !== undefined && want[k].trim() !== (a[k] || "")) changes[k] = want[k].trim();
    }
    if (changes.text === "") return toast("The action can't be empty");
    if (want.confirm && a.due && !a.confirmed) changes.confirmed = true;
    if (want.due !== undefined && isoDay(want.due) !== isoDay(a.due)) {
      changes.due = want.due;
      // Only a date the user stood behind becomes the bar; moving an AI-inferred date is a first commitment.
      if (a.confirmed && a.due && want.due && startOfDay(want.due) > startOfDay(a.due)) {
        if (!a.originalDue) changes.originalDue = a.due;
        changes.reschedules = (a.reschedules || 0) + 1;
      }
      if (want.due && !a.confirmed) changes.confirmed = true;
    }
    if (!Object.keys(changes).length) return toast("Nothing new to save. Your changes are already synced.");
    S.dirty = true;
    try {
      const updated = await S.source.saveAction(a, changes);
      Object.assign(a, updated);
      S.actions.sort(actionSort);
      toast(changes.status === "Done" ? "Marked done. It'll sync to your iPhone." : Object.keys(changes).join() === "confirmed" ? "Due date confirmed and saved." : "Saved. It'll sync to your iPhone.");
      if (changes.status) await autoResolve(a.session);
    } catch (e) {
      console.error(e);
      toast(authErr(e) ? "Your sign-in expired. Reload and sign in again." : "Couldn't save. Check your connection and try again.");
    } finally { S.dirty = false; render(); }
  }

  // App rule: when every live action in a meeting is Done or Cancelled, its Active decisions become Resolved.
  async function autoResolve(sessionRec) {
    if (!sessionRec) return;
    const acts = S.actions.filter((x) => x.session === sessionRec);
    if (!acts.length || !acts.every((x) => x.status === "Done" || x.status === "Cancelled")) return;
    const active = S.decisions.filter((d) => d.session === sessionRec && d.status === "Active");
    for (const d of active) {
      try { Object.assign(d, await S.source.saveDecision(d, { status: "Resolved" })); } catch (e) { console.error(e); }
    }
    if (active.length) toast(`All actions complete. ${active.length === 1 ? "1 decision" : active.length + " decisions"} resolved.`);
  }

  // Owner picker: everyone who owns an action or attended a meeting, like the app's known-people list.
  function people() {
    const seen = new Map();
    for (const n of [...S.actions.map((a) => a.owner), ...S.sessions.flatMap((s) => s.participants)]) {
      const t = (n || "").trim();
      if (t && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }
  function showOwners(input) {
    const ul = $("#owner-list"); if (!ul) return;
    const q = input.value.trim().toLowerCase();
    const hits = people().filter((n) => !q || n.toLowerCase().includes(q)).filter((n) => n.toLowerCase() !== q).slice(0, 8);
    S.ownerIdx = -1;
    ul.innerHTML = hits.map((n, i) => `<li role="option" data-owner="${esc(n)}" id="ow-${i}">${esc(n)}</li>`).join("");
    ul.hidden = !hits.length;
    input.setAttribute("aria-expanded", hits.length ? "true" : "false");
  }
  function hideOwners() { const ul = $("#owner-list"); if (ul) ul.hidden = true; const i = $("#f-owner"); if (i) i.setAttribute("aria-expanded", "false"); }

  function csv() {
    const rows = actionsFiltered();
    const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = [["Action", "Owner", "Owner email", "Status", "Priority", "Due", "Completed", "Meeting", "Meeting date", "Notes"].map(q).join(",")];
    for (const a of rows) {
      const s = sess(a.session) || {};
      lines.push([a.text, a.owner, a.ownerEmail, a.status, a.priority, isoDay(a.due), isoDay(a.completed), s.title, isoDay(s.date), a.notes].map(q).join(","));
    }
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = `DECISIO actions ${isoDay(new Date())}.csv`;
    document.body.appendChild(el); el.click(); el.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // ---------- Meetings ----------
  function renderSessions() {
    const q = S.q.toLowerCase();
    const rows = S.sessions.filter((s) => has(q, s.title, s.participants, s.summary, s.themes));
    const s = S.selected && sess(S.selected);
    return `
      <div class="topbar"><h1>Meetings</h1><div class="right">${searchBox("Search meetings, people, topics")}</div></div>
      <div class="split">
        <div class="card"><div class="list">${rows.length ? rows.map(sessionRow).join("") : '<div class="empty">No meetings match.</div>'}</div></div>
        <div class="card">${s ? sessionDetail(s) : '<div class="empty">Pick a meeting to see the summary, actions and transcript.</div>'}</div>
      </div>`;
  }

  function sessionDetail(s) {
    S.selectedSession = s.rec;
    const acts = S.actions.filter((a) => a.session === s.rec);
    const decs = S.decisions.filter((d) => d.session === s.rec);
    const risks = S.risks.filter((r) => r.session === s.rec);
    const bl = (title, arr) => arr.length ? `<div><h3>${title}</h3><ul class="bul">${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "";
    return `<div class="detail">
      <div class="head"><h2>${esc(s.title)}</h2>
        <div class="m"><span>${esc(fmtDay(s.date))} · ${esc(fmtTime(s.date))}</span>${s.duration ? `<span>${esc(fmtDur(s.duration))}</span>` : ""}${s.conf ? `<span class="chip">${esc(s.conf)}</span>` : ""}</div>
        ${s.participants.length ? `<div class="m">${esc(s.participants.join(", "))}</div>` : ""}</div>
      ${bl("Summary", s.summary)}
      ${s.implication ? `<div><h3>Leadership implication</h3><div class="note">${esc(s.implication)}</div></div>` : ""}
      ${decs.length ? `<div><h3>Decisions</h3><div class="list">${decs.map(decisionRow).join("")}</div></div>` : ""}
      ${acts.length ? `<div><h3>Actions</h3><div class="list">${acts.sort(actionSort).map((a) => actionRow(a, { noMeeting: true })).join("")}</div></div>` : ""}
      ${risks.length ? `<div><h3>Risks</h3><ul class="bul">${risks.map((r) => `<li>${esc(r.text)}${r.type === "Inferred" ? ' <span class="chip">Inferred</span>' : ""}</li>`).join("")}</ul></div>` : ""}
      ${bl("Open questions", s.openQuestions)}
      ${bl("Before the next meeting", s.beforeNext)}
      ${s.themes.length ? `<div><h3>Themes</h3>${s.themes.map((t) => `<span class="chip gold">${esc(t)}</span> `).join("")}</div>` : ""}
      <div>
        <div class="topbar"><h3 style="margin:0">Transcript</h3>
          <div class="right"><div class="tabs">
            <a href="#" data-tx="focusedTranscript" class="${S.txMode === "focusedTranscript" ? "on" : ""}">Focused</a>
            <a href="#" data-tx="transcript" class="${S.txMode === "transcript" ? "on" : ""}">Full</a></div>
            <label class="search" style="min-width:180px">${icon(I.search)}<input id="txq" type="search" placeholder="Find in transcript" value="${esc(S.txQ)}"></label></div></div>
        <div id="tx" class="transcript" style="margin-top:10px"><div class="spin"></div></div>
      </div>
      ${s.hasAudio ? '<div class="banner">Recording playback on the web is coming soon. For now, play this recording in DECISIO on your iPhone or iPad.</div>' : ""}
    </div>`;
  }

  async function loadTranscript() {
    const s = sess(S.selected); const box = $("#tx");
    if (!s || !box) return;
    const key = s.rec + "|" + S.txMode;
    if (!(key in S.tx)) {
      try { S.tx[key] = await S.source.text(s.rec, S.txMode); } catch (e) { S.tx[key] = null; }
      // Older meetings may only have the full transcript.
      if (S.txMode === "focusedTranscript" && !S.tx[key]) {
        const full = s.rec + "|transcript";
        if (!(full in S.tx)) { try { S.tx[full] = await S.source.text(s.rec, "transcript"); } catch (e) { S.tx[full] = null; } }
        if (S.tx[full]) S.tx[key] = { fallback: S.tx[full] };
      }
    }
    if (S.selected !== s.rec || !$("#tx")) return;
    paintTranscript(S.tx[key]);
  }

  function paintTranscript(v) {
    const box = $("#tx"); if (!box) return;
    let note = "";
    if (v && v.fallback) { note = '<p class="muted" style="margin:0 0 8px">No focused transcript for this meeting, so here is the full one.</p>'; v = v.fallback; }
    if (v && v.url) { box.innerHTML = `This transcript is large. <a href="${esc(v.url)}" target="_blank" rel="noopener">Open it in a new tab</a>.`; return; }
    if (!v) { box.innerHTML = '<span class="muted">No transcript for this meeting.</span>'; return; }
    let h = esc(v);
    const q = S.txQ.trim();
    if (q.length > 1) {
      const re = new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      h = h.replace(re, (m) => `<mark>${m}</mark>`);
    }
    box.innerHTML = note + h;
    const m = box.querySelector("mark"); if (m) m.scrollIntoView({ block: "center" });
  }

  // ---------- Decisions ----------
  function decisionRow(d) {
    const s = sess(d.session);
    return `<a class="row" href="${s ? "#/sessions/" + encodeURIComponent(s.rec) : "#/decisions"}">
      <div class="body"><div class="t">${esc(d.text)}</div>
        <div class="m">${s ? `<span>${esc(s.title)} · ${esc(fmtDate(s.date))}</span>` : ""}${d.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>
      <div class="end">${decChip(d.status)}</div></a>`;
  }

  function renderDecisions() {
    const q = S.q.toLowerCase();
    const tabs = ["Active", "Resolved", "Reversed", "Superseded", "all"];
    const count = (k) => k === "all" ? S.decisions.length : S.decisions.filter((d) => d.status === k).length;
    const rows = S.decisions.filter((d) => (S.filter === "all" || d.status === S.filter) && has(q, d.text, d.tags, d.notes, (sess(d.session) || {}).title));
    return `
      <div class="topbar"><h1>Decisions</h1><div class="right">${searchBox("Search decisions")}</div></div>
      <div class="tabs">${tabs.map((k) => `<a href="#/decisions/${k}" class="${S.filter === k ? "on" : ""}">${k === "all" ? "All" : k}<i>${count(k)}</i></a>`).join("")}</div>
      <div class="card"><div class="list">${rows.length ? rows.map(decisionRow).join("") : '<div class="empty">No decisions here.</div>'}</div></div>`;
  }

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("#retry")) return location.reload();
    const tg = t.closest("[data-toggle]");
    if (tg) {
      e.preventDefault(); e.stopPropagation();
      const a = S.actions.find((x) => x.rec === tg.dataset.toggle);
      if (a) updateAction(a, { status: a.status === "Done" ? "Open" : "Done" });
      return;
    }
    const row = t.closest("[data-action]");
    if (row) {
      const rec = row.dataset.action;
      if (S.view !== "actions") {
        const a = S.actions.find((x) => x.rec === rec);
        S.selectedAction = rec;
        location.hash = "#/actions/" + (a && !isOpen(a) ? "all" : "open");
        return;
      }
      S.selectedAction = rec; render(); return;
    }
    const cf = t.closest("[data-confirm]");
    if (cf) { const a = S.actions.find((x) => x.rec === cf.dataset.confirm); if (a) updateAction(a, { confirm: true }); return; }
    const tx = t.closest("[data-tx]");
    if (tx) { e.preventDefault(); S.txMode = tx.dataset.tx; render(); return; }
    if (t.closest("#csv")) return csv();
    if (t.closest("#sign-out")) {
      e.preventDefault();
      const box = $("#apple-sign-out-button");
      const target = box && (box.querySelector('[role="button"],button,a') || box.firstElementChild);
      if (target) target.click();
      setTimeout(() => {
        try { Object.keys(localStorage).filter((k) => /cloudkit|ck/i.test(k)).forEach((k) => localStorage.removeItem(k)); } catch (_) {}
        location.reload();
      }, 1500);
    }
    if (t.closest("#gate-out")) {
      const c = window.CloudKit && CloudKit.getDefaultContainer();
      if (c && c.signOut) c.signOut().then(() => location.reload()); else location.reload();
    }
  });

  document.addEventListener("focusin", (e) => { if (e.target.id === "f-owner") showOwners(e.target); });
  document.addEventListener("focusout", (e) => { if (e.target.id === "f-owner") setTimeout(hideOwners, 120); });
  // mousedown, not click, so the pick lands before the input loses focus
  document.addEventListener("mousedown", (e) => {
    const li = e.target.closest("[data-owner]");
    if (!li) return;
    e.preventDefault();
    $("#f-owner").value = li.dataset.owner;
    hideOwners();
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.id !== "f-owner") return;
    const ul = $("#owner-list"); if (!ul || ul.hidden) return;
    const items = [...ul.querySelectorAll("li")];
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      S.ownerIdx = (S.ownerIdx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((li, i) => li.classList.toggle("on", i === S.ownerIdx));
    } else if (e.key === "Enter" && S.ownerIdx >= 0) {
      e.preventDefault();
      e.target.value = items[S.ownerIdx].dataset.owner; hideOwners();
    } else if (e.key === "Escape") hideOwners();
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "f-owner") showOwners(e.target);
    if (e.target.id === "q") { S.q = e.target.value; clearTimeout(S.qh); S.qh = setTimeout(render, 180); }
    if (e.target.id === "txq") { S.txQ = e.target.value; const s = sess(S.selected); if (s) paintTranscript(S.tx[s.rec + "|" + S.txMode]); }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "owner") { S.owner = e.target.value; render(); }
    if (e.target.id === "f-status") {
      const f = $("#f-done"), done = e.target.value === "Done";
      f.disabled = !done;
      document.querySelector('label[for="f-done"]').classList.toggle("dim", !done);
      if (done && !f.value) f.value = isoDay(new Date());
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "action-form") return;
    e.preventDefault();
    const a = S.actions.find((x) => x.rec === S.selectedAction);
    if (!a) return;
    const v = $("#f-due").value;
    const due = v ? new Date(v + "T12:00:00") : null;
    const dv = $("#f-done").value;
    updateAction(a, { text: $("#f-text").value, owner: $("#f-owner").value, ownerEmail: $("#f-email").value, notes: $("#f-notes").value,
      status: $("#f-status").value, priority: $("#f-prio").value, due, completed: dv ? new Date(dv + "T12:00:00") : null });
  });
  boot();
})();
