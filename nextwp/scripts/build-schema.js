#!/usr/bin/env node
/**
 * NextWP — build schema.json from component defaults only.
 * One source: src/components/<Name>/defaults.js. One pass, explicit type rules.
 *
 * Usage: node nextwp/scripts/build-schema.js
 * Output: nextwp/schema.json (component name -> array of { name, type, default?, sub_fields? })
 *
 * Requires: @babel/parser (devDependency)
 */

const fs = require('fs');
const path = require('path');

let parse;
try {
  parse = require('@babel/parser').parse;
} catch (e) {
  console.error('Install @babel/parser: npm install -D @babel/parser');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '../..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const SCHEMA_PATH = path.join(__dirname, '..', 'schema.json');
const IGNORE = ['ui', 'header', 'footer', 'form'].map((s) => s.toLowerCase());

function astToValue(node) {
  if (!node) return undefined;
  switch (node.type) {
    case 'StringLiteral':
      return node.value;
    case 'TemplateLiteral': {
      if (!node.quasis?.length) return '';
      return node.quasis.map((q) => (q.value?.raw ?? '')).join('');
    }
    case 'NumericLiteral':
      return node.value;
    case 'BooleanLiteral':
      return node.value;
    case 'NullLiteral':
      return null;
    case 'ObjectExpression': {
      const obj = {};
      for (const prop of node.properties || []) {
        if (prop.type !== 'ObjectProperty') continue;
        const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
        if (!key) continue;
        const v = astToValue(prop.value);
        if (v !== undefined) obj[key] = v;
      }
      return obj;
    }
    case 'ArrayExpression':
      return (node.elements || []).map(astToValue).filter((v) => v !== undefined);
    default:
      return undefined;
  }
}

function getExportedObject(ast) {
  for (const node of ast.program.body || []) {
    if (node.type !== 'ExportNamedDeclaration' || !node.declaration?.declarations?.[0]) continue;
    const decl = node.declaration.declarations[0];
    if (decl?.init?.type === 'ObjectExpression') return decl.init;
  }
  return null;
}

function loadDefaults(componentName) {
  const defaultsPath = path.join(COMPONENTS_DIR, componentName, 'defaults.js');
  if (!fs.existsSync(defaultsPath)) return null;
  const code = fs.readFileSync(defaultsPath, 'utf8');
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (e) {
    console.warn(`[NextWP] Parse error ${defaultsPath}:`, e.message);
    return null;
  }
  const objNode = getExportedObject(ast);
  if (!objNode) return null;
  return astToValue(objNode);
}

function inferType(name, val) {
  if (name === 'content') return 'content';
  if (val === null || val === undefined) return 'text';
  if (typeof val === 'string') return 'text';
  if (Array.isArray(val)) return 'repeater';
  if (typeof val === 'object') {
    if (name === 'map') return 'group';
    const hasHref = 'href' in val || 'url' in val;
    const hasLinkText = 'text' in val || 'title' in val;
    if (hasHref && hasLinkText) return 'link';
    if ('src' in val && 'alt' in val) return 'image';
    if ('src' in val && Object.keys(val).length <= 2) return 'image';
    return 'group';
  }
  return 'text';
}

function valueForSchema(val) {
  if (val === null) return null;
  if (val === undefined) return undefined;
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val;
  if (Array.isArray(val)) return val.map(valueForSchema).filter((v) => v !== undefined);
  if (typeof val === 'object') {
    const out = {};
    for (const k of Object.keys(val)) {
      const v = valueForSchema(val[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  return undefined;
}

function buildField(name, val) {
  const type = inferType(name, val);
  const def = { name, type };
  const defaultVal = valueForSchema(val);
  if (defaultVal !== undefined) def.default = defaultVal;

  if (type === 'repeater' && Array.isArray(val) && val.length > 0) {
    const first = val[0];
    if (first && typeof first === 'object' && !Array.isArray(first)) {
      def.sub_fields = Object.keys(first).map((k) => buildField(k, first[k]));
    }
  } else if (type === 'group' && val && typeof val === 'object' && !Array.isArray(val)) {
    def.sub_fields = Object.keys(val).map((k) => buildField(k, val[k]));
  }

  return def;
}

function getSchemaForComponent(componentName) {
  const defaults = loadDefaults(componentName);
  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) return null;
  return Object.keys(defaults).map((key) => buildField(key, defaults[key]));
}

function main() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error('Components dir not found:', COMPONENTS_DIR);
    process.exit(1);
  }

  const dirs = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });
  const components = dirs
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !IGNORE.includes(d.name.toLowerCase()))
    .map((d) => d.name);

  const schema = {};
  for (const name of components) {
    const fields = getSchemaForComponent(name);
    if (fields && fields.length > 0) {
      schema[name] = fields;
    }
  }

  const outDir = path.dirname(SCHEMA_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(SCHEMA_PATH, JSON.stringify(schema, null, 2), 'utf8');
  console.log('[NextWP] Wrote', Object.keys(schema).length, 'components to', SCHEMA_PATH);
}

main();
