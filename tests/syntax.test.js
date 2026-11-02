const test = require("node:test");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const files = [...fs.readdirSync(path.join(root, "js")).map((f) => "js/" + f), "sw.js", "build.js"];

for (const f of files) {
  test("syntaxe: " + f, () => {
    new vm.Script(fs.readFileSync(path.join(root, f), "utf8"), { filename: f });
  });
}
