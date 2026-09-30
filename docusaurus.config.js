// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

require('dotenv').config();

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GetApp Developer Site',
  tagline: 'Managed Digital Assets',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://docs.getapp.sh',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, yo u don't need these.
  organizationName: 'getappsh', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/getappsh/docs',
          docRootComponent: "@theme/DocRoot",
          docItemComponent: "@theme/ApiItem" // derived from docusaurus-theme-openapi-docs
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/getappsh/docs',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: "api", // plugin id
        docsPluginId: "classic", // id of plugin-content-docs or preset for rendering docs
        config: {
          // NOTE: this id is named "server" (kept for CLI-command compat) but currently produces
          // the FULL/uncurated doc, wired under sidebars.js's "Full" section — see the comment
          // there. api-getapp-dev.apps.getapp.sh hasn't been redeployed with PR #156
          // "remanaged-swagger-apis" (apps/api/src/swagger/setup-swagger.ts) yet, so "/docs-json"
          // still serves the old undifferentiated (v1+v2, no curation) document rather than the
          // curated V2 one. Once it has, swap this specPath for the real curated-V2 route and add:
          //   serverFull: {
          //     specPath: "https://api-getapp-dev.apps.getapp.sh/docs/full-json",
          //     outputDir: "docs/server-full/",
          //     sidebarOptions: { groupPathsBy: "tag", categoryLinkSource: "tag" },
          //   },
          // (and add "/docs/server-full/" to .gitignore — already reserved there), then update
          // sidebars.js so "V2" and "Full" each point at their own real generated output.
          server: {
            specPath: "https://api-getapp-dev.apps.getapp.sh/docs-json",
            outputDir: "docs/server/", // output directory for generated files
            sidebarOptions: { // optional, instructs plugin to generate sidebar.js
              groupPathsBy: "tag", // group sidebar items by operation "tag"
              categoryLinkSource: "tag",
            },
          },
          serverDevice: {
            // Device-facing subset only ("/docs/device") — the surface agents/devices talk to.
            specPath: "https://api-getapp-dev.apps.getapp.sh/docs/device-json",
            outputDir: "docs/server-device/",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
          },
          agentV2: {
            specPath: "https://minio-api.apps.getapp.sh/getapp-develop-public/agent/openAPI-V2.json",
            outputDir: "docs/agent",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag"
            },
          },
          agentCore: {
            specPath: "https://minio-api.apps.getapp.sh/getapp-develop-public/agent/openAPI-Core.json",
            outputDir: "docs/agent-core",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag"
            },
          },
          agentCdn: {
            specPath: "https://minio-api.apps.getapp.sh/getapp-develop-public/agent/openAPI-Cdn.json",
            outputDir: "docs/agent-cdn",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag"
            },
          },
          agentPlatform: {
            // Not yet published alongside V2/Core/CDN in CI (see agent's
            // .github/workflows/*-build*.yml), so this is a local snapshot
            // fetched from a running agent's /api-docs/platform/openapi.json
            // instead of a minio URL. Re-run `yarn docusaurus gen-api-docs
            // agentPlatform` against a fresh snapshot to pick up spec changes.
            specPath: "openapi-specs/agent-platform.json",
            outputDir: "docs/agent-platform",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag"
            },
          }
        }
      },
    ],
    [
      // Plugin to generate environment variables documentation
      require.resolve('./plugins/docusaurus-plugin-env-docs'),
      {
        schemaUrl: 'https://minio-api.apps.getapp.sh/getapp-develop-public/env/env-vars.json',
        id: 'env',
        outputDir: 'docs/env', // output directory for generated files
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  headTags: [
    // Runtime config (Dashboard URL, etc). In Docker this file is regenerated
    // from container env vars at startup; see docker/entrypoint.sh.
    {
      tagName: 'script',
      attributes: { src: '/config.js' },
    },
  ],
  themes: ["docusaurus-theme-openapi-docs", "@docusaurus/theme-mermaid"], // export theme components
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'GetApp',
        logo: {
          alt: 'GetApp',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'serverSidebar',
            position: 'left',
            label: 'Server',
          },
          {
            type: 'docSidebar',
            sidebarId: 'agentSidebar',
            position: 'left',
            label: 'Agent',
          },
          { to: '/changelog', label: 'Changelog', position: 'left' },
          {
            // Reads DASHBOARD_URL from the runtime config; see src/pages/goto/dashboard.js.
            to: '/goto/dashboard',
            label: 'Dashboard',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/root/getting-started',
              },
              {
                label: 'Docs',
                to: '/docs/root/intro',
              },
              {
                label: 'Changelog',
                to: '/changelog',
              },
            ],
          },
          {
            title: 'Server',
            items: [
              {
                label: 'Server API',
                to: '/docs/server/get-app',
              },
              {
                label: 'Environment Variables',
                to: '/docs/env',
              },
              {
                // Reads SERVER_API_URL from the runtime config; see src/pages/goto/swagger.js.
                label: 'Swagger',
                to: '/goto/swagger',
              },
            ],
          },
          {
            title: 'Agent',
            items: [
              {
                label: 'Agent API',
                to: '/docs/agent/getapp-agent-api-v-2',
              },
              {
                label: 'Environment Variables',
                to: '/docs/env',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Dashboard',
                to: '/goto/dashboard',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} GetApp, Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    })
};

export default config;
