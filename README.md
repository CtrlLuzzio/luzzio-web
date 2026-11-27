> README EN ESPAÑOL [AQUÍ](README.es.md)
# luzzio-web

This repository contains the source code for (website link wip), an Astro-powered website serving as a personal blog and professional portfolio across my multiple disciplines: Software Developer, Competitive Fighting Game Player, and Content Creator.

## Features

* **Multi-Disciplinary Identity:** Interactive persona switcher (*Dev / FGC / Creator*) on the home page with session persistence.
* **Internationalization (i18n):** Full bilingual support (English / Spanish) with automatic language detection and localized routing.
* **Theming System:** [**Catppuccin**](https://catppuccin.com/) ([Mocha](https://catppuccin.com/palette/#flavor-mocha) & [Latte](https://catppuccin.com/palette/#flavor-latte)) color palettes with OS preference detection and FOUC-free persistence.
* **Dynamic Integrations:**
  * **GitHub API (SSG):** Automated project showcase with sanitized `README` rendering and private repository support.
  * **start.gg GraphQL API:** Competitive tournament standings automatically cross-linked with related blog posts.
  * **Twitch API:** Live stream status indicator powered by `Astro Actions`.
* **Interactive Blog:** Typed Content Layer collections with real-time search, combined category/tag filtering, and pagination.
* **Services Funnel & Contact:** Interactive service catalog with automatic form pre-selection, `Zod` validation, and notifications via **Resend** and **Discord Webhooks**.
* **Performance & Accessibility:** Pre-rendered static pages (SSG), View Transitions (`<ClientRouter />`), SEO/OpenGraph metadata, bilingual sitemap, and keyboard-accessible navigation.

## Tech Stack

* **Framework & Language:** [Astro](https://astro.build/), [TypeScript](https://www.typescriptlang.org/)
* **Styling & Icons:** [Tailwind CSS v4](https://tailwindcss.com/), [Catppuccin](https://catppuccin.com/), [Tabler Icons](https://tabler.io/icons) (`astro-icon`)
* **Backend & Validation:** Astro Actions, [Zod](https://zod.dev/), [Resend](https://resend.com/), Discord Webhooks
* **APIs:** GitHub REST API, start.gg GraphQL API, Twitch Helix API
* **Deployment:** [Cloudflare](https://www.cloudflare.com/) (`@astrojs/cloudflare`)

## Local Development

### Prerequisites

* [Node.js](https://nodejs.org/) (v20+ recommended)
* [pnpm](https://pnpm.io/) *(recommended package manager; this repo tracks `pnpm-lock.yaml`)*
* *(Optional)* [Nix](https://nixos.org/) with Flakes enabled (`nix develop`) or `direnv` using `.envrc.example`.

### Setup & Running

1. **Clone the repository and install dependencies:**

```bash
git clone https://github.com/CtrlLuzzio/luzzio-web.git
cd luzzio-web
pnpm install
```

2. **Configure environment variables:**

Copy the example file and fill in your local credentials (GitHub, start.gg, Twitch APIs, etc.):

```sh
# Linux / macOS / PowerShell
cp .env.example .env

# Windows (CMD)
copy .env.example .env
```

3. **Start the development server:**

```bash
pnpm dev
```

### Available Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts the local dev server at `localhost:4321` |
| `pnpm astro check` | Runs TypeScript and Astro diagnostics |
| `pnpm build` | Builds the production site to `./dist/` |
| `pnpm preview` | Previews the production build locally |

<details>
<summary>Equivalents for npm/npx, Yarn, and Bun</summary>

> **Note:** Using a package manager other than `pnpm` will ignore `pnpm-lock.yaml` and may resolve slightly different dependency versions.

| Action | npm / npx | Yarn | Bun |
| :--- | :--- | :--- | :--- |
| Install dependencies | `npm install` | `yarn install` | `bun install` |
| Dev server | `npm run dev` | `yarn dev` | `bun run dev` |
| Diagnostics (check) | `npx astro check` | `yarn astro check` | `bunx astro check` |
| Production build | `npm run build` | `yarn build` | `bun run build` |
| Preview build | `npm run preview` | `yarn preview` | `bun run preview` |

</details>

## AI Usage Disclosure

This website was built with the assistance of AI (Gemini, to be precise), acting as a pair-programmer and technical consultant.

While AI was a valuable tool to speed up the workflow, I maintained full control over the project. All core architectural decisions, design choices, tech stack selection, editorial content, and final implementations were strictly directed, reviewed, and authorized by me.

In the spirit of transparency, here is a breakdown of how AI was integrated into the workflow:

* **UI/UX & Architectural Discussions:** Bouncing off layout concepts, responsive design choices, and consistent component layering across the site.
* **Backend & Integrations:** Assisting in setting up `Astro Actions`, `Zod` schemas, input sanitization, and secure external API integrations without exposing credentials.
* **Debugging, Audits & Refactoring:** Troubleshooting typing and styling issues, modularizing client scripts, and conducting performance, SEO, and accessibility (`a11y`) reviews.
* **Copywriting & i18n:** Refining English and Spanish copy while catching false friends and translation nuances.

**TL;DR:** I already knew the way; AI just helped me get there faster.

## License

The source code (layouts, components, scripts, etc.) of this website is licensed under the [MIT License](LICENSE).

However, all of its contents (blog posts, photographs, the **Luzzio** personal brand, original visual assets, etc.) are under copyright (Copyright © 2026 Luzzio) and cannot be reproduced, distributed, or reused without explicit authorization.

**Disclaimer:** Third-party intellectual property, characters, tournament logos, and trademarks belong to their respective owners and are not covered by this copyright.