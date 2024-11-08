// @ts-check
import { defineConfig } from 'astro/config';
import { NodePackageImporter } from 'sass';
// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          importers: [new NodePackageImporter()],
        }
      }
    }
  }
});
