#!/usr/bin/env node
/**
 * Check component defaults against canonical rules (docs/defaults-rules.md).
 * Usage: node scripts/check-defaults.js
 * Exit code: 0 if no violations, 1 otherwise.
 */

const fs = require("fs");
const path = require("path");

let parse;
try {
  parse = require("@babel/parser").parse;
} catch (e) {
  console.error("Install @babel/parser: npm install -D @babel/parser");
  process.exit(1);
}

const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "src", "components");
if (!fs.existsSync(COMPONENTS_DIR)) {
  console.error("[check-defaults] Components dir not found:", COMPONENTS_DIR);
  process.exit(1);
}
const DEFAULT_FILENAME = "defaults.js";

function getPropertyKeys(node) {
  if (!node || node.type !== "ObjectExpression") return [];
  const keys = [];
  for (const prop of node.properties || []) {
    if (prop.type !== "ObjectProperty") continue;
    if (prop.key.type === "Identifier") keys.push(prop.key.name);
    else if (prop.key.type === "StringLiteral") keys.push(prop.key.value);
  }
  return keys;
}

function collectViolations(node, filePath, pathPrefix, violations, parentKey = null) {
  if (!node) return;
  if (node.type === "ObjectExpression") {
    const keys = getPropertyKeys(node);
    const hasHref = keys.includes("href") || keys.includes("url");
    const hasTarget = keys.includes("target");
    const hasSrc = keys.includes("src");
    const hasAlt = keys.includes("alt");
    // Только поля с именем "link" и "image" проверяем на каноническую форму
    if (parentKey === "link" && hasHref && !hasTarget) {
      violations.push({
        file: filePath,
        where: pathPrefix || "link",
        problem: "Поле link должно содержать target",
        fix: "Добавьте target: '_self' (или '_blank') в объект link",
      });
    }
    if (parentKey === "image" && hasSrc && !hasAlt) {
      violations.push({
        file: filePath,
        where: pathPrefix || "image",
        problem: "Поле image должно содержать alt",
        fix: "Добавьте alt: '' или текст подписи в объект image",
      });
    }
    for (const prop of node.properties || []) {
      if (prop.type !== "ObjectProperty") continue;
      const key = prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
      const nextPath = pathPrefix ? `${pathPrefix}.${key}` : key;
      if (prop.value.type === "ObjectExpression") {
        collectViolations(prop.value, filePath, nextPath, violations, key);
      } else if (prop.value.type === "ArrayExpression") {
        (prop.value.elements || []).forEach((el, i) => {
          if (el && el.type === "ObjectExpression") {
            collectViolations(el, filePath, `${nextPath}[${i}]`, violations, null);
          }
        });
      }
    }
  }
}

function getExportedObject(ast) {
  for (const node of ast.program.body || []) {
    if (node.type === "ExportNamedDeclaration" && node.declaration?.type === "VariableDeclaration") {
      const decl = node.declaration.declarations?.[0];
      if (decl?.id?.type === "Identifier" && decl.init?.type === "ObjectExpression") {
        return decl.init;
      }
    }
  }
  return null;
}

function checkFile(filePath) {
  const violations = [];
  const code = fs.readFileSync(filePath, "utf8");
  let ast;
  try {
    ast = parse(code, { sourceType: "module" });
  } catch (e) {
    violations.push({
      file: path.relative(process.cwd(), filePath),
      where: "(ошибка парсинга файла)",
      problem: e.message,
      fix: "Проверьте синтаксис JS в файле",
    });
    return violations;
  }
  const root = getExportedObject(ast);
  if (!root) return violations;
  collectViolations(root, path.relative(process.cwd(), filePath), "", violations);
  return violations;
}

function main() {
  const defaultsFiles = [];
  function scan(dir) {
    if (!dir || !fs.existsSync(dir)) return;
    const names = fs.readdirSync(dir);
    for (const name of names) {
      if (!name) continue;
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) scan(full);
      else if (name === DEFAULT_FILENAME) defaultsFiles.push(full);
    }
  }
  scan(COMPONENTS_DIR);

  const allViolations = [];
  for (const filePath of defaultsFiles) {
    allViolations.push(...checkFile(filePath));
  }

  if (allViolations.length === 0) {
    console.log("[check-defaults] OK: no violations in", defaultsFiles.length, "files");
    process.exit(0);
  }

  console.error("\n[check-defaults] Нарушения правил из docs/defaults-rules.md\n");
  allViolations.forEach((v, i) => {
    console.error(`--- ${i + 1} ---`);
    console.error("  Файл:    ", v.file);
    console.error("  Где:     ", v.where);
    console.error("  Проблема:", v.problem);
    console.error("  Как исправить:", v.fix);
    console.error("");
  });
  console.error("Всего нарушений:", allViolations.length);
  console.error("Запустите npm run check:defaults после исправлений.\n");
  process.exit(1);
}

main();
