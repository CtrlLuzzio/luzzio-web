// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://luzzio.me",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: "rewrite",
    },
    fallback: {
      es: "en",
    },
  },
  

  vite: {
    plugins: [tailwindcss()]
  },

  fonts: [
    {
      name: "Outfit",
      cssVariable: "--font-sans",
      provider: fontProviders.fontsource(),
      weights: ["200 800"],
      styles: ["normal"],
      fallbacks: ["sans-serif"]
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      provider: fontProviders.fontsource(),
      weights: ["100 800"],
      styles: ["normal", "italic"],
      fallbacks: ["monospace"]
    }
  ],

  integrations: [
    icon(), 
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          es: "es",
        },
      },
    }),
  ],

  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),
});