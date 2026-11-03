const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// charge data/util/symbols/state dans un contexte isole avec un localStorage factice
function load(ls = {}) {
  const src = ["data", "util", "symbols", "state"]
    .map((f) => fs.readFileSync(path.join(__dirname, "..", "js", f + ".js"), "utf8"))
    .join("\n");
  const ctx = vm.createContext({ localStorage: ls, toast() {}, URL });
  return vm.runInContext(
    src + "\n;({clean,pickS,thaw,engInit,ser,eid,E,NB,DEF,get S(){return S},set S(v){S=v},get D(){return D}})",
    ctx
  );
}

test("clean: ancien format tableau converti en objets", () => {
  const { clean } = load();
  const d = clean([{ n: "G", l: [["A", "https://a.com"], ["", "---"], ["B", "https://b.com", 0, "https://b.com/i.png"]] }]);
  assert.deepEqual(JSON.parse(JSON.stringify(d[0].l)), [
    { n: "A", u: "https://a.com" },
    { sep: 1 },
    { n: "B", u: "https://b.com", k: "https://b.com/i.png" },
  ]);
});

test("clean: rejette javascript:, icone invalide ignoree, idempotent", () => {
  const { clean, DEF } = load();
  const d = clean([{ n: "G", l: [{ n: "x", u: "javascript:alert(1)" }, { n: "y", u: "https://y.com", k: "javascript:1" }] }]);
  assert.deepEqual(JSON.parse(JSON.stringify(d[0].l)), [{ n: "y", u: "https://y.com" }]);
  const a = clean(DEF);
  assert.deepEqual(clean(a), a);
});

test("clean: tronque a MAX*2 elements", () => {
  const { clean } = load();
  const l = Array.from({ length: 30 }, (_, i) => ({ n: "n" + i, u: "https://x.com/" + i }));
  assert.equal(clean([{ n: "G", l }])[0].l.length, 20);
});

test("pickS: types verifies, cle __proto__ ignoree", () => {
  const { pickS } = load();
  const o = pickS(JSON.parse('{"greet":"oui","tab":true,"name":"' + "a".repeat(50) + '","__proto__":{"x":1},"ord":"no","eng":"google.com"}'));
  assert.equal(o.greet, undefined);
  assert.equal(o.tab, true);
  assert.equal(o.name.length, 30);
  assert.equal(o.ord, undefined);
  assert.equal(o.eng, "google.com");
  assert.equal(o.x, undefined);
});

test("thaw: migration de l'ancien format par index (nb=8)", () => {
  const { thaw, E, NB } = load();
  const s = thaw({ nb: 8, ord: [2, 0, 1, 3, 4, 5, 6, 7], hid: [], eng: 2, ce: [] });
  assert.equal(s.v, 2);
  assert.equal(s.nb, undefined);
  assert.equal(s.eng, 2);
  assert.deepEqual(s.hid, [8, 9, 10, 11, 12, 13, 14]);
  assert.equal(E.length, NB);
});

test("thaw: moteurs perso decales apres les nouveaux integres", () => {
  const { thaw, E, NB } = load();
  const ce = [["Mon", "https://m.example/s?q=%s", "m.example", "Chercher", "red"]];
  const s = thaw({ nb: 8, ord: [0, 1, 2, 3, 4, 5, 6, 7, 8], hid: [], eng: 8, ce });
  assert.equal(s.eng, NB); // le moteur perso (ancien index 8) suit les integres
  assert.equal(E[NB][0], "Mon");
});

test("ser/thaw: aller-retour stable, id inconnu ignore, nouveau moteur masque", () => {
  const m = load();
  m.S = m.thaw({ v: 2, ord: ["claude.ai", "inconnu.test", "google.com"], hid: ["google.com"], eng: "claude.ai", ce: [] });
  m.engInit();
  const out = m.ser();
  assert.equal(out.v, 2);
  assert.equal(out.eng, "claude.ai");
  assert.deepEqual(out.ord.slice(0, 2), ["claude.ai", "google.com"]);
  assert.ok(!out.ord.includes("inconnu.test"));
  assert.equal(out.ord.length, m.NB);
  assert.ok(out.hid.includes("google.com"));
  assert.ok(out.hid.includes("wikipedia.org")); // integre absent du profil: masque
});

test("engInit: l'hote d'un moteur perso est recalcule depuis l'URL (anti-injection)", () => {
  const m = load();
  m.S = m.thaw({
    ce: [["X", "https://evil.example/?q=", '" onerror="alert(1)', "p", "red"]],
    ord: [], hid: [], eng: 0,
  });
  m.engInit();
  assert.equal(m.S.ce[0][2], "evil.example");
  assert.equal(m.E[m.NB][2], "evil.example");
});

test("cleanCe: doublons d'URL et entrees trop courtes retires", () => {
  const m = load();
  m.S = m.thaw({ ce: [["A", "https://a.test/?q=", "x", "p", "red"], ["B", "https://a.test/?q=", "x", "p", "red"], ["C", "https://c.test/", "x"]], ord: [], hid: [], eng: 0 });
  assert.equal(m.S.ce.length, 1);
});

test("clean: liens d'applications autorises, protocoles inconnus refuses", () => {
  const { clean } = load();
  const d = clean([{ n: "G", l: [
    { n: "Steam", u: "steam://open/main" },
    { n: "Spotify", u: "spotify:track:abc" },
    { n: "x", u: "javascript:alert(1)" },
    { n: "y", u: "constructor://a" },
    { n: "z", u: "file:///C:/a.exe" },
  ] }]);
  assert.deepEqual(d[0].l.map((l) => l.n), ["Steam", "Spotify"]);
});

test("clean: nouvelles apps et liens startpage://run acceptes", () => {
  const { clean } = load();
  const d = clean([{ n: "G", l: [
    { n: "Slack", u: "slack://open" },
    { n: "Tg", u: "tg://" },
    { n: "Teams", u: "msteams:" },
    { n: "Exe", u: "startpage://run/ab12cd34?n=Steam" },
    { n: "Bad", u: "ftp://x.com/a" },
  ] }]);
  assert.deepEqual(d[0].l.map((l) => l.n), ["Slack", "Tg", "Teams", "Exe"]);
});
