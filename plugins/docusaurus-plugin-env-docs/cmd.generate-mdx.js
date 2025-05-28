const generateContent = require('./tools').generateContent;

const path = require('path');
const fs = require('fs');

// Load data from a JSON file
function loadSchemaFromFile() {
  const absolutePath = path.resolve(__dirname, 'schema-output.json');
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(fileContent);
}

generateContent(loadSchemaFromFile(), path.resolve(__dirname, '../../docs/env'));