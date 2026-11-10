const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "calc.js"), "utf8"), ctx);
const calc = (s) => vm.runInContext("calc(" + JSON.stringify(s) + ")", ctx);

test("calculs", () => {
  assert.equal(calc("12*4"), 48);
  assert.equal(calc("2+3*4"), 14);
  assert.equal(calc("(2+3)*4"), 20);
  assert.equal(calc("2^3^2"), 512);
  assert.equal(calc("-2^2"), -4);
  assert.equal(calc("1,5 x 2"), 3);
  assert.equal(calc("10 ÷ 4"), 2.5);
  assert.equal(calc("0.1+0.2"), 0.3);
  assert.equal(calc("3-(-2)"), 5);
});

test("pas un calcul", () => {
  for (const s of ["2024", "-5", "youtube", "2+", "(1+2", "1/0", "max 2+2", "", "1..2+3"]) assert.equal(calc(s), null, s);
});
