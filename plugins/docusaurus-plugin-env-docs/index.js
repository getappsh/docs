// const generateEnvDocs = require('./tools/generate-env-docs');
const path = require('path');

/**
 * Docusaurus plugin to generate env docs from a schema URL.
 *
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {Object} options
 * @param {string} options.schemaUrl
 * @param {string} [options.outputDir]
 */
module.exports = function (context, options) {
  const outputDir = path.resolve(context.siteDir, options.outputDir || 'docs/env');

  return {
    name: 'docusaurus-plugin-env-docs',

    // async loadContent() {
    //   try {
    //     const sidebar = await generateEnvDocs(options.schemaUrl, outputDir);
    //     return { sidebar };
    //   } catch (err) {
    //     console.error('Failed to generate env docs:', err);
    //     return null;
    //   }
    // },

    extendCli(cli) {
      cli
        .command('gen-env-docs')
        .description('Generate environment docs from schema')
        .action(() => {
          require('./cli/commands/gen-env-docs').action({
            url: options.schemaUrl,
            outputDir,
          });
        });

      cli
        .command('gen-env-docs-loc')
        .description('Generates environment docs from a local schema, path must be relative to the project root')
        .alias('gen-env-docs-local')
        .option('-p, --schema-path <path>', 'Path to the local schema file',)
        .action((options) => {
          const schemaPath = path.resolve(__dirname, options.schemaPath);
          console.log(options.schemaPath, schemaPath);

          require('./cli/commands/gen-env-docs-loc').action({ url: options.schemaPath, outputDir });
        });

      cli
        .command('clear-env-docs')
        .description('Clears generated environment docs')
        .action(() => {
          require('./cli/commands/clear-env-docs').action({ outputDir });
        });
    },
  };
};
