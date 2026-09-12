const VOID = "area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr";

const RE = new RegExp(
  `(<script\\b[^>]*>[\\s\\S]*?<\\/script>)|(<style\\b[^>]*>[\\s\\S]*?<\\/style>)|<(${VOID})(\\s[^>]*)?\\s*\\/>`,
  "gi"
);

/** HTML5 void tags only. Leaves SVG/`<script>` payloads alone (RSC). */
export function stripVoidTrailingSlashes(html) {
  if (typeof html !== "string" || !html.includes("/>")) return html;
  return html.replace(RE, (match, script, style, tag, attrs) => {
    if (script || style) return match;
    return `<${tag}${(attrs || "").trimEnd()}>`;
  });
}
