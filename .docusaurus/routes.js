import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/about/',
    component: ComponentCreator('/about/', 'fdd'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '209'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/Mastering Identity & Access Management',
    component: ComponentCreator('/blog/Mastering Identity & Access Management', 'a51'),
    exact: true
  },
  {
    path: '/blog/Site Up and Running',
    component: ComponentCreator('/blog/Site Up and Running', 'd7d'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/authentication',
    component: ComponentCreator('/blog/tags/authentication', '9b6'),
    exact: true
  },
  {
    path: '/blog/tags/authorization',
    component: ComponentCreator('/blog/tags/authorization', '9e1'),
    exact: true
  },
  {
    path: '/blog/tags/azure',
    component: ComponentCreator('/blog/tags/azure', 'b38'),
    exact: true
  },
  {
    path: '/blog/tags/certifications',
    component: ComponentCreator('/blog/tags/certifications', 'e71'),
    exact: true
  },
  {
    path: '/blog/tags/cicd',
    component: ComponentCreator('/blog/tags/cicd', '392'),
    exact: true
  },
  {
    path: '/blog/tags/compliance',
    component: ComponentCreator('/blog/tags/compliance', 'cfb'),
    exact: true
  },
  {
    path: '/blog/tags/cybersecurity',
    component: ComponentCreator('/blog/tags/cybersecurity', 'b03'),
    exact: true
  },
  {
    path: '/blog/tags/entra-id',
    component: ComponentCreator('/blog/tags/entra-id', 'b1b'),
    exact: true
  },
  {
    path: '/blog/tags/google',
    component: ComponentCreator('/blog/tags/google', '058'),
    exact: true
  },
  {
    path: '/blog/tags/governance',
    component: ComponentCreator('/blog/tags/governance', '7bb'),
    exact: true
  },
  {
    path: '/blog/tags/hack-the-box',
    component: ComponentCreator('/blog/tags/hack-the-box', 'e41'),
    exact: true
  },
  {
    path: '/blog/tags/iam',
    component: ComponentCreator('/blog/tags/iam', '574'),
    exact: true
  },
  {
    path: '/blog/tags/lifecycle',
    component: ComponentCreator('/blog/tags/lifecycle', '16f'),
    exact: true
  },
  {
    path: '/blog/tags/microsoft',
    component: ComponentCreator('/blog/tags/microsoft', '82f'),
    exact: true
  },
  {
    path: '/blog/tags/monitoring',
    component: ComponentCreator('/blog/tags/monitoring', 'd25'),
    exact: true
  },
  {
    path: '/blog/tags/react',
    component: ComponentCreator('/blog/tags/react', 'ba3'),
    exact: true
  },
  {
    path: '/blog/tags/website',
    component: ComponentCreator('/blog/tags/website', '3b9'),
    exact: true
  },
  {
    path: '/blog/tags/welcome',
    component: ComponentCreator('/blog/tags/welcome', '34c'),
    exact: true
  },
  {
    path: '/blog/The Journey So Far',
    component: ComponentCreator('/blog/The Journey So Far', '7d2'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/nothing',
    component: ComponentCreator('/nothing', '7e4'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'd83'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '193'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '8f3'),
            routes: [
              {
                path: '/docs/category/javascript-projects',
                component: ComponentCreator('/docs/category/javascript-projects', '447'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/JavaScript/etch-a-sketch',
                component: ComponentCreator('/docs/JavaScript/etch-a-sketch', 'c3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'fd5'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
