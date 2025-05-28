const { loadSchema, generateContent } = require('./tools');

/**
 * @param {string} schemaUrl
 * @param {string} outputDir
 */
async function generateEnvDocs(schemaUrl, outputDir) {
  const schema = await loadSchema(schemaUrl);
  return generateContent(schema, outputDir);
}

module.exports = generateEnvDocs;
