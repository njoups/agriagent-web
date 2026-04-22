// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://agriagent.co.id",
  integrations: [mdx(), sitemap()],
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
});
