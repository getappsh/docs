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
const schemaTitle = schema.title || "Environment Variables";
const schemaDescription = schema.description || "";

function toSlug(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function escapeMDX(text) {
  if (typeof text !== 'string') return text;
  return text.includes('{') || text.includes('}') ? '`' + text + '`' : text;
}

function formatCondition(ifObj) {
  if (!ifObj || typeof ifObj !== 'object') return '';

  return Object.entries(ifObj)
    .map(([k, v]) => `${k} = "${v}"`)
    .join(' and ');
}

function formatRequired(r) {
  if (typeof r === 'boolean') {
    return r.toString();
  }
  if (r && r.if && r.then !== undefined) {
    const condition = formatCondition(r.if);
    return `<small><i>${condition}</i></small>`;
  }
  return 'false';
}

function mdxForScope(scope) {
  let content = '';
  let hasWarning = false;
  let hasDeprecated = false;

  const header = `# ${scope.title}\n\n${scope.description || ''}\n\n`;

  const groups = {};
  const ungrouped = [];

  for (const v of scope.variables || []) {
    if (v.subTitle) {
      if (!groups[v.subTitle]) groups[v.subTitle] = [];
      groups[v.subTitle].push(v);
    } else {
      ungrouped.push(v);
    }
  }

  function renderTable(vars, sectionTitle = null) {
    const tableHeader = `| Name | Description | Required | Type |\n|------|-------------|----------|------|`;

    const rows = vars
      .filter(v => !v.hidden)
      .map(v => {

        const required = formatRequired(v.required);
        const name = `\`${v.name}\``;

        const descriptionParts = [];

        if (v.description) {
          descriptionParts.push(v.description.trim());
        }

        if (v.warning) {
          hasWarning = true;
          descriptionParts.push(`<Warning>${escapeMDX(v.warning)}</Warning>`);
        }

        if (v.deprecated) {
          hasDeprecated = true;
          const note = v.deprecationNote || 'This variable is deprecated.';
          descriptionParts.push(`<Deprecated>${escapeMDX(note)}</Deprecated>`);
        }


        if (v.example != null) {
          descriptionParts.push(`**Example:** \`${v.example}\``);
        }

        if (v.type === 'enum' && Array.isArray(v.enum)) {
          const options = v.enum.map(ev => `- \`${ev}\``).join('<br />');
          descriptionParts.push(`**Options:**<br />${options}`);
        }

        const description = descriptionParts.join('<br /><br />');
        const type = `\`${v.type}\``;

        return `| ${name} | ${description} | ${required} | ${type} |`;
      });

    const section = sectionTitle ? `## ${escapeMDX(sectionTitle)}\n\n` : '';
    return `${section}${tableHeader}\n${rows.join('\n')}\n`;
  }

  const allGroups = Object.entries(groups);
  for (let i = 0; i < allGroups.length; i++) {
    const [subtitle, vars] = allGroups[i];
    content += renderTable(vars, subtitle);
    if (i < allGroups.length - 1 || ungrouped.length > 0) {
      content += `\n\n---\n\n`;
    }
  }

  if (ungrouped.length > 0) {
    if (allGroups.length > 0) content += `\n\n---\n\n`;
    content += renderTable(ungrouped, allGroups.length ? 'Miscellaneous' : null);
  }

  let imports = [];
  if (hasWarning) imports.push(`import { Warning } from '../../src/components/EnvFeatures/warning';`);
  if (hasDeprecated) imports.push(`import { Deprecated } from '../../src/components/EnvFeatures/deprecated.jsx';`);
  const importBlock = imports.length ? imports.join('\n') + '\n\n' : '';



  return importBlock + header + content;

}

for (const scope of scopes) {
  const slug = toSlug(scope.title);
  const filePath = path.join(outputDir, `${slug}.mdx`);
  const mdxContent = mdxForScope(scope);
  fs.writeFileSync(filePath, mdxContent, 'utf8');
  pages.push({ slug, title: scope.title });
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
