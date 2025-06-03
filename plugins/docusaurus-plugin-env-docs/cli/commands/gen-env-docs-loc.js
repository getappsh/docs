const generateEnvDocs = require('../../tools/generate-env-docs-local');

// @ts-check
/** @type {import('@docusaurus/types').PluginCommandModule} */
module.exports = {
  name: 'gen-env-docs-loc',
  description: 'Generates environment schema docs from a local JSON schema',
  async action({ url, outputDir }) {
    console.log(`[env-schema] Generating docs from schema in ${outputDir}`);
    await generateEnvDocs(url, outputDir);
    console.log(`[env-schema] Docs generated successfully.`);
  },
  options: [],
};