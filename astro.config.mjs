// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://juniorlabs.com.mx',
  // /proyectos cambió a /productos. En Cloudflare Pages manda public/_redirects (301 real);
  // esta entrada cubre el servidor de desarrollo y genera una página de respaldo con meta refresh.
  redirects: {
    '/proyectos': '/productos/',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
