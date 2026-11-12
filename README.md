# ABDM Connector Docs

Developer portal for teams integrating ABDM flows (M1–M4) through the connector APIs. Built with [VitePress](https://vitepress.dev).

## Run locally

```bash
npm install
cp .env.example .env          # optional: set VITE_API_BASE_URL to the sandbox
npm run docs:dev              # http://localhost:5173
```

## Build and deploy

```bash
npm run docs:build            # output: docs/.vitepress/dist (static files)
npm run docs:preview
```

Host `docs/.vitepress/dist` on any static host (S3 + CloudFront, Nginx, GitHub Pages).

## Layout

```
docs/
├── index.md                     # Landing page
├── guide/                       # Introduction, authentication, response format
├── m1/                          # M1 · ABHA flow guides
├── reference/m1-endpoints.md    # One-page endpoint table
└── .vitepress/
    ├── config.mjs               # Nav, sidebar, search, Mermaid
    └── theme/components/
        ├── ApiPlayground.vue    # "Try it" console (calls the sandbox from the browser)
        └── EndpointBadge.vue    # METHOD + path badge
```

## Writing pages

- Diagrams: use ```` ```mermaid ```` blocks.
- Endpoint header: `<EndpointBadge method="POST" path="/abha/M1/..." />`
- Live console:

  ```md
  <ApiPlayground
    method="POST"
    path="/abha/M1/validate-abha"
    :params="[{ name: 'aadhaar_number', required: true }]"
  />
  ```

  Use `:body="{...}"` for JSON-body endpoints, `in: 'path'` for `{placeholders}`, and `binary` for image responses.

## Try-it console requirements

- The sandbox connector must allow **CORS** from the docs domain.
- Never ship credentials. Readers paste their own sandbox token, which is kept only in `sessionStorage`.
- Point it at the **sandbox** only.

## Keeping docs in sync

When a connector endpoint changes, update its guide page and `docs/reference/m1-endpoints.md` in the same release.
