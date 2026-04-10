import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://stamler.ca',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  }
});
