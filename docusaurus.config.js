// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DarioCruz.dev',
  tagline: 'The Site|Blog|Portfolio of Dario Cruz IT Professional',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.dariocruz.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dario-cruz', // Usually your GitHub org/user name.
  projectName: 'dariocruz.dev', // Usually your repo name.

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
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  
  plugins: [
    'plugin-image-zoom',
    require.resolve('docusaurus-lunr-search'),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      image: 'img/docusaurus-social-card.jpg',
      metadata: [
        {name: 'keywords', content: 'cybersecurity, blog, portfolio, dario, cruz, dario cruz, dariocruz'},
        {name: 'twitter:card', content: 'summary_large_image'},
      ],
      headTags: [
        // Declare a <link> preconnect tag
        {
          tagName: 'link',
          attributes: {
            rel: 'preconnect',
            href: 'https://dariocruz.dev',
          },
        },
        // Declare some json-ld structured data
        {
          tagName: 'script',
          attributes: {
            type: 'application/ld+json',
          },
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Organization',
            name: 'Dariocruz.dev cyber blog & portfolio',
            url: 'https://dariocruz.dev/',
            logo: 'https://dariocruz.dev/img/logo.svg',
          }),
        },
      ],
      navbar: {
        title: 'DarioCruz.dev',
        logo: {
          alt: 'My Site Logo',
          src: 'img/dcdev-logo.png',
        },
        items: [
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Projects',
          },
          {to: '/about', label: 'About', position: 'left'},
          {
            href: 'https://www.linkedin.com/in/dariocru/',
            label: 'LinkedIn',
            position: 'right',
          },
        ],
      },
      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        // Optional medium-zoom options
        // see: https://www.npmjs.com/package/medium-zoom#options
        options: {
          margin: 24,
          background: '#1b1b1d',
          scrollOffset: 0,
        },
      },
      footer: {
        style: 'dark',
        
        copyright: `Copyright © ${new Date().getFullYear()} DarioCruz.dev. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

