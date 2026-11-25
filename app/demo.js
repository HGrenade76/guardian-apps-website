// Sample data for ?demo. Made-up people and places, around the current date.
window.MG_DEMO = function () {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const MI = 1609.344;
  const places = {
    home: ["Home", 29.7865, -95.6280],
    office: ["Riverside Office Park", 29.7520, -95.4610],
    westlake: ["Westlake Medical Center", 29.7790, -95.5600],
    katy: ["Supplier HQ, Katy", 29.7850, -95.8240],
    harbor: ["Harbor Logistics", 29.7300, -95.2650],
    pine: ["Pinecrest Plant", 30.0710, -95.4170],
    grocery: ["Grocery store", 29.7740, -95.6100],
    gym: ["Fitness club", 29.7700, -95.5900],
    school: ["Elm Street School", 29.8000, -95.6400],
  };
  const vehicles = {
    V1: { id: "V1", name: "Work truck", isDefault: true, createdAt: new Date(2025, 0, 2), plate: "TRK-4821", plateState: "TX" },
    V2: { id: "V2", name: "Family SUV", isDefault: false, createdAt: new Date(2025, 2, 1), plate: "", plateState: "" },
  };
  const businesses = { B1: { id: "B1", name: "Rivera Consulting", createdAt: new Date(2025, 0, 1) } };
  const pairs = [["Client visit", "Westlake"], ["Supplier meeting", "Katy Supply Co"], ["Site inspection", "Pinecrest"], ["Delivery run", "Harbor Logistics"], ["Office day", ""]];
  const trips = [], editCounts = {};
  const route = (a, b) => {
    const pts = [];
    const n = 40, bend = (rnd() - 0.5) * 0.06;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      pts.push([a[1] + (b[1] - a[1]) * f + Math.sin(f * Math.PI) * bend, a[2] + (b[2] - a[2]) * f - Math.sin(f * Math.PI) * bend * 0.6]);
    }
    return pts;
  };
  const dist = (a, b) => {
    const R = 6371000, toR = Math.PI / 180;
    const dLat = (b[1] - a[1]) * toR, dLon = (b[2] - a[2]) * toR;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * toR) * Math.cos(b[1] * toR) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h)) * 1.28;
  };
  let id = 0;
  const add = (day, hour, min, a, b, cat, extra = {}) => {
    const start = new Date(day); start.setHours(hour, min, 0, 0);
    const m = dist(a, b);
    const end = new Date(start.getTime() + (m / MI) * 95000 + 300000);
    const t = {
      id: "T" + ++id, rec: {}, start, end, from: a[0], to: b[0], startLat: a[1], startLon: a[2], endLat: b[1], endLon: b[2],
      meters: m, category: cat, purpose: "", client: "", tolls: 0, tollSource: "none", tollsLikely: false, parking: 0,
      meal: 0, mealWith: "", mealOvernight: false, vehicleId: "V1", businessId: "", classifiedAt: cat === "unclassified" ? null : end,
      autoRule: "", lockedFree: false, isManual: false, viaCarPlay: rnd() > 0.3, hasReceipt: false, _route: route(a, b), ...extra,
    };
    trips.push(t);
    if (rnd() > 0.85) editCounts[t.id] = 1 + Math.floor(rnd() * 3);
    return t;
  };
  const P = places;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let back = 75; back >= 0; back--) {
    const day = new Date(today); day.setDate(today.getDate() - back);
    const dow = day.getDay();
    const recent = back < 9;
    if (dow === 0) continue;
    if (dow === 6) {
      if (rnd() > 0.4) { add(day, 10, 15, P.home, P.grocery, recent && rnd() > 0.5 ? "unclassified" : "personal", { vehicleId: "V2" }); add(day, 11, 2, P.grocery, P.home, "personal", { vehicleId: "V2" }); }
      continue;
    }
    if (rnd() > 0.55) add(day, 7, 55, P.home, P.office, "commute", { autoRule: "Home to work" });
    const dest = [P.westlake, P.katy, P.pine, P.harbor][Math.floor(rnd() * 4)];
    const pair = dest === P.westlake ? pairs[0] : dest === P.katy ? pairs[1] : dest === P.pine ? pairs[2] : pairs[3];
    const pending = recent && rnd() > 0.55;
    const toll = dest === P.harbor || dest === P.pine;
    const out = add(day, 9, 10 + Math.floor(rnd() * 40), P.office, dest, pending ? "unclassified" : "business", {
      purpose: pending ? "" : pair[0], client: pending ? "" : pair[1], tollsLikely: toll,
      tolls: toll && !pending && rnd() > 0.1 ? Math.round((3 + rnd() * 5) * 100) / 100 : 0,
      tollSource: toll ? "manual" : "none", parking: dest === P.westlake && !pending ? 6 : 0,
    });
    if (!pending && rnd() > 0.75) Object.assign(out, { meal: Math.round((22 + rnd() * 40) * 100) / 100, mealWith: pair[1] || "Team" });
    const backBiz = !recent || rnd() > 0.4;
    add(day, 13, 30 + Math.floor(rnd() * 25), dest, P.office, backBiz ? "business" : "unclassified", {
      purpose: backBiz && rnd() > 0.15 ? pair[0] : "", client: backBiz ? pair[1] : "", tollsLikely: toll,
      tolls: toll && backBiz && rnd() > 0.1 ? Math.round((3 + rnd() * 5) * 100) / 100 : 0,
    });
    if (rnd() > 0.5) add(day, 17, 20, P.office, P.home, "commute", { autoRule: "Work to home" });
    if (rnd() > 0.8) add(day, 18, 40, P.home, P.gym, "personal", { vehicleId: "V2" });
  }
  const expenses = [], fuel = [];
  for (let back = 75; back >= 0; back -= 6) {
    const d = new Date(today); d.setDate(today.getDate() - back); d.setHours(17, 45);
    const g = Math.round((14 + rnd() * 10) * 1000) / 1000;
    fuel.push({ id: "F" + back, date: d, cost: Math.round(g * (2.79 + rnd() * 0.3) * 100) / 100, gallons: g, station: rnd() > 0.5 ? "Corner Fuel #12" : "Highway Stop", vehicleId: "V1" });
  }
  const ex = [["insurance", 168, "Monthly premium"], ["maintenance", 89.5, "Oil change"], ["carWash", 18, ""], ["tires", 0, ""]];
  for (let m = 0; m < 3; m++) {
    for (const [kind, amt, note] of ex) {
      if (!amt || (kind === "maintenance" && m !== 1)) continue;
      const d = new Date(today.getFullYear(), today.getMonth() - m, 3 + m * 4);
      expenses.push({ id: `E${m}${kind}`, date: d, kind, amount: amt, note, vehicleId: "V1" });
    }
  }
  return { trips, vehicles, businesses, expenses, fuel, editCounts };
};
