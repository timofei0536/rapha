#!/usr/bin/env node
/**
 * NextWP — build schema.json from component files (run from project root).
 * Usage: node nextwp/scripts/build-schema.js
 * Output: nextwp/schema.json (component name -> array of { name, type, sub_fields? })
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

const EXTENSIONS = ['.jsx', '.js', '.tsx', '.ts'];
const COMPONENTS_DIR = path.resolve(__dirname, '../../src/components');
const SCHEMA_PATH = path.resolve(__dirname, '../schema.json');

const URL_REGEX = /^(?:https?:\/\/|tel:|mailto:)/;
const IMAGE_EXT_REGEX = /\.(png|jpe?g|gif|webp|svg|ico)(\?|$)/i;

function isImageSrc(str) {
  if (!str || typeof str !== 'string') return false;
  const s = str.trim();
  if (/^\//.test(s)) return true;
  if (IMAGE_EXT_REGEX.test(s)) return true;
  if (URL_REGEX.test(s) && (IMAGE_EXT_REGEX.test(s) || s.includes('/images/'))) return true;
  return false;
}

function isLinkUrl(str) {
  if (!str || typeof str !== 'string') return false;
  const s = str.trim();
  if (!URL_REGEX.test(s)) return false;
  return !isImageSrc(s);
}

function collectStrings(val) {
  const out = [];
  if (val === null || val === undefined) return out;
  if (typeof val === 'string') {
    out.push(val);
    return out;
  }
  if (Array.isArray(val)) {
    val.forEach((v) => out.push(...collectStrings(v)));
    return out;
  }
  if (typeof val === 'object') {
    Object.values(val).forEach((v) => out.push(...collectStrings(v)));
    return out;
  }
  return out;
}

function inferTypeFromValue(val, options = {}) {
  const { hasContentAncestor = false } = options;
  if (hasContentAncestor) return 'content';

  if (val === null || val === undefined) return 'text';

  if (typeof val === 'string') {
    if (isLinkUrl(val)) return 'href';
    if (isImageSrc(val)) return 'image';
    return 'text';
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return 'repeater';
    const first = val[0];
    if (typeof first === 'object' && first !== null) {
      const allImage = val.every((el) => {
        const strs = collectStrings(el);
        const srcCount = strs.filter((s) => isImageSrc(s)).length;
        const textCount = strs.filter((s) => !isImageSrc(s) && !isLinkUrl(s) && s !== '').length;
        return srcCount === 1 && textCount === 1;
      });
      if (allImage) return 'gallery';
    }
    return 'repeater';
  }

  if (typeof val === 'object') {
    const strs = collectStrings(val);
    const hasImageSrc = strs.some(isImageSrc);
    const hasLinkUrl = strs.some(isLinkUrl);
    const hasText = strs.some((s) => s !== '' && !isImageSrc(s) && !isLinkUrl(s));

    if (hasImageSrc && hasText) {
      const srcCount = strs.filter(isImageSrc).length;
      const textCount = strs.filter((s) => !isImageSrc(s) && s !== '').length;
      if (srcCount === 1 && textCount === 1) return 'image';
    }
    if (hasLinkUrl && hasText) return 'link';
    return 'group';
  }

  return 'text';
}

function astToValue(node, constants) {
  if (!node) return undefined;
  switch (node.type) {
    case 'StringLiteral':
      return node.value;
    case 'NumericLiteral':
      return node.value;
    case 'BooleanLiteral':
      return node.value;
    case 'NullLiteral':
      return null;
    case 'Identifier':
      return constants[node.name];
    case 'ObjectExpression': {
      const obj = {};
      for (const prop of node.properties) {
        if (prop.type !== 'ObjectProperty') continue;
        const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
        obj[key] = astToValue(prop.value, constants);
      }
      return obj;
    }
    case 'ArrayExpression':
      return node.elements.map((el) => astToValue(el, constants));
    default:
      return undefined;
  }
}

function getConstantsFromFile(ast) {
  const decls = [];
  const visit = (node) => {
    if (!node) return;
    if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && node.init) {
      decls.push({ name: node.id.name, init: node.init });
    }
    for (const k of Object.keys(node)) {
      const child = node[k];
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child === 'object' && child.type) visit(child);
    }
  };
  visit(ast);
  const constants = {};
  for (let pass = 0; pass < decls.length; pass++) {
    let changed = false;
    for (const { name, init } of decls) {
      if (constants[name] !== undefined) continue;
      const val = astToValue(init, constants);
      if (val !== undefined) {
        constants[name] = val;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return constants;
}

function getPropsWithDefaults(ast) {
  const props = [];
  const visit = (node) => {
    if (!node) return;
    if (node.type === 'ExportDefaultDeclaration' && node.declaration?.type === 'FunctionDeclaration') {
      const params = node.declaration.params;
      if (params.length > 0 && params[0].type === 'ObjectPattern') {
        for (const p of params[0].properties) {
          if (p.type !== 'ObjectProperty' && p.type !== 'RestElement') continue;
          if (p.type === 'RestElement') continue;
          const name = p.key.type === 'Identifier' ? p.key.name : p.key?.value;
          if (!name) continue;
          const right = p.type === 'ObjectProperty' ? p.value : null;
          let defaultVal = undefined;
          if (right?.type === 'AssignmentPattern' && right.right) {
            defaultVal = right.right;
          } else if (right) {
            defaultVal = right;
          }
          props.push({ name, defaultNode: defaultVal });
        }
      }
    }
    for (const k of Object.keys(node)) {
      const child = node[k];
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child === 'object' && child.type) visit(child);
    }
  };
  visit(ast);
  return props;
}

function hasContentAncestorInJSX(ast, propName) {
  let found = false;
  const stack = [];
  const visit = (node) => {
    if (!node) return;
    if (node.type === 'JSXElement') {
      let hasContent = false;
      for (const attr of node.openingElement?.attributes || []) {
        if (attr.type === 'JSXAttribute' && (attr.name?.name === 'className' || attr.name?.name === 'class')) {
          const v = attr.value;
          const str = v?.type === 'StringLiteral' ? v.value : v?.expression?.value;
          if (str && /\bcontent\b/.test(str)) hasContent = true;
        }
      }
      stack.push(hasContent);
      for (const child of node.children || []) visit(child);
      stack.pop();
      return;
    }
    if (node.type === 'Identifier' && node.name === propName && stack.some(Boolean)) {
      found = true;
    }
    if (node.type === 'MemberExpression' && node.property?.name === propName && stack.some(Boolean)) {
      found = true;
    }
    for (const k of Object.keys(node)) {
      const child = node[k];
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child === 'object' && child.type) visit(child);
    }
  };
  visit(ast);
  return found;
}

function buildFieldDef(name, val, constants, contentAncestor, ast) {
  const type = inferTypeFromValue(val, { hasContentAncestor: contentAncestor });
  const def = { name, type };

  if ((type === 'repeater' || type === 'group') && ast) {
    const first = Array.isArray(val) ? val[0] : val;
    if (first && typeof first === 'object' && first !== null) {
      const keys = Object.keys(first);
      if (keys.length > 0) {
        def.sub_fields = keys.map((k) => {
          const subVal = first[k];
          const subContent = contentAncestor ? false : hasContentAncestorInJSX(ast, k);
          return buildFieldDef(k, subVal, constants, subContent, ast);
        });
      }
    }
  }

  return def;
}

function getSchemaForComponent(componentName) {
  const compDir = path.join(COMPONENTS_DIR, componentName);
  if (!fs.existsSync(compDir) || !fs.statSync(compDir).isDirectory()) return null;

  let filePath = null;
  for (const ext of EXTENSIONS) {
    const p = path.join(compDir, `${componentName}${ext}`);
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }
  if (!filePath) return null;

  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (e) {
    console.warn(`[NextWP] Parse error ${filePath}:`, e.message);
    return null;
  }

  const constants = getConstantsFromFile(ast);
  const props = getPropsWithDefaults(ast);

  if (props.length === 0) return null;

  const fields = [];
  for (const { name, defaultNode } of props) {
    let val = undefined;
    if (defaultNode) {
      if (defaultNode.type === 'Identifier') {
        val = constants[defaultNode.name];
      } else {
        val = astToValue(defaultNode, constants);
      }
    }
    const hasContentAncestor = hasContentAncestorInJSX(ast, name);
    fields.push(buildFieldDef(name, val, constants, hasContentAncestor, ast));
  }

  return fields;
}

function main() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error('Components dir not found:', COMPONENTS_DIR);
    process.exit(1);
  }

  const dirs = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name);

  const ignore = ['ui', 'header', 'footer', 'form'].map((s) => s.toLowerCase());
  const components = dirs.filter((n) => !ignore.includes(n.toLowerCase()));

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
