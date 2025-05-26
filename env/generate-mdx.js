const fs = require('fs');
const path = require('path');

console.log("📘 Start generating MDX...");

const SCHEMA_PATH = path.resolve(__dirname, 'schema.json');
const OUTPUT_DIR = path.resolve(__dirname, '../docs/env');
const SIDEBAR_PATH = path.resolve(__dirname, '../docs/env/sidebar.js');

function toFileName(title) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

function escapeMdxString(str) {
  // This escapes strings for safe MDX/JSX embedding
  return JSON.stringify(str);
}

function generateMdx(scope) {
  const grouped = (scope.variables || []).reduce((acc, v) => {
    if (v.hidden) return acc;
    const key = v.subTitle || 'Miscellaneous';
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  const imports = `import React from 'react';
import { GroupSection } from '@site/src/components/EnvFeatures/scope-doc';
`;

  const title = escapeMdxString(scope.title).replace(/^"|"$/g, '');
  const description = scope.description || '';

  const titleSection = `

# ${title}

${description}
`;

  const groupKeys = Object.keys(grouped);

  let groupSections = '';

  if (groupKeys.length === 1 && groupKeys[0] === 'Miscellaneous') {
    // Only Miscellaneous group, output variables directly without section title
    const varsJson = JSON.stringify(grouped['Miscellaneous'], null, 2);
    groupSections = `<GroupSection variables={${varsJson}} />`;
  } else {
    // Multiple groups - sort groups so "Miscellaneous" is last if it exists
    const sortedGroups = groupKeys
      .filter(k => k !== 'Miscellaneous')
      .concat(groupKeys.includes('Miscellaneous') ? ['Miscellaneous'] : []);

    groupSections = sortedGroups
      .map(groupTitle => {
        const variables = grouped[groupTitle];
        const varsJson = JSON.stringify(variables, null, 2);
        const subtitle = `## ${groupTitle}`;
        const section = `<GroupSection title=${escapeMdxString(groupTitle)} variables={${varsJson}} />`;
        return `${subtitle}\n\n${section}`;
      })
      .join('\n\n');
  }

  return `${imports}
${titleSection}

${groupSections}
`;
}



function run() {
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const scopes = schema.scopes ?? [];

  if (!Array.isArray(scopes) || scopes.length === 0) {
    console.error("❌ Schema must contain a top-level 'scopes' array.");
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const pages = [];

  // Write individual scope MDX files
  scopes.forEach((scope) => {
    const filename = toFileName(scope.title) + '.mdx';
    const filePath = path.join(OUTPUT_DIR, filename);
    const content = generateMdx(scope);
    fs.writeFileSync(filePath, content, 'utf8');
    pages.push({ slug: toFileName(scope.title), title: scope.title });
    console.log(`✅ Wrote docs/env/${filename}`);
  });

  // Write index.mdx
  const schemaTitle = schema.title || 'Environment Variables';
  const schemaDescription = schema.description || '';
  const indexContent = `---
title: ${schemaTitle}
---

${schemaDescription}
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.mdx'), indexContent, 'utf8');
  console.log(`✅ Wrote docs/env/index.mdx`);

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
};
`;

  fs.writeFileSync(SIDEBAR_PATH, sidebarContent, 'utf8');
  console.log(`✅ Wrote docs/env/sidebar.js`);
}

run();
