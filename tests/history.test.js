const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// charge history.js avec D, persist, render, toast factices
function load(D0, ss = {}) {
  const src = fs.readFileSync(path.join(__dirname, "..", "js", "history.js"), "utf8");
  const ctx = vm.createContext({ D: D0, sessionStorage: ss, calls: { persist: 0, render: 0, toasts: [] } });
  vm.runInContext("function persist(){calls.persist++}function render(){calls.render++}function toast(m){calls.toasts.push(m)}", ctx);
  vm.runInContext(src, ctx);
  const run = (c) => vm.runInContext(c, ctx);
  return { run, ctx, ss };
}

test("saveD puis undo/redo restaurent D", () => {
  const { run } = load([{ n: "A", l: [] }]);
  run('D.push({n:"B",l:[]});saveD()');
  assert.equal(run("D.length"), 2);
  run("undo()");
  assert.equal(run("D.length"), 1);
  run("redo()");
  assert.equal(run("D.length"), 2);
});

test("undo sans historique: toast, rien ne change", () => {
  const { run, ctx } = load([{ n: "A", l: [] }]);
  run("undo()");
  assert.deepEqual(ctx.calls.toasts, ["Rien à annuler"]);
});

test("suppression d'un lien (chk) annulable seule, pas avec l'action suivante", () => {
  const { run } = load([{ n: "A", l: [{ n: "x", u: "https://x.com" }] }]);
  run("D[0].l[0].x=1;chk()");
  run('D.push({n:"B",l:[]});saveD()');
  run("undo()");
  assert.equal(run("D.length"), 1);
  assert.equal(run("D[0].l[0].x"), 1);
  run("undo()");
  assert.equal(run("D[0].l[0].x"), undefined);
});

test("resnap: nettoyage sans etape annulable", () => {
  const { run } = load([{ n: "A", l: [{ n: "x", u: "https://x.com" }] }]);
  run("D[0].l[0].x=1;chk();D[0].l=D[0].l.filter(l=>!l.x);resnap()");
  assert.equal(run("H.u.length"), 1);
  run("undo()");
  assert.equal(run("D[0].l.length"), 1);
});

test("50 etapes max, redo vide apres nouvelle action", () => {
  const { run } = load([{ n: "A", l: [] }]);
  for (let i = 0; i < 60; i++) run('D[0].n="n' + i + '";saveD()');
  assert.equal(run("H.u.length"), 50);
  run("undo()");
  run('D[0].n="z";saveD()');
  assert.equal(run("H.r.length"), 0);
});

test("historique restaure depuis sessionStorage seulement si D identique", () => {
  const a = load([{ n: "A", l: [] }]);
  a.run('D.push({n:"B",l:[]});saveD()');
  const b = load(JSON.parse(a.run("JSON.stringify(D)")), a.ss);
  assert.equal(b.run("H.u.length"), 1);
  const c = load([{ n: "Autre", l: [] }], a.ss);
  assert.equal(c.run("H.u.length"), 0);
});
