const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

/**
 * Loads a JSON schema from a URL.
 * Also writes the schema to a local file for debugging.
 * 
 * @param {string} schemaUrl
 * @returns {Promise<Object>} Parsed JSON schema
 */
async function loadSchema(schemaUrl) {
  if (!schemaUrl) {
    throw new Error('Env Schema URL is required');
  }

  
  console.log(`🌐 Fetching schema from ${schemaUrl}...`);
  const res = await fetch(schemaUrl);
  if (!res.ok) throw new Error(`❌ Failed to fetch env schema from ${schemaUrl}, status: ${res.status}`);
  
  const schema = await res.json();
  console.log(`✅ Successfully fetched schema with title: ${schema.title || 'Untitled Schema'}`);
 
  // const outputDirPath = path.resolve(__dirname, '../data');

  // if (!fs.existsSync(outputDirPath)) {
  //   console.log(`📁 Output directory does not exist. Creating: ${outputDirPath}`);
  //   fs.mkdirSync(outputDirPath, { recursive: true });
  // }

  // fs.writeFileSync(path.join(outputDirPath, 'schema-output.json'), JSON.stringify(schema, null, 2));
  // console.log(`📝 Schema written to ${outputDirPath}`);

  return schema;
}

/**
 * Generates markdown docs based on schema and writes to output directory.
 * Returns sidebar entries for Docusaurus.
 * 
 * @param {Object} schema
 * @param {string} outputDir
 * @returns {Array} sidebar entries
 */
function generateContent(schema, outputDir) {
  console.log("📘 Start generating MDX...");

  if (!schema) throw new Error('❌ Schema is required');
  if (!outputDir) throw new Error('❌ Output directory is required');

  if (!fs.existsSync(outputDir)) {
    console.log(`📁 Output directory does not exist. Creating: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const toFileName = (title) => title.toLowerCase().replace(/\s+/g, '-');
  const escapeMdxString = (str) => JSON.stringify(str);

  function generateMdx(scope) {
    console.log(`🔧 Generating MDX for scope: ${scope.title}`);

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
      const varsJson = JSON.stringify(grouped['Miscellaneous'], null, 2);
      groupSections = `<GroupSection variables={${varsJson}} />`;
    } else {
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

  const pages = [];

  for (const scope of schema.scopes || []) {
    const filename = toFileName(scope.title) + '.mdx';
    const content = generateMdx(scope);
    const fullPath = path.join(outputDir, filename);
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Written: ${fullPath}`);
    pages.push({ slug: toFileName(scope.title), title: scope.title });
  }

  const schemaTitle = schema.title || 'Environment Variables';
  const schemaDescription = schema.description || '';
  const indexContent = `---
title: ${schemaTitle}
---

${schemaDescription}
`;

  const indexPath = path.join(outputDir, 'index.mdx');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`📄 Index page written: ${indexPath}`);

  const sidebarEntries = [
    { type: 'doc', id: 'env/index', label: 'Overview' },
    ...pages.map(p => ({
      type: 'doc',
      id: `env/${p.slug}`,
      label: p.title,
    })),
  ];

  const sidebarPath = path.join(outputDir, 'sidebar.js');
  const sidebarContent = `module.exports = ${JSON.stringify(sidebarEntries, null, 2)};`;

  fs.writeFileSync(sidebarPath, sidebarContent);
  console.log(`📑 Sidebar config written: ${sidebarPath}`);

  return sidebarEntries;
}

module.exports = {
  loadSchema,
  generateContent,
};
