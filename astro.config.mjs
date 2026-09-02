// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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
  ]
});