import { defineCollection } from "astro:content"
import { glob } from "astro/loaders";
import { z } from "astro/zod"

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    icon: z.string(),
    color: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
};