const generateEnvDocs = require('../../tools/generate-env-docs');

// @ts-check
/** @type {import('@docusaurus/types').PluginCommandModule} */
module.exports = {
  name: 'gen-env-docs',
  description: 'Generates environment schema docs from the JSON schema',
  async action({ url, outputDir }) {
    console.log(`[env-schema] Generating docs from schema in ${outputDir}`);
    await generateEnvDocs(url, outputDir);
    console.log(`[env-schema] Docs generated successfully.`);
  },
  options: [],
};