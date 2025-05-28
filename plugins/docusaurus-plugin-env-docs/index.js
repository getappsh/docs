const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { loadSchema, generateContent, } = require('./tools');

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-env-docs',
    loadContent: async () => {
      const schema = await loadSchema(options.schemaUrl);
      generateContent(schema, path.join(context.siteDir, 'docs', 'env'));
    },
  };
};
