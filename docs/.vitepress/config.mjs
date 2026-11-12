import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'ABDM Connector',
    description: 'Integrate ABDM M1–M4 flows through the connector APIs',
    lang: 'en-IN',
    // Served from https://<user>.github.io/abdm-connector-docs/ on GitHub Pages.
    // Override with DOCS_BASE=/ when hosting at a domain root.
    base: process.env.DOCS_BASE || '/abdm-connector-docs/',
    cleanUrls: true,
    lastUpdated: true,

    themeConfig: {
      nav: [
        { text: 'Guide', link: '/guide/introduction' },
        { text: 'M1 · ABHA', link: '/m1/overview' },
        { text: 'API Reference', link: '/reference/m1-endpoints' },
      ],

      sidebar: {
        '/guide/': [
          {
            text: 'Getting started',
            items: [
              { text: 'Introduction', link: '/guide/introduction' },
              { text: 'Authentication', link: '/guide/authentication' },
              { text: 'Response format', link: '/guide/response-format' },
            ],
          },
          {
            text: 'Modules',
            items: [
              { text: 'M1 · ABHA', link: '/m1/overview' },
              { text: 'M2 · HIP (coming soon)', link: '/guide/introduction#modules' },
              { text: 'M3 · HIU (coming soon)', link: '/guide/introduction#modules' },
              { text: 'M4 · HPR / HFR (coming soon)', link: '/guide/introduction#modules' },
            ],
          },
        ],
        '/m1/': [
          {
            text: 'M1 · ABHA',
            items: [
              { text: 'Overview', link: '/m1/overview' },
              { text: 'Patient consent', link: '/m1/consent' },
            ],
          },
          {
            text: 'Create ABHA',
            items: [
              { text: 'Using Aadhaar OTP', link: '/m1/create-aadhaar-otp' },
              { text: 'Using biometric', link: '/m1/create-biometric' },
            ],
          },
          {
            text: 'Find / verify ABHA',
            items: [
              { text: 'Verify existing ABHA', link: '/m1/verify-abha' },
              { text: 'Link ABHA to a patient', link: '/m1/link-patient' },
              { text: 'ABHA card', link: '/m1/abha-card' },
            ],
          },
          {
            text: 'Reference',
            items: [{ text: 'All M1 endpoints', link: '/reference/m1-endpoints' }],
          },
        ],
        '/reference/': [
          {
            text: 'API Reference',
            items: [{ text: 'M1 endpoints', link: '/reference/m1-endpoints' }],
          },
        ],
      },

      search: { provider: 'local' },
      outline: { level: [2, 3] },
      footer: {
        message: 'ABDM Connector developer documentation',
      },
    },

    mermaid: {},

    // mermaid 11 depends on CommonJS packages (e.g. fastdom) that
    // vitepress-plugin-mermaid doesn't pre-bundle. Without this the dev
    // server serves a blank page ("does not provide an export named 'default'").
    vite: {
      optimizeDeps: {
        include: ['mermaid > fastdom', 'mermaid > fastdom/extensions/fastdom-promised.js'],
      },
    },
  }),
)
