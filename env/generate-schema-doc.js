// This script generates MDX files for environment variable documentation


const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, 'schema.json');
const outputDir = path.join(__dirname, '../docs/env');
const sidebarPath = path.join(__dirname, '../docs/env/sidebar.js');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const scopes = schema.scopes ?? [];

if (!Array.isArray(scopes) || scopes.length === 0) {
  console.error("❌ Schema must contain a top-level 'scopes' array.");
  process.exit(1);
}

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const pages = [];
const schemaTitle = schema.name || "Environment Variables";
const schemaDescription = schema.description || "";

function toSlug(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function escapeMDX(text) {
  if (typeof text !== 'string') return text;
  return text.includes('{') || text.includes('}') ? '`' + text + '`' : text;
}

function mdxForScope(scope) {
  const header = `# ${scope.name}\n\n${scope.description || ''}\n\n`;
  const tableHeader = `| Name | Description | Required | Type |\n|------|-------------|----------|------|`;

  const rows = (scope.variables || []).map(v => {
    const required = typeof v.required === 'boolean'
      ? v.required
      : typeof v.required === 'object'
        ? `if ${JSON.stringify(v.required.if)} then ${v.required.then}`
        : 'false';
    return `| \`${v.name}\` | ${escapeMDX(v.description || '')} | ${escapeMDX(required)} | ${escapeMDX(v.type)} |`;
  });

  return `${header}${tableHeader}\n${rows.join('\n')}`;
}

for (const scope of scopes) {
  const slug = toSlug(scope.name);
  const filePath = path.join(outputDir, `${slug}.md`);
  const mdxContent = mdxForScope(scope);
  fs.writeFileSync(filePath, mdxContent, 'utf8');
  pages.push({ slug, title: scope.name });
}

// Write index.mdx
fs.writeFileSync(path.join(outputDir, 'index.mdx'), `---\ntitle: ${schemaTitle}\n---\n\n${schemaDescription}\n`, 'utf8');

// Write sidebar.js
const sidebarEntries = [
  {
    type: 'doc',
    id: 'env/index',
    label: 'Overview',
  },
  ...pages.map(p => ({
    type: 'doc',
    id: `env/${p.slug}`,
    label: p.title,
  })),
];

const sidebarContent = `module.exports = {
  env: ${JSON.stringify(sidebarEntries, null, 2)}
};\n`;

fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');

console.log('✅ MDX files and sidebar.js generated successfully.');
