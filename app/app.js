/* MileGuard on the web.
   Reads the person's own drives from their private iCloud database with CloudKit JS. The iPhone app
   stores them with SwiftData mirrored to CloudKit, so records are CD_<Entity> with CD_<field> values,
   in the zone com.apple.coredata.cloudkit.zone. No Guardian Apps server is involved. */
(function () {
  "use strict";

  const CFG = window.MG_CONFIG || {};
  const ZONE = { zoneName: "com.apple.coredata.cloudkit.zone" };
  const ACCESS_RECORD = "mileguard-web";
  let MI = 1609.344;   // metres per display unit; 1000 in Canada

  // Country, as the app last saved it with the Pro record. Distances are stored in metres, money as typed.
  const RG = { ca: false, unit: "mi", word: "miles", Word: "Miles", vol: "gal", cur: "USD", loc: "en-US",
    rateName: "IRS standard rate", deduction: "Mileage deduction", value: "Mileage value", meals: "Schedule C line 24b",
    province: "", territory: false, claim: "employer" };
  // CRA per-km allowance: first 5,000 business km of the year, then the lower rate; +4¢ in the territories.
  // UK: HMRC approved mileage, cars and vans, per tax year from 6 April (55p from 6 April 2026).
  const CRA = { 2024: [0.70, 0.64], 2025: [0.72, 0.66], 2026: [0.73, 0.67] };
  const HMRC = { 2024: [0.45, 0.25], 2025: [0.45, 0.25], 2026: [0.55, 0.25] };
  const pickRate = (t, y) => t[y] || t[Math.max(...Object.keys(t).map(Number).filter((k) => k <= y).concat([2024]))];
  const craYear = (y) => pickRate(CRA, y);
  // A tax year is named for the year it starts in.
  const taxYearOf = (d) => RG.uk && d < new Date(d.getFullYear(), 3, 6) ? d.getFullYear() - 1 : d.getFullYear();
  const taxYearLabel = (y) => RG.uk ? `${y}–${String((y + 1) % 100).padStart(2, "0")}` : String(y);
  const taxYearRange = (y) => RG.uk ? [new Date(y, 3, 6), new Date(y + 1, 3, 6)] : [new Date(y, 0, 1), new Date(y + 1, 0, 1)];
  // [first rate, rate after] for a tax year, or null in the US.
  function tierRates(y) {
    if (RG.ca) { const [a, b] = craYear(y), k = RG.territory ? 0.04 : 0; return [a + k, b + k]; }
    if (RG.uk) return pickRate(HMRC, y);
    return null;
  }
  function setRegion(info) {
    if (info && info.region === "GB") {
      Object.assign(RG, { uk: true, tier: 10000, vol: "L", cur: "GBP", loc: "en-GB",
        rateName: "HMRC approved mileage rate", deduction: "Approved mileage", value: "Mileage allowance", meals: "meals on business drives",
        claim: info.claim || "employer" });
      ASSIGNABLE = ["business", "personal", "commute"];
      KINDS.log.text = "HMRC-style log of your business journeys";
      KINDS.claim.text = "Business miles at HMRC rates or your employer's, plus tolls, parking and meals";
      KINDS.tax.text = "Tax year totals, approved mileage and business share of car costs";
      KINDS.tax.title = "Tax year summary";
      return;
    }
    if (!info || info.region !== "CA") return;
    MI = 1000;
    RG.tier = 5000;
    Object.assign(RG, { ca: true, unit: "km", word: "km", Word: "Km", vol: "L", cur: "CAD", loc: "en-CA",
      rateName: "CRA per-km rate", deduction: "CRA allowance", value: "CRA allowance", meals: "50% deductible",
      province: info.province || "ON", territory: ["YT", "NT", "NU"].includes(info.province), claim: info.claim || "employer" });
    ASSIGNABLE = ["business", "personal", "commute"];
    KINDS.log.text = "CRA logbook of your drives";
    KINDS.claim.text = "Business km at the CRA rate or your employer's, plus tolls, parking and meals";
    KINDS.tax.text = "Logbook totals, CRA allowance and business share of car costs";
    KINDS.tax.title = "Year-end summary";
  }

  // IRS standard rates by effective date. Same table as the app (Compliance/IRSRates.swift).
  const RATES = [
    { from: "2025-01-01", business: 0.70, medical: 0.21, charity: 0.14 },
    { from: "2026-01-01", business: 0.725, medical: 0.205, charity: 0.14 },
    { from: "2026-07-01", business: 0.76, medical: 0.235, charity: 0.14 },
  ].map((r) => ({ ...r, at: new Date(r.from + "T00:00:00") }));

  const CATS = {
    unclassified: { label: "Needs review", color: "var(--orange)" },
    business: { label: "Business", color: "var(--br)" },
    personal: { label: "Personal", color: "var(--blue)" },
    commute: { label: "Commute", color: "var(--grey)" },
    medical: { label: "Medical", color: "#C04A8E" },
    charity: { label: "Charity", color: "#8A63D2" },
  };
  let ASSIGNABLE = ["business", "personal", "commute", "medical", "charity"];
  const EXPENSE = {
    insurance: "Insurance", repairs: "Repairs", maintenance: "Maintenance & oil", tires: "Tires",
    registration: "Registration & fees", lease: "Lease payment", loanInterest: "Loan interest",
    carWash: "Car wash", garage: "Garage rent", other: "Other",
  };

  const S = {
    source: null, user: null, pro: false,
    trips: [], vehicles: {}, businesses: {}, expenses: [], fuel: [], editCounts: {},
    view: "drives", month: null, filter: "all", search: "", selected: null, draft: null,
    report: { kind: "log", period: null, vehicle: "", business: "", rate: "" },
    routes: {},
  };

  // ---------- helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => (n || 0).toLocaleString(RG.loc, { style: "currency", currency: RG.cur });
  const miles = (m) => (m / MI).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const num = (n, d = 1) => (n || 0).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const cents = (r) => RG.ca ? `${Math.round(r * 100)}¢/km` : RG.uk ? `${Math.round(r * 100)}p/mile` : `$${r}/mi`;
  const ymKey = (d) => d.getFullYear() * 100 + d.getMonth();
  const monthName = (y, m) => new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dayLabel = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = (d) => d ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const hm = (d) => d ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : "";
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : ("10000000-1000-4000-8000-100000000000").replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16))).toUpperCase();
  const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const I = {
    dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    doc: '<path d="M6 3h8l4 4v14H6zM9 13h6M9 17h6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  };

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.h);
    toast.h = setTimeout(() => t.classList.remove("show"), 3200);
  }

  function rateFor(cat, date) {
    if (RG.tier) return cat === "business" ? tierRates(taxYearOf(date))[0] : 0;
    let r = null;
    for (const x of RATES) if (x.at <= date) r = x;
    if (!r) return 0;
    return cat === "business" ? r.business : cat === "medical" ? r.medical : cat === "charity" ? r.charity : 0;
  }
  const missingPurpose = (t) => t.category === "business" && !t.purpose.trim() && !t.client.trim();
  const mealIsBusiness = (t) => t.meal > 0 && t.category === "business" && (!!t.mealWith.trim() || t.mealOvernight);
  const needsReview = (t) => !t.lockedFree && (t.category === "unclassified" || missingPurpose(t));
  const vehicleName = (id) => (S.vehicles[id] && S.vehicles[id].name) || "";
  const vehicleLabel = (id) => {
    const v = S.vehicles[id];
    if (!v) return "";
    const plate = [v.plateState, v.plate].filter(Boolean).join(" ").toUpperCase();
    return plate ? `${v.name} · ${plate}` : v.name;
  };
  const defaultBusiness = () => Object.values(S.businesses).sort((a, b) => a.createdAt - b.createdAt)[0];
  const businessName = (t) => (S.businesses[t.businessId] || defaultBusiness() || {}).name || "";

  // ---------- CloudKit source ----------
  const F = (r, k) => { const f = r.fields && r.fields["CD_" + k]; return f ? f.value : undefined; };
  const str = (r, k) => F(r, k) || "";
  const dbl = (r, k) => Number(F(r, k) || 0);
  const bool = (r, k) => !!F(r, k);
  const date = (r, k) => { const v = F(r, k); return v == null ? null : new Date(v); };
  // Addresses come from Apple Maps with the country on the end; drop it for US addresses.
  const place = (s) => s.replace(/,?\s*(United States|USA|US)$/i, "").trim();
  const meta = (r) => ({ recordName: r.recordName, recordType: r.recordType, recordChangeTag: r.recordChangeTag });

  function tripFrom(r) {
    return {
      id: r.recordName, rec: meta(r),
      start: date(r, "startDate") || new Date(0), end: date(r, "endDate"),
      from: place(str(r, "startAddress")), to: place(str(r, "endAddress")),
      startLat: dbl(r, "startLat"), startLon: dbl(r, "startLon"), endLat: dbl(r, "endLat"), endLon: dbl(r, "endLon"),
      meters: dbl(r, "distanceMeters"),
      category: str(r, "categoryRaw") || "unclassified",
      purpose: str(r, "purpose"), client: str(r, "client"),
      tolls: dbl(r, "tollAmount"), tollSource: str(r, "tollSourceRaw"), tollsLikely: bool(r, "tollsLikely"),
      parking: dbl(r, "parkingAmount"),
      meal: dbl(r, "mealAmount"), mealWith: str(r, "mealWith"), mealOvernight: bool(r, "mealOvernight"),
      vehicleId: str(r, "vehicle"), businessId: str(r, "business"),
      classifiedAt: date(r, "classifiedAt"), autoRule: str(r, "autoRule"),
      lockedFree: bool(r, "lockedFree"), isManual: bool(r, "isManual"), viaCarPlay: bool(r, "viaCarPlay"),
      hasReceipt: !!(F(r, "receiptData_ckAsset") || F(r, "mealReceiptData_ckAsset")),
      receipt: !!F(r, "receiptData_ckAsset"), mealReceipt: !!F(r, "mealReceiptData_ckAsset"),
    };
  }

  const TRIP_KEYS = ["id", "startDate", "endDate", "startAddress", "endAddress", "startLat", "startLon", "endLat", "endLon",
    "distanceMeters", "categoryRaw", "purpose", "client", "tollAmount", "tollSourceRaw", "tollsLikely", "parkingAmount",
    "mealAmount", "mealWith", "mealOvernight", "vehicle", "business", "classifiedAt", "autoRule", "lockedFree", "isManual",
    "viaCarPlay", "receiptData_ckAsset", "mealReceiptData_ckAsset"];
  const OTHER_KEYS = ["trip", "date", "name", "isDefault", "createdAt", "year", "make", "model", "plate", "plateState",
    "kindRaw", "amount", "note", "totalCost", "gallons", "station"];
  const DESIRED = [...new Set([...TRIP_KEYS, ...OTHER_KEYS])].map((k) => "CD_" + k);

  // Field name in the app's change history, and how the app writes the values.
  const HISTORY = {
    categoryRaw: "category", purpose: "purpose", client: "client", business: "business",
    tollAmount: "tolls", parkingAmount: "parking", mealAmount: "meal", mealWith: "meal with", mealOvernight: "meal overnight",
    startAddress: "from", endAddress: "to",
  };

  const Cloud = {
    db: null, token: null,
    _recs: {},

    async start() {
      const c = CloudKit.getDefaultContainer();
      this.container = c;
      this.db = c.privateCloudDatabase;
    },

    async access() {
      try {
        const res = await this.db.fetchRecords([{ recordName: ACCESS_RECORD }]);
        const r = res.records && res.records[0];
        if (!r || r.serverErrorCode || !r.fields) return { ok: false };
        const f = (k) => r.fields[k] && r.fields[k].value;
        const exp = f("expires");
        return { ok: Number(f("pro")) === 1 && (!exp || exp > Date.now()), region: f("region"), province: f("province"), claim: f("claim") };
      } catch (e) { return { ok: false }; }
    },

    async load() {
      let more = true, rounds = 0;
      while (more && rounds++ < 200) {
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
      const out = { trips: [], vehicles: {}, businesses: {}, expenses: [], fuel: [], editCounts: {} };
      for (const r of Object.values(this._recs)) {
        switch (r.recordType) {
          case "CD_Trip": out.trips.push(tripFrom(r)); break;
          case "CD_TripEdit": { const t = str(r, "trip"); if (t) out.editCounts[t] = (out.editCounts[t] || 0) + 1; break; }
          case "CD_Vehicle":
            out.vehicles[r.recordName] = { id: r.recordName, name: str(r, "name") || "My Car", isDefault: bool(r, "isDefault"),
              createdAt: date(r, "createdAt") || new Date(0), plate: str(r, "plate"), plateState: str(r, "plateState") };
            break;
          case "CD_Business":
            out.businesses[r.recordName] = { id: r.recordName, name: str(r, "name"), createdAt: date(r, "createdAt") || new Date(0) };
            break;
          case "CD_VehicleExpense":
            out.expenses.push({ id: r.recordName, date: date(r, "date") || new Date(0), kind: str(r, "kindRaw") || "other",
              amount: dbl(r, "amount"), note: str(r, "note"), vehicleId: str(r, "vehicle"), receipt: !!F(r, "receiptData_ckAsset") });
            break;
          case "CD_FuelEntry":
            out.fuel.push({ id: r.recordName, date: date(r, "date") || new Date(0), cost: dbl(r, "totalCost"),
              gallons: dbl(r, "gallons"), station: str(r, "station"), vehicleId: str(r, "vehicle"), receipt: !!F(r, "receiptData_ckAsset") });
            break;
        }
      }
      return out;
    },

    // Car costs and fill-ups made here become ordinary records the app imports, like ones made on the iPhone.
    async saveCost(kind, c, isNew) {
      const fuel = kind === "fuel";
      const ts = (d) => ({ value: d.getTime(), type: "TIMESTAMP" });
      const fields = fuel
        ? { CD_date: ts(c.date), CD_totalCost: { value: c.cost, type: "DOUBLE" }, CD_gallons: { value: c.gallons, type: "DOUBLE" },
            CD_station: { value: c.station, type: "STRING" } }
        : { CD_date: ts(c.date), CD_kindRaw: { value: c.kind, type: "STRING" }, CD_amount: { value: c.amount, type: "DOUBLE" },
            CD_note: { value: c.note, type: "STRING" } };
      if (c.vehicleId) fields.CD_vehicle = { value: c.vehicleId, type: "STRING" };
      if (isNew) {
        Object.assign(fields, { CD_entityName: { value: fuel ? "FuelEntry" : "VehicleExpense", type: "STRING" },
          CD_id: { value: uuid(), type: "STRING" }, CD_createdAt: ts(new Date()) });
        if (fuel) Object.assign(fields, { CD_odometer: { value: 0, type: "DOUBLE" }, CD_note: { value: "", type: "STRING" }, CD_sourceRaw: { value: "manual", type: "STRING" } });
      }
      const rec = { recordName: isNew ? uuid() : c.id, recordType: fuel ? "CD_FuelEntry" : "CD_VehicleExpense", fields };
      if (!isNew) rec.recordChangeTag = (this._recs[c.id] || {}).recordChangeTag;
      const res = await this.db.saveRecords([rec], { zoneID: ZONE });
      if (res.hasErrors) throw res.errors[0];
      this.merge(res.records);
      return { data: this.build(), id: rec.recordName };
    },

    async deleteCost(id) {
      const res = await this.db.deleteRecords([{ recordName: id }], { zoneID: ZONE });
      if (res.hasErrors) throw res.errors[0];
      delete this._recs[id];
      return this.build();
    },

    merge(records) {
      for (const r of records || []) {
        const old = this._recs[r.recordName] || {};
        this._recs[r.recordName] = { ...old, ...r, fields: { ...(old.fields || {}), ...(r.fields || {}) } };
      }
    },

    // Receipt photos live in the same field the app uses, as an iCloud asset.
    async uploadReceipt(id, field, file, history) {
      const r = this._recs[id];
      const recs = [{ recordName: id, recordType: r.recordType, recordChangeTag: r.recordChangeTag,
        fields: { ["CD_" + field + "_ckAsset"]: { value: file } } }];
      if (history && r.recordType === "CD_Trip") {
        recs.push({ recordName: uuid(), recordType: "CD_TripEdit", fields: {
          CD_entityName: { value: "TripEdit" }, CD_date: { value: Date.now(), type: "TIMESTAMP" }, CD_field: { value: history + " (web)" },
          CD_oldValue: { value: "" }, CD_newValue: { value: "photo added" }, CD_trip: { value: id } } });
      }
      const res = await this.db.saveRecords(recs, { zoneID: ZONE, atomic: true });
      if (res.hasErrors) throw res.errors[0];
      this.merge(res.records);
      return this.build();
    },

    async receiptURL(id, field) {
      const res = await this.db.fetchRecords([{ recordName: id }], { zoneID: ZONE, desiredKeys: ["CD_" + field, "CD_" + field + "_ckAsset"] });
      const r = res.records && res.records[0];
      if (!r || !r.fields) return null;
      const inline = r.fields["CD_" + field] && r.fields["CD_" + field].value;
      const asset = r.fields["CD_" + field + "_ckAsset"] && r.fields["CD_" + field + "_ckAsset"].value;
      if (inline) {
        const bin = atob(inline);
        return URL.createObjectURL(new Blob([Uint8Array.from(bin, (c) => c.charCodeAt(0))], { type: "image/jpeg" }));
      }
      return asset && asset.downloadURL ? asset.downloadURL.replace("${f}", "receipt.jpg") : null;
    },

    async route(t) {
      const res = await this.db.fetchRecords([{ recordName: t.id }], { zoneID: ZONE, desiredKeys: ["CD_routeData", "CD_routeData_ckAsset"] });
      const r = res.records && res.records[0];
      if (!r || !r.fields) return [];
      let text = null;
      const inline = r.fields.CD_routeData && r.fields.CD_routeData.value;
      const asset = r.fields.CD_routeData_ckAsset && r.fields.CD_routeData_ckAsset.value;
      if (inline) {
        const bin = atob(inline);
        text = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
      } else if (asset && asset.downloadURL) {
        const resp = await fetch(asset.downloadURL.replace("${f}", "route.json"));
        if (resp.ok) text = await resp.text();
      }
      if (!text) return [];
      return JSON.parse(text).map((p) => [p.lat, p.lon]);
    },

    async save(t, changes) {
      const now = Date.now();
      const fields = {};
      for (const [k, v] of Object.entries(changes.fields)) {
        if (k === "classifiedAt") continue;
        fields["CD_" + k] = typeof v === "boolean" ? { value: v ? 1 : 0, type: "INT64" }
          : typeof v === "number" ? { value: v, type: "DOUBLE" } : { value: v, type: "STRING" };
      }
      if (changes.fields.classifiedAt !== undefined) fields.CD_classifiedAt = { value: now, type: "TIMESTAMP" };
      const records = [{ recordName: t.id, recordType: "CD_Trip", recordChangeTag: t.rec.recordChangeTag, fields }];
      for (const h of changes.history) {
        records.push({
          recordName: uuid(), recordType: "CD_TripEdit",
          fields: {
            CD_entityName: { value: "TripEdit" },
            CD_date: { value: now, type: "TIMESTAMP" },
            CD_field: { value: h.field + " (web)" },
            CD_oldValue: { value: h.old },
            CD_newValue: { value: h.new },
            CD_trip: { value: t.id },
          },
        });
      }
      const res = await this.db.saveRecords(records, { zoneID: ZONE, atomic: true });
      if (res.hasErrors) {
        const e = res.errors[0];
        const code = (e && (e.ckErrorCode || e.serverErrorCode)) || "";
        if (/CONFLICT/.test(code)) {
          const fresh = await this.db.fetchRecords([{ recordName: t.id }], { zoneID: ZONE, desiredKeys: DESIRED });
          const r = fresh.records && fresh.records[0];
          if (r && r.fields) this._recs[r.recordName] = r;
          const err = new Error("conflict"); err.conflict = true; throw err;
        }
        throw e;
      }
      for (const r of res.records) this._recs[r.recordName] = { ...(this._recs[r.recordName] || {}), ...r, fields: { ...((this._recs[r.recordName] || {}).fields || {}), ...r.fields } };
      return this.build();
    },
  };

  // ---------- Demo source (?demo) ----------
  const Demo = {
    async start() {},
    async access() { return { ok: true, region: (() => { const q = new URLSearchParams(location.search); return q.has("ca") ? "CA" : q.has("uk") ? "GB" : "US"; })(), province: "ON" }; },
    async load() { const d = window.MG_DEMO(); this.d = d; return d; },
    async route(t) { return t._route || []; },
    async save(t, changes) {
      const tt = this.d.trips.find((x) => x.id === t.id);
      const map = { categoryRaw: "category", tollAmount: "tolls", parkingAmount: "parking", mealAmount: "meal", business: "businessId" };
      for (const [k, v] of Object.entries(changes.fields)) {
        if (k === "classifiedAt") { tt.classifiedAt = new Date(); continue; }
        if (k === "tollSourceRaw") { tt.tollSource = v; continue; }
        if (k === "startAddress") { tt.from = v; continue; }
        if (k === "endAddress") { tt.to = v; continue; }
        tt[map[k] || k] = v;
      }
      this.d.editCounts[t.id] = (this.d.editCounts[t.id] || 0) + changes.history.length;
      await new Promise((r) => setTimeout(r, 250));
      return this.d;
    },
    async saveCost(kind, c, isNew) {
      const list = kind === "fuel" ? this.d.fuel : this.d.expenses;
      const id = isNew ? "N" + Date.now() : c.id;
      const i = list.findIndex((x) => x.id === id);
      const row = { ...(i >= 0 ? list[i] : {}), ...c, id };
      if (i >= 0) list[i] = row; else list.push(row);
      await new Promise((r) => setTimeout(r, 200));
      return { data: this.d, id };
    },
    async deleteCost(id) {
      this.d.fuel = this.d.fuel.filter((x) => x.id !== id);
      this.d.expenses = this.d.expenses.filter((x) => x.id !== id);
      return this.d;
    },
    async uploadReceipt(id, field) {
      for (const list of [this.d.trips, this.d.expenses, this.d.fuel]) {
        const x = list.find((y) => y.id === id);
        if (x) { if (field === "mealReceiptData") x.mealReceipt = true; else x.receipt = true; x.hasReceipt = true; }
      }
      await new Promise((r) => setTimeout(r, 300));
      return this.d;
    },
    async receiptURL() { return null; },
  };

  // Official amount per drive. Canada's step at 5,000 km counts every business drive earlier in the year,
  // and a drive that crosses it is split between the two rates.
  function computeAmounts() {
    S.amt = {};
    if (!RG.tier) {
      for (const t of S.trips) S.amt[t.id] = Math.round((t.meters / MI) * rateFor(t.category, t.start) * 100) / 100;
      return;
    }
    S.tiers = {};   // per drive: [distance at the first rate, rate, distance after, rate]
    const prior = {};
    for (const t of S.trips.slice().sort((a, b) => a.start - b.start)) {
      if (t.category !== "business") { S.amt[t.id] = 0; continue; }
      const y = taxYearOf(t.start), [hi, lo] = tierRates(y), d = t.meters / MI, before = prior[y] || 0;
      const first = Math.max(0, Math.min(d, RG.tier - before));
      S.amt[t.id] = Math.round((first * hi + (d - first) * lo) * 100) / 100;
      S.tiers[t.id] = [first, hi, d - first, lo];
      prior[y] = before + d;
    }
  }
  const amt = (t) => S.amt[t.id] || 0;

  function apply(data) {
    S.trips = data.trips.sort((a, b) => b.start - a.start);
    S.vehicles = data.vehicles; S.businesses = data.businesses;
    S.expenses = data.expenses.sort((a, b) => b.date - a.date);
    S.fuel = data.fuel.sort((a, b) => b.date - a.date);
    S.editCounts = data.editCounts;
    computeAmounts();
    if (S.selected && !S.trips.find((t) => t.id === S.selected)) { S.selected = null; S.draft = null; }
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
    h.open = help === "open";
  }

  function showApp() {
    $("#gate").hidden = true;
    $("#app").hidden = false;
    $("#who-name").textContent = S.user;
    $("#who-plan").textContent = S.pro ? " · Pro" : "";
    route();
  }

  async function signedIn(identity) {
    const nc = identity && identity.nameComponents;
    S.user = nc && (nc.givenName || nc.familyName) ? [nc.givenName, nc.familyName].filter(Boolean).join(" ") : "Signed in";
    gate("Opening your drives…", "Reading from your iCloud.", '<div class="spin"></div>');
    $("#apple-sign-in-button").hidden = true;
    $("#apple-go").hidden = true;
    try {
      await S.source.start();
      const [acc, data] = await Promise.all([S.source.access(), S.source.load()]);
      const pro = acc.ok;
      setRegion(acc);
      if (data.empty) {
        return gate("No MileGuard drives yet",
          "We couldn't find MileGuard data in this iCloud account. Get MileGuard on your iPhone, sign in to the same Apple ID, and your drives will show up here.",
          '<a class="btn primary block" href="/mileguard.html">Get MileGuard for iPhone</a>' + signOutLink());
      }
      if (!pro) {
        return gate("Web access is part of MileGuard Pro",
          "Upgrade in the app under Settings, then open MileGuard once on your iPhone so it can unlock this page. Already Pro? Open the app and come back.",
          '<button class="btn primary block" id="retry">Check again</button>' + signOutLink());
      }
      S.pro = true;
      apply(data);
      showApp();
      ShareCloud.sweep().catch(() => {});
    } catch (e) {
      console.error("MileGuard load error", e);
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
  const authErr = (e) => /AUTHENTICATION|NOT_AUTHENTICATED|ACCESS_DENIED|AUTH_PERSIST/i.test((e && (e.ckErrorCode || e.serverErrorCode || e.message)) || "");
  // Shown small under the buttons so a screenshot tells us exactly what CloudKit said.
  const errText = (e) => {
    const parts = [e && (e.ckErrorCode || e.serverErrorCode), e && (e.reason || e.message)].filter(Boolean);
    return parts.length ? `<p class="fine">Details: ${esc(parts.join(" · ").slice(0, 200))}</p>` : "";
  };
  const signOutLink = () => '<button class="btn block" id="gate-out">Sign out</button>';

  // Our own button, forwarding to Apple's control. If Apple's control can't be found, show Apple's instead.
  function appleTarget() { const box = $("#apple-sign-in-button"); return box && (box.querySelector('[role="button"],button,a') || box.firstElementChild); }
  function showAppleGo() {
    let tries = 0;
    (function wait() {
      const t = appleTarget();
      // A click can't be forwarded into a cross-origin frame; in that case just show Apple's own button.
      if (t && t.tagName !== "IFRAME" && !t.querySelector("iframe")) { $("#apple-go").hidden = false; return; }
      if (t) { $("#apple-sign-in-button").classList.remove("ck-hidden"); return; }
      if (++tries < 40) return setTimeout(wait, 100);
      $("#apple-sign-in-button").classList.remove("ck-hidden");
    })();
  }

  function initCloud() {
    if (S.source) return;
    if (!CFG.apiToken) {
      return gate("Almost ready", "MileGuard on the web isn't switched on yet. Try the demo to see how it works.",
        '<a class="btn primary block" href="?demo#/drives">See the demo</a>');
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
      gate("Your drives, on a bigger screen",
        "Review and classify drives, fix purposes and download your logs. Sign in with the Apple ID you use on your iPhone.", "", true);
      $("#apple-sign-in-button").hidden = false;
      showAppleGo();
      c.whenUserSignsIn().then(signedIn);
    };
    c.setUpAuth().then((id) => (id ? signedIn(id) : waitIn())).catch(() => waitIn());
    c.whenUserSignsOut().then(() => location.reload());
  }

  function boot() {
    const demo = new URLSearchParams(location.search).has("demo");
    const now = new Date();
    S.month = { y: now.getFullYear(), m: now.getMonth() };
    if (demo) {
      S.source = Demo; S.user = "Alex Rivera";
      $("#sign-out").hidden = true;
      $("#demo-out").hidden = false;
      $("#demo-out").href = location.pathname;
      Demo.access().then(setRegion).then(() => Demo.load()).then((d) => { S.pro = true; apply(d); showApp(); });
      return;
    }
    gate("Your drives, on a bigger screen", "Loading…", '<div class="spin"></div>');
    if (window.CloudKit) initCloud();
    else {
      window.addEventListener("cloudkitloaded", initCloud);
      setTimeout(() => { if (!window.CloudKit) gate("Couldn't load Apple's sign-in", "Check your connection, or turn off any content blocker for this page, then reload."); }, 12000);
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("#retry")) location.reload();
    if (e.target.closest("#apple-go")) { const t = appleTarget(); if (t) t.click(); return; }
    if (e.target.closest("#sign-out")) {
      e.preventDefault();
      // Apple's own sign-out control does the work; it sits off-screen so the sidebar keeps its look.
      const box = $("#apple-sign-out-button");
      const target = box && (box.querySelector('[role="button"],button,a') || box.firstElementChild);
      if (target) target.click();
      setTimeout(() => {
        try { Object.keys(localStorage).filter((k) => /cloudkit|ck/i.test(k)).forEach((k) => localStorage.removeItem(k)); } catch (_) {}
        location.reload();
      }, 1500);
    }
    if (e.target.closest("#gate-out")) {
      const c = window.CloudKit && CloudKit.getDefaultContainer();
      if (c && c.signOut) c.signOut().then(() => location.reload()); else location.reload();
    }
  });

  // Pick up changes made on the iPhone when the tab comes back into focus.
  let lastSync = Date.now();
  window.addEventListener("focus", async () => {
    if (S.source !== Cloud || !S.pro || Date.now() - lastSync < 30000 || S.draftDirty) return;
    lastSync = Date.now();
    try { apply(await Cloud.load()); render(); } catch (e) { /* keep what's on screen */ }
  });

  // ---------- routing ----------
  function route() {
    const [, view, arg] = (location.hash || "#/drives").split("/");
    S.view = ["overview", "drives", "costs", "reports"].includes(view) ? view : "drives";
    if (S.view === "drives" && arg) S.filter = arg;
    document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.view === S.view));
    render();
    $("#main").focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", () => { if (!$("#app").hidden) route(); });

  function render() {
    const n = S.trips.filter(needsReview).length;
    const b = $("#badge");
    b.hidden = !n; b.textContent = n;
    const views = { overview: renderOverview, drives: renderDrives, costs: renderCosts, reports: renderReports };
    $("#main").innerHTML = views[S.view]();
    if (S.view === "drives" && S.selected) drawMap();
  }

  // ---------- shared pieces ----------
  const monthTrips = () => S.trips.filter((t) => t.start.getFullYear() === S.month.y && t.start.getMonth() === S.month.m);
  function availableMonths() {
    const now = new Date();
    const keys = new Set(S.trips.map((t) => ymKey(t.start)));
    keys.add(ymKey(now));
    return [...keys].sort((a, b) => b - a).map((k) => ({ y: Math.floor(k / 100), m: k % 100 }));
  }
  function monthPicker() {
    const ms = availableMonths();
    const cur = S.month.y * 100 + S.month.m;
    const i = ms.findIndex((x) => x.y * 100 + x.m === cur);
    return `<div class="month">
      <button data-act="month" data-d="1" aria-label="Previous month" ${i >= ms.length - 1 ? "disabled" : ""}>‹</button>
      <select data-act="month-pick" aria-label="Month">${ms.map((x) => `<option value="${x.y}-${x.m}" ${x.y * 100 + x.m === cur ? "selected" : ""}>${monthName(x.y, x.m)}</option>`).join("")}</select>
      <button data-act="month" data-d="-1" aria-label="Next month" ${i <= 0 ? "disabled" : ""}>›</button></div>`;
  }
  const kpi = (l, v, s) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s || "&nbsp;"}</div></div>`;

  function summarize(trips) {
    const s = { total: 0, business: 0, commute: 0, personal: 0, medical: 0, charity: 0, deduction: 0, tolls: 0, parking: 0,
      meals: 0, mealsDeductible: 0, mealCount: 0, count: trips.length, unreviewed: 0, missing: 0 };
    for (const t of trips) {
      const m = t.meters / MI;
      s.total += m;
      if (t.category in s) s[t.category] += m;
      s.deduction += amt(t);
      if (t.category === "business") { s.tolls += t.tolls; s.parking += t.parking; }
      if (mealIsBusiness(t)) { s.meals += t.meal; s.mealsDeductible += t.meal * 0.5; s.mealCount++; }
      if (t.category === "unclassified") s.unreviewed++;
      if (missingPurpose(t)) s.missing++;
    }
    s.pct = s.total ? (s.business / s.total) * 100 : 0;
    return s;
  }

  // ---------- Drives ----------
  function filtered() {
    const q = S.search.trim().toLowerCase();
    return monthTrips().filter((t) => {
      if (S.filter === "review" && t.category !== "unclassified") return false;
      if (S.filter === "purpose" && !missingPurpose(t)) return false;
      if (S.filter === "business" && t.category !== "business") return false;
      if (S.filter === "personal" && !["personal", "commute"].includes(t.category)) return false;
      if (q && ![t.from, t.to, t.purpose, t.client, vehicleName(t.vehicleId)].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderDrives() {
    const mt = monthTrips();
    const s = summarize(mt);
    const rate = rateFor("business", new Date(S.month.y, S.month.m + 1, 0));
    const pill = (k, l) => `<button class="${S.filter === k ? "on" : ""}" data-act="filter" data-k="${k}">${l}</button>`;
    const list = filtered();
    const days = [];
    for (const t of list) {
      const k = iso(t.start);
      let d = days[days.length - 1];
      if (!d || d.k !== k) days.push((d = { k, date: t.start, trips: [] }));
      d.trips.push(t);
    }
    const rows = days.map((d) => `<div class="card day">
      <div class="day-h"><span>${esc(dayLabel(d.date))} · ${d.trips.length} drive${d.trips.length > 1 ? "s" : ""}</span><span>${miles(d.trips.reduce((a, t) => a + t.meters, 0))} ${RG.unit}</span></div>
      ${d.trips.map(rowHTML).join("")}</div>`).join("");
    const emptyText = S.search ? "No drives match your search." : S.filter === "all" ? "No drives this month." : "Nothing here this month.";
    return `<div class="topbar"><h1>Drives</h1>${monthPicker()}
      <div class="right"><label class="search">${icon(I.search)}<input data-act="search" aria-label="Search drives" placeholder="Address, purpose or client" value="${esc(S.search)}"></label>
      <button class="btn primary" data-act="quick-log">${icon(I.dl)}Download log</button></div></div>
    <div class="kpis">
      ${kpi("Total distance", `${num(s.total)} ${RG.unit}`, `${s.count} drive${s.count === 1 ? "" : "s"}`)}
      ${kpi("Business", `${num(s.business)} ${RG.unit}`, s.total ? `${Math.round(s.pct)}% business use` : "")}
      ${kpi(RG.value, money(s.deduction), `at ${cents(rate)}`)}
      ${kpi("Tolls &amp; parking", money(s.tolls + s.parking), "business drives")}
      ${RG.uk ? kpi("Meals", money(s.meals), "on business drives") : kpi("Meals (50%)", money(s.mealsDeductible), s.mealCount ? `${s.mealCount} business meal${s.mealCount > 1 ? "s" : ""}` : "")}
    </div>
    <div class="bar"><div class="pills" role="tablist">${pill("all", "All")}${pill("review", `Needs review${s.unreviewed ? " " + s.unreviewed : ""}`)}${s.missing || S.filter === "purpose" ? pill("purpose", `Missing purpose ${s.missing}`) : ""}${pill("business", "Business")}${pill("personal", "Personal")}</div>
      <span class="note">Changes save to your iCloud and show up on your iPhone.</span></div>
    <div class="split"><div class="list">${rows || `<div class="card empty"><b>${emptyText}</b>New drives appear here after your iPhone syncs.</div>`}</div>
    ${detailHTML()}</div>`;
  }

  function rowHTML(t) {
    const c = CATS[t.category] || CATS.unclassified;
    let sub;
    if (t.lockedFree) sub = '<span class="warn">Over the free limit. Opens with Pro in the app</span>';
    else if (t.category === "unclassified") sub = '<span class="warn">Needs a type</span>';
    else if (t.category === "business") sub = [t.purpose, t.client].filter(Boolean).map(esc).join(" · ") || '<span class="warn">Add a purpose</span>';
    else sub = esc(c.label);
    const extra = [t.tolls ? `Tolls ${money(t.tolls)}` : t.tollsLikely && t.category === "business" ? '<span class="warn">Toll road spotted</span>' : "",
      t.parking ? `Parking ${money(t.parking)}` : "", t.meal ? `Meal ${money(t.meal)}` : ""].filter(Boolean).join(" · ");
    return `<button class="row ${S.selected === t.id ? "sel" : ""}" data-act="pick" data-id="${esc(t.id)}">
      <span class="dot" style="background:${c.color}"></span><span class="t">${esc(time(t.start))}</span>
      <span style="min-width:0"><span class="r" style="display:block">${esc(t.from || "Start")} → ${esc(t.to || "End")}</span><span class="p" style="display:block">${sub}${extra ? " · " + extra : ""}</span></span>
      <span class="c" style="color:${c.color}">${esc(c.label)}</span><span class="m">${miles(t.meters)}</span></button>`;
  }

  function recentPairs(exclude) {
    const seen = new Set(), out = [];
    for (const t of S.trips) {
      if (t.category !== "business" || t.id === exclude || !(t.purpose || t.client)) continue;
      const k = (t.purpose + "|" + t.client).toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k); out.push({ purpose: t.purpose, client: t.client });
      if (out.length >= 8) break;
    }
    return out;
  }

  function detailHTML() {
    const t = S.trips.find((x) => x.id === S.selected);
    if (!t) return `<div class="card detail empty" style="position:sticky;top:24px"><b>Pick a drive</b>Click any drive to classify it, add a purpose, tolls, parking or a meal.</div>`;
    const d = S.draft;
    const fmtAmt = (v) => (v ? String(Math.round(v * 100) / 100) : "");
    const range = `${dayLabel(t.start)} · ${time(t.start)}${t.end ? "–" + time(t.end) : ""}`;
    const bizList = Object.values(S.businesses).sort((a, b) => a.createdAt - b.createdAt);
    const locked = t.lockedFree;
    const seg = ASSIGNABLE.map((k) => `<button class="${d.category === k ? "on" : ""}" data-act="cat" data-k="${k}" ${locked ? "disabled" : ""}>${CATS[k].label}</button>`).join("");
    const chips = recentPairs(t.id).map((p) => {
      const on = p.purpose === d.purpose && p.client === d.client;
      return `<button class="${on ? "on" : ""}" data-act="chip" data-p="${esc(p.purpose)}" data-c="${esc(p.client)}">${esc([p.purpose, p.client].filter(Boolean).join(" · "))}</button>`;
    }).join("");
    const biz = d.category === "business";
    const edits = S.editCounts[t.id] || 0;
    return `<div class="card detail open" aria-label="Drive details">
      <div class="hd"><h2>${miles(t.meters)} ${RG.unit}</h2><span>${esc(range)}</span><button class="btn close" data-act="unpick" aria-label="Close">✕</button></div>
      <div class="map" id="map">${mapSVG(t)}</div>
      <div style="margin-top:10px">
        ${locked ? `<div class="field"><span>From</span><span>${esc(t.from || "—")}</span></div>
        <div class="field"><span>To</span><span>${esc(t.to || "—")}</span></div>` : ""}
        <div class="field"><span>Vehicle</span><span>${esc(vehicleLabel(t.vehicleId) || "—")}</span></div>
        ${t.autoRule ? `<div class="field"><span>Classified by</span><span>${esc(t.autoRule)}</span></div>` : ""}
        ${edits ? `<div class="field"><span>Change history</span><span>${edits} change${edits > 1 ? "s" : ""} · see the app</span></div>` : ""}
      </div>
      ${locked ? `<p class="hint" style="margin-top:14px">This drive was recorded over the free monthly limit. Open MileGuard on your iPhone with Pro to unlock it.</p>` : `
      <form class="form" data-act="save" autocomplete="off">
        <label class="in">From<input name="from" value="${esc(d.from)}" maxlength="300"></label>
        <label class="in">To<input name="to" value="${esc(d.to)}" maxlength="300"></label>
        <div class="seg" role="group" aria-label="Drive type">${seg}</div>
        ${biz ? `
        <label class="in">Business purpose<input name="purpose" value="${esc(d.purpose)}" placeholder="What was the drive for?" maxlength="200"></label>
        ${chips ? `<div class="chips">${chips}</div>` : ""}
        <label class="in">Client or company<input name="client" value="${esc(d.client)}" placeholder="Optional" maxlength="200"></label>
        ${bizList.length > 1 ? `<label class="in">Business<select name="business">${bizList.map((b) => `<option value="${esc(b.id)}" ${(d.businessId || bizList[0].id) === b.id ? "selected" : ""}>${esc(b.name)}</option>`).join("")}</select></label>` : ""}
        <div class="three">
          <label class="in">Tolls<input name="tolls" inputmode="decimal" value="${fmtAmt(d.tolls)}" placeholder="${money(0)}"></label>
          <label class="in">Parking<input name="parking" inputmode="decimal" value="${fmtAmt(d.parking)}" placeholder="${money(0)}"></label>
          <label class="in">Meal<input name="meal" inputmode="decimal" value="${fmtAmt(d.meal)}" placeholder="${money(0)}"></label>
        </div>
        ${t.tollsLikely && !d.tolls ? `<div class="hint">Toll road spotted on this route. Add the amount from your toll statement.</div>` : ""}
        ${receiptRow(t.id, "receiptData", t.receipt, "Tolls or parking receipt")}
        ${d.meal ? `<label class="in">Who was there<input name="mealWith" value="${esc(d.mealWith)}" placeholder="Client or contact" maxlength="200"></label>
        <label class="check"><input type="checkbox" name="mealOvernight" ${d.mealOvernight ? "checked" : ""}> Away overnight</label>
        <div class="hint">${RG.uk ? "Meals while travelling for work can be allowable; entertaining clients isn't." : "A meal counts as business with a client or contact there, or on an overnight trip. 50% is deductible."}</div>
        ${receiptRow(t.id, "mealReceiptData", t.mealReceipt, "Meal receipt")}` : ""}` : ""}
        <div class="actions"><button type="button" class="btn" data-act="cancel">Cancel</button><button type="submit" class="btn primary" id="save-btn">Save</button></div>
      </form>`}
    </div>`;
  }

  // Route sketch. Uses the recorded route when it has loaded, otherwise a straight line between the ends.
  function mapSVG(t) {
    let pts = S.routes[t.id];
    if (!pts || pts.length < 2) pts = t.startLat || t.endLat ? [[t.startLat, t.startLon], [t.endLat, t.endLon]] : null;
    const link = t.startLat ? `<a href="https://maps.apple.com/?saddr=${t.startLat},${t.startLon}&daddr=${t.endLat},${t.endLon}" target="_blank" rel="noopener">Open in Maps</a>` : "";
    const grid = '<path d="M0 45H400M0 120H400M80 0V180M210 0V180M330 0V180" stroke="#fff" stroke-width="11"/>';
    if (!pts) return `<svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${grid}</svg>`;
    const lat0 = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const k = Math.cos((lat0 * Math.PI) / 180);
    const xs = pts.map((p) => p[1] * k), ys = pts.map((p) => -p[0]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = 360, h = 140, sc = Math.min(w / (maxX - minX || 1e-9), h / (maxY - minY || 1e-9));
    const ox = 20 + (w - (maxX - minX) * sc) / 2, oy = 20 + (h - (maxY - minY) * sc) / 2;
    const P = xs.map((x, i) => [ox + (x - minX) * sc, oy + (ys[i] - minY) * sc]);
    const step = Math.max(1, Math.floor(P.length / 400));
    const d = P.filter((_, i) => i % step === 0 || i === P.length - 1).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
    const a = P[0], b = P[P.length - 1];
    return `<svg viewBox="0 0 400 180" aria-label="Route sketch">${grid}<path d="${d}" fill="none" stroke="var(--br)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${a[0]}" cy="${a[1]}" r="7" fill="var(--br)"/><circle cx="${b[0]}" cy="${b[1]}" r="7" fill="var(--red)"/></svg>${link}`;
  }

  async function drawMap() {
    const t = S.trips.find((x) => x.id === S.selected);
    if (!t) return;
    if (!S.routes[t.id]) {
      S.routes[t.id] = [];
      try { S.routes[t.id] = await S.source.route(t); } catch (e) { /* straight line instead */ }
    }
    if (S.selected !== t.id) return;
    let pts = S.routes[t.id];
    if (!pts || pts.length < 2) pts = t.startLat || t.endLat ? [[t.startLat, t.startLon], [t.endLat, t.endLon]] : null;
    if (!pts) return;
    if (CFG.mapkitToken && (await realMap(t, pts))) return;
    const m = $("#map");
    if (m) m.innerHTML = mapSVG(t);
  }

  // Apple Maps on the web (MapKit JS). Only loads when a token is set in config.js.
  let mapkitReady = null;
  function loadMapKit() {
    if (!mapkitReady) {
      mapkitReady = loadScript("https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js").then(() => {
        mapkit.init({ authorizationCallback: (done) => done(CFG.mapkitToken) });
        return window.mapkit;
      }).catch(() => null);
    }
    return mapkitReady;
  }
  async function realMap(t, pts) {
    const M = await loadMapKit();
    const el = $("#map");
    if (!M || !el || S.selected !== t.id) return false;
    try {
      const link = el.querySelector("a") ? el.querySelector("a").outerHTML : "";
      el.innerHTML = '<div id="mk" style="position:absolute;inset:0"></div>' + link;
      const map = new M.Map("mk", { showsCompass: M.FeatureVisibility.Hidden, showsMapTypeControl: false, showsScale: M.FeatureVisibility.Hidden,
        isRotationEnabled: false, colorScheme: M.Map.ColorSchemes.Light, showsPointsOfInterest: false });
      const coords = pts.map((p) => new M.Coordinate(p[0], p[1]));
      const line = new M.PolylineOverlay(coords, { style: new M.Style({ lineWidth: 5, strokeColor: "#0E8A63", lineCap: "round", lineJoin: "round" }) });
      map.addOverlay(line);
      map.addAnnotations([
        new M.MarkerAnnotation(coords[0], { color: "#0E8A63", glyphText: "A", title: t.from }),
        new M.MarkerAnnotation(coords[coords.length - 1], { color: "#E5534B", glyphText: "B", title: t.to }),
      ]);
      map.showItems([line], { animate: false, padding: new M.Padding(36, 30, 36, 30) });
      return true;
    } catch (e) { console.error(e); return false; }
  }

  function pick(id) {
    const t = S.trips.find((x) => x.id === id);
    if (!t) return;
    S.selected = id;
    S.draft = { from: t.from, to: t.to, category: t.category === "unclassified" ? "" : t.category, purpose: t.purpose, client: t.client, businessId: t.businessId,
      tolls: t.tolls, parking: t.parking, meal: t.meal, mealWith: t.mealWith, mealOvernight: t.mealOvernight };
    S.draftDirty = false;
    render();
  }

  function readForm() {
    const f = $("form.form");
    if (!f) return;
    const d = S.draft;
    const amt = (n) => { const v = parseFloat(String(n || "").replace(/[$,\s]/g, "")); return isFinite(v) && v >= 0 ? Math.round(v * 100) / 100 : 0; };
    if (f.from) d.from = f.from.value.trim();
    if (f.to) d.to = f.to.value.trim();
    if (f.purpose) d.purpose = f.purpose.value.trim();
    if (f.client) d.client = f.client.value.trim();
    if (f.business) d.businessId = f.business.value;
    if (f.tolls) d.tolls = amt(f.tolls.value);
    if (f.parking) d.parking = amt(f.parking.value);
    if (f.meal) d.meal = amt(f.meal.value);
    if (f.mealWith) d.mealWith = f.mealWith.value.trim();
    if (f.mealOvernight) d.mealOvernight = f.mealOvernight.checked;
  }

  async function save() {
    readForm();
    const t = S.trips.find((x) => x.id === S.selected);
    const d = S.draft;
    if (!t || !d) return;
    if (!d.category) return toast("Pick a type for this drive first.");
    const fields = {}, history = [];
    const two = (v) => (v || 0).toFixed(2);
    const put = (key, oldV, newV, show) => {
      if (oldV === newV) return;
      fields[key] = newV;
      history.push({ field: HISTORY[key], old: show ? show(oldV) : String(oldV), new: show ? show(newV) : String(newV) });
    };
    put("startAddress", t.from, d.from);
    put("endAddress", t.to, d.to);
    put("categoryRaw", t.category, d.category);
    if (d.category === "business") {
      put("purpose", t.purpose, d.purpose);
      put("client", t.client, d.client);
      if (d.businessId && d.businessId !== t.businessId) {
        fields.business = d.businessId;
        history.push({ field: "business", old: (S.businesses[t.businessId] || {}).name || "", new: (S.businesses[d.businessId] || {}).name || "" });
      }
      put("tollAmount", t.tolls, d.tolls, two);
      put("parkingAmount", t.parking, d.parking, two);
      put("mealAmount", t.meal, d.meal, two);
      put("mealWith", t.mealWith, d.mealWith);
      put("mealOvernight", t.mealOvernight, d.mealOvernight);
    }
    if (!history.length) { S.draftDirty = false; return toast("Nothing changed."); }
    if ("tollAmount" in fields) fields.tollSourceRaw = "manual";
    if ("categoryRaw" in fields) { fields.autoRule = ""; if (!t.classifiedAt) fields.classifiedAt = true; }
    const btn = $("#save-btn");
    if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }
    try {
      apply(await S.source.save(t, { fields, history }));
      S.draftDirty = false;
      toast("Saved. It'll be on your iPhone shortly.");
      // Move on to the next drive that still needs a look, the way the app does.
      const now = S.trips.find((x) => x.id === t.id);
      const next = filtered().find((x) => x.id !== t.id && needsReview(x));
      if (next && now && !needsReview(now) && (S.filter === "review" || S.filter === "purpose")) pick(next.id); else pick(t.id);
    } catch (e) {
      console.error(e);
      if (e.conflict) { apply(Cloud.build()); pick(t.id); toast("This drive changed on your iPhone. We reloaded it. Check it and save again."); }
      else { toast("Couldn't save. Check your connection and try again."); if (btn) { btn.disabled = false; btn.textContent = "Save"; } }
    }
  }

  // ---------- Overview ----------
  function renderOverview() {
    const y = new Date().getFullYear();
    const yt = S.trips.filter((t) => t.start.getFullYear() === y);
    const s = summarize(yt);
    const all = summarize(S.trips);
    const tollsMissing = S.trips.filter((t) => !t.lockedFree && t.category === "business" && t.tollsLikely && !t.tolls).length;
    const bars = [];
    for (let m = 0; m < 12; m++) {
      const mt = yt.filter((t) => t.start.getMonth() === m);
      const b = mt.filter((t) => t.category === "business").reduce((a, t) => a + t.meters / MI, 0);
      const o = mt.reduce((a, t) => a + t.meters / MI, 0) - b;
      bars.push({ m, b, o });
    }
    const max = Math.max(1, ...bars.map((x) => x.b + x.o));
    const barHTML = bars.map((x) => `<div title="${monthName(y, x.m)}: ${num(x.b)} business ${RG.unit}, ${num(x.o)} other">
      <i class="p" style="height:${(x.o / max) * 120}px;border-radius:6px 6px 0 0"></i><i style="height:${(x.b / max) * 120}px;border-radius:0 0 2px 2px;margin-top:-6px"></i>
      <small>${new Date(y, x.m, 1).toLocaleDateString("en-US", { month: "short" })}</small></div>`).join("");
    const byVehicle = {};
    for (const t of yt) {
      const k = t.vehicleId || "";
      const v = (byVehicle[k] = byVehicle[k] || { total: 0, business: 0, deduction: 0 });
      v.total += t.meters / MI;
      if (t.category === "business") v.business += t.meters / MI;
      v.deduction += amt(t);
    }
    const todo = [
      all.unreviewed ? `<a href="#/drives/review" data-act="jump" data-f="review"><span>Drives that need a type</span><b>${all.unreviewed}</b></a>` : "",
      all.missing ? `<a href="#/drives/purpose" data-act="jump" data-f="purpose"><span>Business drives missing a purpose</span><b>${all.missing}</b></a>` : "",
      tollsMissing ? `<a href="#/drives/business" data-act="jump" data-f="business"><span>Toll roads spotted with no amount</span><b>${tollsMissing}</b></a>` : "",
    ].join("");
    return `<div class="topbar"><h1>Overview</h1><span class="muted">${y} so far</span></div>
    <div class="kpis">
      ${kpi("Total distance", `${num(s.total, 0)} ${RG.unit}`, `${s.count} drives`)}
      ${kpi("Business", `${num(s.business, 0)} ${RG.unit}`, s.total ? `${Math.round(s.pct)}% business use` : "")}
      ${kpi(RG.deduction, money(s.deduction), RG.rateName)}
      ${kpi("Tolls &amp; parking", money(s.tolls + s.parking), "deductible on top")}
      ${RG.uk ? kpi("Meals", money(s.meals), "on business drives") : kpi("Meals (50%)", money(s.mealsDeductible), RG.meals)}
    </div>
    <div class="two">
      <div class="card"><b>Miles by month</b> <span class="muted" style="font-size:12px">· green is business</span><div class="bars">${barHTML}</div></div>
      <div class="card"><b>To do</b><div class="todo" style="margin-top:6px">${todo || '<p class="muted" style="margin:10px 0 0">All caught up. Every drive has a type and every business drive has a purpose.</p>'}</div></div>
    </div>
    <div class="card"><b>By vehicle</b><div class="table-wrap"><table style="margin-top:8px"><thead><tr><th>Vehicle</th><th class="n">Total ${RG.unit}</th><th class="n">Business ${RG.unit}</th><th class="n">Business use</th><th class="n">Mileage value</th></tr></thead><tbody>
      ${Object.entries(byVehicle).map(([k, v]) => `<tr><td>${esc(vehicleLabel(k) || "No vehicle")}</td><td class="n">${num(v.total)}</td><td class="n">${num(v.business)}</td><td class="n">${v.total ? Math.round((v.business / v.total) * 100) : 0}%</td><td class="n">${money(v.deduction)}</td></tr>`).join("") || '<tr><td colspan="5" class="muted">No drives yet this year.</td></tr>'}
    </tbody></table></div></div>`;
  }

  // ---------- Costs ----------
  // ---------- receipts ----------
  function receiptRow(id, field, has, label) {
    return `<div class="receipt"><span>${label}</span>
      ${has ? `<button type="button" class="link" data-act="receipt-view" data-id="${esc(id)}" data-f="${field}">View</button>` : ""}
      <label class="link">${has ? "Replace" : "Add photo"}<input type="file" accept="image/*" data-act="receipt-up" data-id="${esc(id)}" data-f="${field}" hidden></label></div>`;
  }

  // Phones take big photos; a receipt reads fine at 1600 px.
  async function shrink(file) {
    try {
      const img = await createImageBitmap(file);
      const k = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.82));
      return new File([blob], "receipt.jpg", { type: "image/jpeg" });
    } catch (e) { return file; }
  }

  async function uploadReceipt(el) {
    const file = el.files && el.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) return toast("Pick a photo of the receipt.");
    toast("Uploading receipt…");
    try {
      const small = await shrink(file);
      const label = el.dataset.f === "mealReceiptData" ? "meal receipt" : "receipt";
      apply(await S.source.uploadReceipt(el.dataset.id, el.dataset.f, small, label));
      toast("Receipt saved. It'll be on your iPhone shortly.");
      render();
      if (S.modal) openCost(S.modal.kind, el.dataset.id);
    } catch (e) { console.error(e); toast("Couldn't upload the receipt. Try again."); }
  }

  async function viewReceipt(id, field) {
    const w = window.open("", "_blank");
    try {
      const url = await S.source.receiptURL(id, field);
      if (!url) { if (w) w.close(); return toast(S.source === Demo ? "Sample receipts aren't included in the demo." : "No receipt found."); }
      if (w) w.location = url; else location.href = url;
    } catch (e) { if (w) w.close(); toast("Couldn't open the receipt."); }
  }

  // ---------- cost editor ----------
  function modalHost() {
    let m = $("#modal");
    if (!m) { m = document.createElement("div"); m.id = "modal"; document.body.appendChild(m); }
    return m;
  }
  function closeModal() { S.modal = null; modalHost().innerHTML = ""; }

  function openCost(kind, id) {
    const fuel = kind === "fuel";
    const list = fuel ? S.fuel : S.expenses;
    const c = id ? list.find((x) => x.id === id) : null;
    const vs = Object.values(S.vehicles).sort((a, b) => a.createdAt - b.createdAt);
    const def = (vs.find((v) => v.isDefault) || vs[0] || {}).id || "";
    const today = new Date();
    const d = c ? c.date : (S.month.y === today.getFullYear() && S.month.m === today.getMonth() ? today : new Date(S.month.y, S.month.m, 1, 12));
    S.modal = { kind, id: c ? c.id : null, confirmDelete: false };
    const val = (v) => (v ? String(Math.round(v * 1000) / 1000) : "");
    modalHost().innerHTML = `<div class="scrim" data-act="modal-close"></div>
    <form class="card sheet" data-act="cost-save" autocomplete="off" role="dialog" aria-label="${fuel ? "Fill-up" : "Car cost"}">
      <div class="hd"><h2>${c ? "Edit" : "Add"} ${fuel ? "fill-up" : "car cost"}</h2><button type="button" class="btn close" style="display:inline-flex" data-act="modal-close" aria-label="Close">✕</button></div>
      <div class="form">
        <div class="three" style="grid-template-columns:1fr 1fr">
          <label class="in">Date<input type="date" name="date" value="${iso(d)}" required></label>
          <label class="in">${fuel ? "Total cost" : "Amount"}<input name="amount" inputmode="decimal" value="${val(c && (fuel ? c.cost : c.amount))}" placeholder="0.00" required></label>
        </div>
        ${fuel ? `<div class="three" style="grid-template-columns:1fr 1fr">
          <label class="in">${RG.vol === "L" ? "Litres" : "Gallons"}<input name="gallons" inputmode="decimal" value="${val(c && c.gallons)}" placeholder="Optional"></label>
          <label class="in">Station<input name="station" value="${esc(c ? c.station : "")}" maxlength="120" placeholder="Optional"></label></div>`
        : `<label class="in">Kind<select name="kind">${Object.entries(EXPENSE).map(([k, l]) => `<option value="${k}" ${(c ? c.kind : "maintenance") === k ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
          <label class="in">Note<input name="note" value="${esc(c ? c.note : "")}" maxlength="200" placeholder="Optional"></label>`}
        ${vs.length ? `<label class="in">Vehicle<select name="vehicle">${vs.map((v) => `<option value="${esc(v.id)}" ${(c ? c.vehicleId || def : def) === v.id ? "selected" : ""}>${esc(vehicleLabel(v.id))}</option>`).join("")}</select></label>` : ""}
        ${c ? receiptRow(c.id, "receiptData", c.receipt, "Receipt") : `<p class="hint">Save first, then add a receipt photo.</p>`}
        <div class="actions">${c ? `<button type="button" class="btn danger" data-act="cost-delete" style="margin-right:auto">Delete</button>` : ""}
          <button type="button" class="btn" data-act="modal-close">Cancel</button><button type="submit" class="btn primary" id="cost-save">Save</button></div>
      </div>
    </form>`;
    const first = modalHost().querySelector("input[name=amount]");
    if (first && !c) first.focus();
  }

  async function saveCost(f) {
    const m = S.modal;
    const num = (v) => { const x = parseFloat(String(v || "").replace(/[^0-9.,-]/g, "").replace(",", ".")); return isFinite(x) && x >= 0 ? Math.round(x * 1000) / 1000 : 0; };
    const [y, mo, da] = f.date.value.split("-").map(Number);
    if (!y) return toast("Pick a date.");
    const amount = Math.round(num(f.amount.value) * 100) / 100;
    if (!amount) return toast("Enter the amount.");
    const c = m.kind === "fuel"
      ? { date: new Date(y, mo - 1, da, 12), cost: amount, gallons: num(f.gallons.value), station: f.station.value.trim(), vehicleId: f.vehicle ? f.vehicle.value : "" }
      : { date: new Date(y, mo - 1, da, 12), amount, kind: f.kind.value, note: f.note.value.trim(), vehicleId: f.vehicle ? f.vehicle.value : "" };
    if (m.id) c.id = m.id;
    const btn = $("#cost-save"); if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }
    try {
      const res = await S.source.saveCost(m.kind, c, !m.id);
      apply(res.data);
      S.month = { y: c.date.getFullYear(), m: c.date.getMonth() };
      render();
      if (!m.id) { openCost(m.kind, res.id); toast("Saved. Add a receipt photo if you have one."); }
      else { closeModal(); toast("Saved. It'll be on your iPhone shortly."); }
    } catch (e) {
      console.error(e);
      toast("Couldn't save. Check your connection and try again.");
      if (btn) { btn.disabled = false; btn.textContent = "Save"; }
    }
  }

  // Delete asks once in plain words, then deletes on the next click. A second click while it's working is ignored.
  async function deleteCost(el) {
    const m = S.modal;
    if (!m || !m.id || m.deleting) return;
    const label = m.kind === "fuel" ? "Fill-up" : "Car cost";
    const bar = el.closest(".actions");
    if (!m.confirmDelete) {
      m.confirmDelete = true;
      m.actionsHTML = bar.innerHTML;
      bar.classList.add("confirming");
      bar.innerHTML = `<p class="confirm-q" id="del-q" role="alert"><b>Delete this ${label.toLowerCase()}?</b> It will be removed from your reports and from your iPhone. This can't be undone.</p>
        <button type="button" class="btn" data-act="cost-delete-cancel">Keep it</button>
        <button type="button" class="btn danger solid" data-act="cost-delete" aria-describedby="del-q">Delete</button>`;
      bar.querySelector('[data-act="cost-delete-cancel"]').focus();
      return;
    }
    m.deleting = true;
    el.disabled = true; el.textContent = "Deleting…";
    try {
      apply(await S.source.deleteCost(m.id));
      closeModal(); render();
      toast(`${label} deleted. It'll be gone from your iPhone shortly.`);
    } catch (e) {
      console.error(e);
      m.deleting = false; el.disabled = false; el.textContent = "Delete";
      toast("Couldn't delete. Check your connection and try again.");
    }
  }

  function cancelDelete(el) {
    const m = S.modal, bar = el.closest(".actions");
    if (!m || !bar || m.deleting) return;
    m.confirmDelete = false;
    bar.classList.remove("confirming");
    bar.innerHTML = m.actionsHTML;
    const d = bar.querySelector('[data-act="cost-delete"]'); if (d) d.focus();
  }

  function renderCosts() {
    const inMonth = (d) => d.getFullYear() === S.month.y && d.getMonth() === S.month.m;
    const ex = S.expenses.filter((x) => inMonth(x.date));
    const fu = S.fuel.filter((x) => inMonth(x.date));
    const yEx = S.expenses.filter((x) => x.date.getFullYear() === S.month.y).reduce((a, x) => a + x.amount, 0);
    const yFu = S.fuel.filter((x) => x.date.getFullYear() === S.month.y).reduce((a, x) => a + x.cost, 0);
    const gallons = fu.reduce((a, x) => a + x.gallons, 0);
    const rows = [
      ...fu.map((x) => ({ id: x.id, k: "fuel", r: x.receipt, date: x.date, what: "Fuel" + (x.station ? " · " + x.station : ""), detail: x.gallons ? `${num(x.gallons, 3)} ${RG.vol} · ${money(x.cost / x.gallons)}/${RG.vol}` : "", v: x.vehicleId, amt: x.cost })),
      ...ex.map((x) => ({ id: x.id, k: "expense", r: x.receipt, date: x.date, what: EXPENSE[x.kind] || "Other", detail: x.note, v: x.vehicleId, amt: x.amount })),
    ].sort((a, b) => b.date - a.date);
    return `<div class="topbar"><h1>Costs</h1>${monthPicker()}<div class="right"><button class="btn" data-act="cost-new" data-k="fuel">+ Fill-up</button><button class="btn primary" data-act="cost-new" data-k="expense">+ Car cost</button></div></div>
    <div class="kpis four">
      ${kpi("Fuel this month", money(fu.reduce((a, x) => a + x.cost, 0)), gallons ? `${num(gallons)} ${RG.vol}` : `${fu.length} fill-up${fu.length === 1 ? "" : "s"}`)}
      ${kpi("Car costs this month", money(ex.reduce((a, x) => a + x.amount, 0)), `${ex.length} item${ex.length === 1 ? "" : "s"}`)}
      ${kpi(`Fuel in ${S.month.y}`, money(yFu), "")}
      ${kpi(`Car costs in ${S.month.y}`, money(yEx), "for the actual-expense method")}
    </div>
    <div class="card" style="padding:0;overflow:hidden"><div class="table-wrap"><table><thead><tr><th>Date</th><th>What</th><th>Details</th><th>Vehicle</th><th class="n">Amount</th></tr></thead><tbody>
      ${rows.map((r) => `<tr class="click" data-act="cost-edit" data-k="${r.k}" data-id="${esc(r.id)}" tabindex="0"><td>${esc(r.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))}</td><td>${esc(r.what)}${r.r ? ' <span class="muted" title="Receipt attached">📎</span>' : ""}</td><td class="muted">${esc(r.detail)}</td><td>${esc(vehicleName(r.v))}</td><td class="n">${money(r.amt)}</td></tr>`).join("") || '<tr><td colspan="5"><div class="empty"><b>No costs this month</b>Add a fill-up or car cost here or in the app.</div></td></tr>'}
    </tbody></table></div></div>`;
  }

  // ---------- Reports ----------
  const KINDS = {
    log: { title: "Drive log", text: "IRS-style log of your drives", stem: "Drive-Log" },
    claim: { title: "Reimbursement claim", text: "Business miles, tolls, parking and meals at your employer's rate", stem: "Reimbursement" },
    tax: { title: "Year-end tax summary", text: "Schedule C answers, standard rate vs actual expenses", stem: "Tax-Summary" },
  };

  function periods() {
    const ms = availableMonths();
    const years = [...new Set(ms.map((x) => taxYearOf(new Date(x.y, x.m, 28))))].sort((a, b) => b - a);
    return [
      ...years.map((y) => { const [st, en] = taxYearRange(y); return { key: `y${y}`, label: `${taxYearLabel(y)} (${RG.uk ? "tax year" : "full year"})`, start: st, end: en, year: y }; }),
      ...ms.map((x) => ({ key: `m${x.y}-${x.m}`, label: monthName(x.y, x.m), start: new Date(x.y, x.m, 1), end: new Date(x.y, x.m + 1, 1), year: x.y })),
    ];
  }

  function reportData() {
    const R = S.report;
    const ps = periods();
    if (R.kind === "tax" && (!R.period || R.period[0] !== "y")) R.period = ps.find((p) => p.key[0] === "y").key;
    if (!R.period || !ps.find((p) => p.key === R.period)) R.period = `m${S.month.y}-${S.month.m}`;
    const p = ps.find((x) => x.key === R.period) || ps[0];
    let trips = S.trips.filter((t) => !t.lockedFree && t.start >= p.start && t.start < p.end);
    if (R.vehicle) trips = trips.filter((t) => t.vehicleId === R.vehicle);
    if (R.business) {
      const def = defaultBusiness();
      // Only business drives belong to a company, whatever company a reclassified drive had before.
      trips = trips.filter((t) => t.category === "business" && (t.businessId || (def && def.id)) === R.business);
    }
    trips = trips.slice().sort((a, b) => a.start - b.start);
    const listed = R.kind === "claim" ? trips.filter((t) => t.category === "business") : trips;
    const s = summarize(trips);
    const custom = parseFloat(R.rate) > 0 ? parseFloat(R.rate) : 0;
    const claimRate = custom || rateFor("business", p.end > new Date() ? new Date() : new Date(p.end - 1));
    const inP = (d) => d >= p.start && d < p.end;
    const ex = S.expenses.filter((x) => inP(x.date) && (!R.vehicle || x.vehicleId === R.vehicle));
    const fu = S.fuel.filter((x) => inP(x.date) && (!R.vehicle || x.vehicleId === R.vehicle));
    const actualCosts = ex.reduce((a, x) => a + x.amount, 0) + fu.reduce((a, x) => a + x.cost, 0);
    const claimMileage = custom ? s.business * custom : s.deduction;
    const claim = claimMileage + s.tolls + s.parking + s.meals;
    return { p, trips, listed, s, claimRate, claim, ex, fu, actualCosts, R, custom, claimMileage };
  }

  const amountFor = (t, D) => D.R.kind === "claim" && D.custom ? (t.meters / MI) * D.custom : amt(t);

  function renderReports() {
    const D = reportData();
    const { s, p, R } = D;
    const ps = periods();
    const vs = Object.values(S.vehicles).sort((a, b) => a.createdAt - b.createdAt);
    const bs = Object.values(S.businesses).sort((a, b) => a.createdAt - b.createdAt);
    const sel = (name, label, opts, val) => `<label class="in">${label}<select data-act="ropt" name="${name}">${opts.map((o) => `<option value="${esc(o[0])}" ${o[0] === val ? "selected" : ""}>${esc(o[1])}</option>`).join("")}</select></label>`;
    const kinds = Object.entries(KINDS).map(([k, v]) => `<button class="rkind ${R.kind === k ? "on" : ""}" data-act="rkind" data-k="${k}">${icon(I.doc)}<b>${v.title}</b><span>${v.text}</span></button>`).join("");
    const periodOpts = ps.filter((x) => R.kind !== "tax" || x.key[0] === "y").map((x) => [x.key, x.label]);
    const scope = [vs.length > 1 ? (R.vehicle ? vehicleLabel(R.vehicle) : "All vehicles") : vs[0] ? vehicleLabel(vs[0].id) : "", bs.length > 1 ? (R.business ? S.businesses[R.business].name : "All businesses") : ""].filter(Boolean).join(" · ");
    const warn = [s.unreviewed ? `${s.unreviewed} drive${s.unreviewed > 1 ? "s aren't" : " isn't"} reviewed yet` : "", s.missing ? `${s.missing} business drive${s.missing > 1 ? "s are" : " is"} missing a purpose` : ""].filter(Boolean);
    let kp, table;
    if (R.kind === "tax") {
      const businessShare = s.total ? s.business / s.total : 0;
      if (RG.tier) {
        const tiers = {};
        for (const t of D.trips) {
          const x = S.tiers[t.id];
          if (!x) continue;
          if (x[0]) tiers[x[1]] = (tiers[x[1]] || 0) + x[0];
          if (x[2]) tiers[x[3]] = (tiers[x[3]] || 0) + x[2];
        }
        const tierRows = Object.keys(tiers).map(Number).sort((a, b) => b - a)
          .map((r) => `<tr><td>${num(tiers[r], 0)} ${RG.unit} at ${cents(r).split("/")[0]}</td><td>${money(tiers[r] * r)}</td></tr>`).join("");
        const uk = RG.uk;
        kp = `${kpi(`Business ${RG.word}`, num(s.business, 0), `${Math.round(s.pct)}% of ${num(s.total, 0)}`)}${kpi(RG.deduction, money(s.deduction), uk ? "employees and simplified expenses" : "if your employer pays per km")}${kpi("Car costs × business use", money(D.actualCosts * businessShare), uk ? "if you use actual costs" : "if you're self-employed")}${kpi("Tolls &amp; parking", money(s.tolls + s.parking), "business drives")}`;
        table = `<table class="sumtable"><tbody>
        <tr><td>${uk ? "Business miles" : "Kilometres driven to earn income (T2125 Part 5 · T777)"}</td><td>${num(s.business, 0)}</td></tr>
        <tr><td>Total ${RG.word} driven</td><td>${num(s.total, 0)}</td></tr>
        <tr><td>Business use</td><td>${num(s.pct)}%</td></tr>
        ${tierRows}
        <tr><td>${RG.deduction}</td><td>${money(s.deduction)}</td></tr>
        <tr><td>Fuel and car costs logged</td><td>${money(D.actualCosts)}</td></tr>
        <tr><td>Business share of car costs</td><td>${money(D.actualCosts * businessShare)}</td></tr>
        <tr><td>Business tolls and parking</td><td>${money(s.tolls + s.parking)}</td></tr>
        <tr><td>${uk ? "Meals on business drives" : `Business meals (${s.mealCount}) · 50% deductible`}</td><td>${money(uk ? s.meals : s.mealsDeductible)}</td></tr>
      </tbody></table><p class="hint" style="margin:12px 0 0">${uk
        ? "Use either simplified mileage or actual costs for a vehicle, not both. If your employer paid less than these rates, claim Mileage Allowance Relief on the difference."
        : "Capital cost allowance (CCA) and car loan interest aren't included; your accountant adds those."}</p>`;
      } else {
      kp = `${kpi("Business miles", num(s.business), `${Math.round(s.pct)}% of ${num(s.total)}`)}${kpi("Standard deduction", money(s.deduction), "IRS standard rate")}${kpi("Tolls &amp; parking", money(s.tolls + s.parking), "deductible on top")}${kpi("Meals (50%)", money(s.mealsDeductible), "Schedule C line 24b")}`;
        table = `<table class="sumtable"><tbody>
          <tr><td>Total miles</td><td>${num(s.total)}</td></tr>
          <tr><td>Business miles (Schedule C line 44a)</td><td>${num(s.business)}</td></tr>
          <tr><td>Commuting miles (line 44b)</td><td>${num(s.commute)}</td></tr>
          <tr><td>Other personal miles (line 44c)</td><td>${num(s.personal + s.medical + s.charity)}</td></tr>
          <tr><td>Business use</td><td>${num(s.pct)}%</td></tr>
          <tr><td>Standard mileage deduction</td><td>${money(s.deduction)}</td></tr>
          <tr><td>Business tolls and parking</td><td>${money(s.tolls + s.parking)}</td></tr>
          <tr><td>Fuel and car costs logged</td><td>${money(D.actualCosts)}</td></tr>
          <tr><td>Business share of logged costs (actual method, before depreciation)</td><td>${money(D.actualCosts * businessShare)}</td></tr>
          <tr><td>Business meals (${s.mealCount}) · 50% deductible</td><td>${money(s.mealsDeductible)}</td></tr>
          <tr><td>Medical miles · charity miles</td><td>${num(s.medical)} · ${num(s.charity)}</td></tr>
        </tbody></table><p class="hint" style="margin:12px 0 0">The app's PDF also compares the standard rate with actual expenses including depreciation. Check with your tax preparer before you file.</p>`;
      }
    } else {
      kp = R.kind === "claim"
        ? `${kpi(`Business ${RG.word}`, num(s.business), D.custom ? `at ${cents(D.custom)}` : RG.rateName)}${kpi("Mileage", money(D.claimMileage), "")}${kpi("Tolls &amp; parking", money(s.tolls + s.parking), "")}${kpi("Total due", money(D.claim), s.meals ? `incl. meals ${money(s.meals)}` : "")}`
        : `${kpi(`Business ${RG.word}`, num(s.business), `${Math.round(s.pct)}% of ${num(s.total)}`)}${kpi(RG.deduction, money(s.deduction), RG.rateName)}${kpi("Tolls &amp; parking", money(s.tolls + s.parking), "deductible on top")}${RG.uk ? kpi("Meals", money(s.meals), "on business drives") : kpi("Meals (50%)", money(s.mealsDeductible), RG.meals)}`;
      const shown = D.listed.slice(0, 200);
      table = `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Route</th><th>Type</th><th>Purpose</th><th class="n">${RG.Word}</th><th class="n">Value</th></tr></thead><tbody>
        ${shown.map((t) => `<tr><td>${esc(t.start.toLocaleDateString("en-US", { month: "short", day: "numeric" }))}</td><td>${esc(t.from)} → ${esc(t.to)}</td><td>${esc((CATS[t.category] || CATS.unclassified).label)}</td><td>${esc([t.purpose, t.client].filter(Boolean).join(" · "))}${missingPurpose(t) ? '<span class="warn">Missing</span>' : ""}</td><td class="n">${miles(t.meters)}</td><td class="n">${money(amountFor(t, D))}</td></tr>`).join("") || '<tr><td colspan="6" class="muted">No drives in this period.</td></tr>'}
      </tbody></table></div>${D.listed.length > shown.length ? `<p class="hint">Showing the first ${shown.length} of ${D.listed.length}. The download has them all.</p>` : ""}`;
    }
    return `<h1>Reports</h1>
    <div class="rkinds">${kinds}</div>
    <div class="opts">${sel("period", "Period", periodOpts, R.period)}
      ${sel("vehicle", "Vehicle", [["", "All vehicles"], ...vs.map((v) => [v.id, vehicleLabel(v.id)])], R.vehicle)}
      ${bs.length > 1 ? sel("business", "Business", [["", "All businesses"], ...bs.map((b) => [b.id, b.name])], R.business) : ""}
      ${R.kind === "claim" ? `<label class="in">Rate per ${RG.ca ? "km" : "mile"} (${RG.cur})<input data-act="rrate" inputmode="decimal" value="${esc(R.rate)}" placeholder="${D.claimRate}"></label>` : ""}</div>
    <div class="card">
      <div class="topbar"><div><b style="font-size:16px">${KINDS[R.kind].title} · ${esc(p.label.replace(/ \((full|tax) year\)/, ""))}</b><div class="muted" style="font-size:12px">${esc([S.user, scope].filter(Boolean).join(" · "))}</div></div>
      <div class="right"><button class="btn" data-act="share">${icon(I.link)}Share link</button><button class="btn" data-act="csv">${icon(I.dl)}CSV</button><button class="btn primary" data-act="pdf">${icon(I.dl)}PDF</button></div></div>
      <div class="kpis four" style="margin-top:16px">${kp}</div>
      ${warn.length ? `<div class="banner" style="margin-top:14px">${warn.join(" and ")}. <a href="#/drives/${s.unreviewed ? "review" : "purpose"}" data-act="jump-month" data-y="${p.start.getFullYear()}" data-m="${p.start.getMonth()}">Fix in Drives</a></div>` : ""}
      <div style="margin-top:14px">${table}</div>
    </div>`;
  }

  // ---------- downloads ----------
  function download(name, blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  const csvCell = (v) => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const stem = (D) => `MileGuard-${KINDS[D.R.kind].stem}-${iso(D.p.start)}`;

  function csv() {
    const D = reportData();
    const { s } = D;
    const head = `Date,Start,End,From,To,${RG.Word},Category,Business Purpose,Client,Tolls,Parking,Meal,Meal With,Rate,Amount,Vehicle,Business,Classified At,Rule,Edits,Receipt`;
    const lines = [head];
    for (const t of D.listed) {
      const rate = D.R.kind === "claim" && D.custom ? D.custom : t.meters ? Math.round(amt(t) / (t.meters / MI) * 1000) / 1000 : 0;
      lines.push([iso(t.start), hm(t.start), hm(t.end), t.from, t.to, (t.meters / MI).toFixed(1), (CATS[t.category] || CATS.unclassified).label,
        t.purpose, t.client, t.tolls.toFixed(2), t.parking.toFixed(2), t.meal ? t.meal.toFixed(2) : "",
        t.meal ? (t.mealOvernight && !t.mealWith ? "Overnight trip" : t.mealWith) : "", rate, amountFor(t, D).toFixed(2),
        vehicleLabel(t.vehicleId), businessName(t), t.classifiedAt ? t.classifiedAt.toISOString() : "", t.autoRule,
        S.editCounts[t.id] || 0, t.hasReceipt ? "yes" : ""].map(csvCell).join(","));
    }
    const W = RG.word;
    lines.push("", `Summary,${csvCell(D.p.label)}`, `Total ${W},${s.total.toFixed(1)}`, `Business ${W},${s.business.toFixed(1)}`,
      `Commuting ${W},${s.commute.toFixed(1)}`, `Other personal ${W},${s.personal.toFixed(1)}`,
      ...(RG.tier ? [] : [`Medical ${W},${s.medical.toFixed(1)}`, `Charity ${W},${s.charity.toFixed(1)}`]),
      `Business use %,${s.pct.toFixed(1)}`, `${RG.deduction} (${RG.rateName}),${s.deduction.toFixed(2)}`,
      `Business tolls,${s.tolls.toFixed(2)}`, `Business parking,${s.parking.toFixed(2)}`);
    if (D.R.kind === "claim") {
      if (s.meals) lines.push(`Meals,${s.meals.toFixed(2)}`);
      lines.push(`Reimbursement due,${D.claim.toFixed(2)}`);
    } else if (s.meals) {
      lines.push(`Business meals,${s.meals.toFixed(2)}`, `Business meals deductible (50%),${s.mealsDeductible.toFixed(2)}`);
    }
    if (D.fu.length) {
      lines.push("", "Fuel", RG.vol === "L" ? "Date,Time,Station,Litres,Price per litre,Cost,Vehicle" : "Date,Time,Station,Gallons,Price per gallon,Cost,Vehicle");
      for (const f of D.fu.slice().sort((a, b) => a.date - b.date)) lines.push([iso(f.date), hm(f.date), f.station, f.gallons ? f.gallons.toFixed(3) : "", f.gallons ? (f.cost / f.gallons).toFixed(3) : "", f.cost.toFixed(2), vehicleName(f.vehicleId)].map(csvCell).join(","));
    }
    if (D.ex.length) {
      lines.push("", "Car costs", "Date,Kind,Amount,Note,Vehicle");
      for (const x of D.ex.slice().sort((a, b) => a.date - b.date)) lines.push([iso(x.date), EXPENSE[x.kind] || "Other", x.amount.toFixed(2), x.note, vehicleName(x.vehicleId)].map(csvCell).join(","));
    }
    download(stem(D) + ".csv", new Blob(["﻿" + lines.join("\n") + "\n"], { type: "text/csv;charset=utf-8" }));
  }

  // Summary lines shared by the PDF and share links: [label, formatted value].
  function pairs(D) {
    const { s } = D;
    if (D.R.kind === "claim") {
      return [[`Business ${RG.word}`, num(s.business)], ["Rate", D.custom ? cents(D.custom) : RG.rateName], ["Mileage", money(D.claimMileage)],
        ["Tolls", money(s.tolls)], ["Parking", money(s.parking)], ...(s.meals ? [["Meals", money(s.meals)]] : []), ["Total due", money(D.claim)]];
    }
    const out = [[`Total ${RG.word}`, num(s.total)], [`Business ${RG.word}`, num(s.business)], [`Commuting ${RG.word}`, num(s.commute)],
      [`Other personal ${RG.word}`, num(s.personal + s.medical + s.charity)], ["Business use", num(s.pct) + "%"]];
    if (RG.tier && S.tiers) {
      const tiers = {};
      for (const t of D.trips) { const x = S.tiers[t.id]; if (!x) continue; if (x[0]) tiers[x[1]] = (tiers[x[1]] || 0) + x[0]; if (x[2]) tiers[x[3]] = (tiers[x[3]] || 0) + x[2]; }
      for (const r of Object.keys(tiers).map(Number).sort((a, b) => b - a)) out.push([`${num(tiers[r], 0)} ${RG.unit} at ${cents(r).split("/")[0]}`, money(tiers[r] * r)]);
    }
    out.push([`${RG.deduction} (${RG.rateName})`, money(s.deduction)], ["Business tolls and parking", money(s.tolls + s.parking)]);
    if (s.meals) out.push(RG.uk ? ["Meals on business drives", money(s.meals)] : ["Business meals (50% deductible)", money(s.mealsDeductible)]);
    if (D.R.kind === "tax") out.push(["Fuel and car costs logged", money(D.actualCosts)], ["Business share of car costs", money(D.actualCosts * (s.total ? s.business / s.total : 0))]);
    return out;
  }

  // ---------- share links ----------
  // A snapshot of one report, put in MileGuard's public iCloud database under a random 128-bit name.
  // Only someone with the link can open it. It stops opening when it expires, and expired ones are deleted
  // next time the owner signs in. The owner's list of links lives in their private database.
  const SHARE_LIST = "mileguard-shares";
  const shareURL = (token) => `${location.origin}/app/share.html#${token}`;
  const token = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");

  function snapshot(D) {
    const listed = D.listed;
    return {
      v: 1, kind: D.R.kind, title: `${KINDS[D.R.kind].title} · ${D.p.label.replace(/ \((full|tax) year\)/, "")}`,
      by: S.user !== "Signed in" ? S.user : "",
      scope: [D.R.vehicle ? vehicleLabel(D.R.vehicle) : "All vehicles", D.R.business ? S.businesses[D.R.business].name : ""].filter(Boolean).join(" · "),
      made: Date.now(), cur: RG.cur, loc: RG.loc, unit: RG.unit, Word: RG.Word,
      sum: pairs(D),
      head: ["Date", "Start", "End", "From", "To", RG.Word, "Type", "Purpose", "Client", "Tolls", "Parking", "Meal", "Value"],
      rows: D.R.kind === "tax" ? [] : listed.map((t) => [iso(t.start), hm(t.start), hm(t.end), t.from, t.to, +(t.meters / MI).toFixed(1),
        (CATS[t.category] || CATS.unclassified).label, t.purpose, t.client, t.tolls, t.parking, t.meal, +amountFor(t, D).toFixed(2)]),
    };
  }

  const ShareCloud = {
    pub: () => CloudKit.getDefaultContainer().publicCloudDatabase,
    async list() {
      const res = await Cloud.db.fetchRecords([{ recordName: SHARE_LIST }]);
      const r = res.records && res.records[0];
      if (!r || r.serverErrorCode || !r.fields) return { items: [], tag: null };
      try { return { items: JSON.parse(r.fields.items.value || "[]"), tag: r.recordChangeTag }; } catch (e) { return { items: [], tag: r.recordChangeTag }; }
    },
    async saveList(items, tag) {
      const rec = { recordName: SHARE_LIST, recordType: "MgShareList", fields: { items: { value: JSON.stringify(items), type: "STRING" } } };
      if (tag) rec.recordChangeTag = tag;
      const res = await Cloud.db.saveRecords([rec]);
      if (res.hasErrors) throw res.errors[0];
    },
    async create(snap, days) {
      const t = token(), payload = JSON.stringify(snap);
      if (payload.length > 900000) { const e = new Error("too big"); e.tooBig = true; throw e; }
      const expires = Date.now() + days * 86400000;
      const res = await this.pub().saveRecords([{ recordName: t, recordType: "MGShare", fields: {
        title: { value: snap.title, type: "STRING" }, payload: { value: payload, type: "STRING" }, expires: { value: expires, type: "TIMESTAMP" } } }]);
      if (res.hasErrors) throw res.errors[0];
      const l = await this.list();
      await this.saveList([{ t, title: snap.title, exp: expires, made: Date.now() }, ...l.items], l.tag);
      return t;
    },
    async revoke(t) {
      await this.pub().deleteRecords([{ recordName: t }]).catch(() => {});
      const l = await this.list();
      await this.saveList(l.items.filter((x) => x.t !== t), l.tag);
    },
    async sweep() {
      const l = await this.list();
      const dead = l.items.filter((x) => x.exp < Date.now());
      if (!dead.length) return;
      await this.pub().deleteRecords(dead.map((x) => ({ recordName: x.t }))).catch(() => {});
      await this.saveList(l.items.filter((x) => x.exp >= Date.now()), l.tag);
    },
  };

  const ShareDemo = {
    items: [],
    async list() { return { items: this.items }; },
    async create(snap, days) {
      const t = token();
      try { localStorage.setItem("mg-demo-share-" + t, JSON.stringify({ snap, exp: Date.now() + days * 86400000 })); } catch (e) {}
      this.items.unshift({ t, title: snap.title, exp: Date.now() + days * 86400000, made: Date.now() });
      return t;
    },
    async revoke(t) { this.items = this.items.filter((x) => x.t !== t); try { localStorage.removeItem("mg-demo-share-" + t); } catch (e) {} },
    async sweep() {},
  };
  const Share = () => (S.source === Demo ? ShareDemo : ShareCloud);

  async function openShare(created) {
    S.modal = { kind: "share" };
    const D = reportData();
    const title = `${KINDS[D.R.kind].title} · ${D.p.label.replace(/ \((full|tax) year\)/, "")}`;
    let items = [];
    try { items = (await Share().list()).items.filter((x) => x.exp >= Date.now()); } catch (e) { /* still let them make one */ }
    const date = (ms) => new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    modalHost().innerHTML = `<div class="scrim" data-act="modal-close"></div>
    <form class="card sheet" data-act="share-create" role="dialog" aria-label="Share a link">
      <div class="hd"><h2>Share a link</h2><button type="button" class="btn close" style="display:inline-flex" data-act="modal-close" aria-label="Close">✕</button></div>
      <div class="form">
        ${created ? `<div class="sharebox"><b>Link ready</b><input readonly value="${esc(shareURL(created))}" id="share-url" aria-label="Link">
          <button type="button" class="btn primary" data-act="share-copy">Copy link</button></div>
          <p class="hint">Anyone with this link can see this report until it expires. Send it to your accountant or employer; they don't need MileGuard.</p>`
        : `<p class="hint" style="font-size:14px;color:var(--tx)"><b>${esc(title)}</b></p>
          <p class="hint">Makes a read-only copy of this report that opens in any browser, with a CSV and PDF download. It doesn't change as you edit drives; make a new link for an updated copy.</p>
          <label class="in">Link works for<select name="days"><option value="7">7 days</option><option value="30" selected>30 days</option><option value="90">90 days</option></select></label>
          <div class="actions"><button type="button" class="btn" data-act="modal-close">Cancel</button><button type="submit" class="btn primary" id="share-go">Create link</button></div>`}
        ${items.length ? `<div><b style="font-size:13px">Your links</b><table style="margin-top:6px"><tbody>${items.map((x) => `<tr><td>${esc(x.title)}<div class="muted" style="font-size:12px">Until ${date(x.exp)}</div></td>
          <td class="n"><button type="button" class="link" data-act="share-copy-one" data-t="${esc(x.t)}">Copy</button> · <button type="button" class="link" data-act="share-revoke" data-t="${esc(x.t)}" style="color:#C2372F">Turn off</button></td></tr>`).join("")}</tbody></table></div>` : ""}
      </div>
    </form>`;
  }

  async function createShare(f) {
    const btn = $("#share-go"); if (btn) { btn.disabled = true; btn.textContent = "Creating…"; }
    try {
      const t = await Share().create(snapshot(reportData()), Number(f.days.value) || 30);
      await openShare(t);
    } catch (e) {
      console.error(e);
      toast(e.tooBig ? "Too many drives for one link. Pick a shorter period." : "Couldn't create the link. Try again.");
      if (btn) { btn.disabled = false; btn.textContent = "Create link"; }
    }
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast("Link copied."); }
    catch (e) { const i = $("#share-url"); if (i) { i.select(); } toast("Select the link and copy it."); }
  }

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  async function pdf() {
    const btn = document.querySelector('[data-act="pdf"]');
    if (btn) btn.disabled = true;
    try {
      if (!window.jspdf) {
        await loadScript("vendor/jspdf.umd.min.js");        // jsPDF 2.5.2, MIT
        await loadScript("vendor/jspdf.plugin.autotable.min.js"); // jspdf-autotable 3.8.2, MIT
      }
      const D = reportData();
      const { s } = D;
      const doc = new window.jspdf.jsPDF({ orientation: D.R.kind === "tax" ? "portrait" : "landscape", unit: "pt", format: "letter" });
      const W = doc.internal.pageSize.getWidth();
      const green = [14, 138, 99];
      doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(18, 22, 20);
      doc.text(`${KINDS[D.R.kind].title} · ${D.p.label.replace(/ \((full|tax) year\)/, "")}`, 40, 50);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(91, 103, 99);
      const scope = [S.user !== "Signed in" ? S.user : "", D.R.vehicle ? vehicleLabel(D.R.vehicle) : "All vehicles", D.R.business ? S.businesses[D.R.business].name : ""].filter(Boolean).join(" · ");
      doc.text(`${scope}  ·  Made with MileGuard on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, 40, 66);
      const sum = pairs(D);
      doc.autoTable({ startY: 84, body: sum, theme: "plain", tableWidth: 360, styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: { 1: { halign: "right", fontStyle: "bold" } } });
      if (D.R.kind !== "tax") {
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 16,
          head: [["Date", "Time", "From", "To", RG.Word, "Type", "Purpose", "Client", "Tolls", "Parking", "Value"]],
          body: D.listed.map((t) => [iso(t.start), hm(t.start), t.from, t.to, (t.meters / MI).toFixed(1), (CATS[t.category] || CATS.unclassified).label,
            t.purpose, t.client, t.tolls ? t.tolls.toFixed(2) : "", t.parking ? t.parking.toFixed(2) : "", amountFor(t, D).toFixed(2)]),
          styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
          headStyles: { fillColor: green, textColor: 255 },
          columnStyles: { 4: { halign: "right" }, 8: { halign: "right" }, 9: { halign: "right" }, 10: { halign: "right" } },
          alternateRowStyles: { fillColor: [246, 248, 247] },
        });
      }
      const pages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i); doc.setFontSize(8); doc.setTextColor(140);
        doc.text(`Page ${i} of ${pages}`, W - 40, doc.internal.pageSize.getHeight() - 20, { align: "right" });
        doc.text("Times and distances are as recorded by MileGuard. Keep this log with your tax records.", 40, doc.internal.pageSize.getHeight() - 20);
      }
      doc.save(stem(D) + ".pdf");
    } catch (e) {
      console.error(e);
      toast("Couldn't make the PDF. Try again, or download the CSV.");
    } finally { if (btn) btn.disabled = false; }
  }

  // ---------- events ----------
  const main = () => $("#main");
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || !main().contains(el)) return;
    const a = el.dataset.act;
    if (a === "pick") pick(el.dataset.id);
    else if (a === "unpick") { S.selected = null; S.draft = null; render(); }
    else if (a === "filter") { S.filter = el.dataset.k; history.replaceState(null, "", `#/drives/${S.filter}`); render(); }
    else if (a === "month") { const ms = availableMonths(); const i = ms.findIndex((x) => x.y === S.month.y && x.m === S.month.m) + Number(el.dataset.d); if (ms[i]) { S.month = ms[i]; render(); } }
    else if (a === "cat") { readForm(); S.draft.category = el.dataset.k; S.draftDirty = true; render(); }
    else if (a === "chip") { readForm(); S.draft.purpose = el.dataset.p; S.draft.client = el.dataset.c; S.draftDirty = true; render(); }
    else if (a === "cancel") pick(S.selected);
    else if (a === "quick-log") { S.report.kind = "log"; S.report.period = `m${S.month.y}-${S.month.m}`; csv(); }
    else if (a === "rkind") { S.report.kind = el.dataset.k; render(); }
    else if (a === "csv") csv();
    else if (a === "share") openShare();
    else if (a === "receipt-view") { e.preventDefault(); viewReceipt(el.dataset.id, el.dataset.f); }
    else if (a === "cost-new") openCost(el.dataset.k, null);
    else if (a === "cost-edit") openCost(el.dataset.k, el.dataset.id);
    else if (a === "pdf") pdf();
    else if (a === "jump") { S.month = (() => { const t = S.trips.find(el.dataset.f === "review" ? (x) => x.category === "unclassified" && !x.lockedFree : el.dataset.f === "purpose" ? missingPurpose : (x) => x.category === "business" && x.tollsLikely && !x.tolls); return t ? { y: t.start.getFullYear(), m: t.start.getMonth() } : S.month; })(); }
    else if (a === "jump-month") { S.month = { y: Number(el.dataset.y), m: Number(el.dataset.m) }; }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.matches("form.form")) { e.preventDefault(); save(); }
    else if (e.target.matches("form[data-act=share-create]")) { e.preventDefault(); createShare(e.target); }
    else if (e.target.matches("form.sheet")) { e.preventDefault(); saveCost(e.target); }
  });
  // The cost editor sits outside #main.
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || !el.closest("#modal")) return;
    const a = el.dataset.act;
    if (a === "modal-close") closeModal();
    else if (a === "cost-delete") deleteCost(el);
    else if (a === "cost-delete-cancel") cancelDelete(el);
    else if (a === "share-copy") copy($("#share-url").value);
    else if (a === "share-copy-one") copy(shareURL(el.dataset.t));
    else if (a === "share-revoke") { Share().revoke(el.dataset.t).then(() => { toast("Link turned off."); openShare(); }).catch(() => toast("Couldn't turn it off. Try again.")); }
    else if (a === "receipt-view") { e.preventDefault(); viewReceipt(el.dataset.id, el.dataset.f); }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset.act === "search") {
      S.search = el.value;
      if (S.draft) readForm();
      const pos = el.selectionStart;
      render();
      const s = $('[data-act="search"]'); s.focus(); s.setSelectionRange(pos, pos);
    } else if (el.dataset.act === "rrate") {
      S.report.rate = el.value;
      clearTimeout(S.rt);
      S.rt = setTimeout(() => { const pos = el.selectionStart; render(); const r = $('[data-act="rrate"]'); if (r) { r.focus(); r.setSelectionRange(pos, pos); } }, 400);
    } else if (el.closest("form.form")) {
      S.draftDirty = true;
      if (["meal"].includes(el.name)) { clearTimeout(S.mt); S.mt = setTimeout(() => { const had = !!S.draft.meal; readForm(); if (had !== !!S.draft.meal) { render(); const m = $('form.form [name="meal"]'); if (m) { m.focus(); const v = m.value.length; m.setSelectionRange(v, v); } } }, 500); }
    }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.act === "receipt-up") { uploadReceipt(el); return; }
    if (el.dataset.act === "month-pick") { const [y, m] = el.value.split("-").map(Number); S.month = { y, m }; render(); }
    else if (el.dataset.act === "ropt") { S.report[el.name] = el.value; render(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && S.modal) { if (S.modal.deleting) return; const k = $('#modal [data-act="cost-delete-cancel"]'); if (k) cancelDelete(k); else closeModal(); return; }
    if (e.key === "Enter" && e.target.matches("tr.click")) { e.target.click(); return; }
    if (e.key === "Escape" && S.selected && S.view === "drives" && !e.target.closest("input")) { S.selected = null; S.draft = null; render(); }
  });
  window.addEventListener("beforeunload", (e) => { if (S.draftDirty) { e.preventDefault(); e.returnValue = ""; } });

  boot();
})();
