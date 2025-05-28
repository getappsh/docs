const fs = require('fs');

// @ts-check

/** @type {import('@docusaurus/types').PluginCommandModule} */
module.exports = {
  name: 'clear-env-docs',
  description: 'Clears generated environment MDX docs',
  options: [],
  async action({ outputDir }) {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      console.log(`[clear-env-docs] Removed: ${outputDir}`);
    } else {
      console.log(`[clear-env-docs] Nothing to remove at: ${outputDir}`);
    }
  },
};
