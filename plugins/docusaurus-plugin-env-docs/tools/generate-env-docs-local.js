const { loadSchema, generateContent, loadLocalSchema } = require('./tools');

/**
 * @param {string} schemaPath
 * @param {string} outputDir
 */
async function generateEnvDocs(schemaPath, outputDir) {
  const schema = loadLocalSchema(schemaPath);
  return generateContent(schema, outputDir);
}

module.exports = generateEnvDocs;
