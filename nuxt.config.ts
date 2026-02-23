import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  experimental: {
    appManifest: false,
  },
  modules: [
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/scss/main.scss',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['color-functions', 'global-builtin', 'import', 'if-function']
        }
      }
    }
  },
  hooks: {
    "pages:extend"(pages) {
      const addOrganizationAlias = (page: any) => {
        if (typeof page.path === "string" && page.path.startsWith("/customers")) {
          const aliasPath = page.path.replace(/^\/customers/, "/organization");
          const aliases = Array.isArray(page.alias)
            ? page.alias
            : page.alias
              ? [page.alias]
              : [];

          if (!aliases.includes(aliasPath)) {
            page.alias = [...aliases, aliasPath];
          }
        }

        if (Array.isArray(page.children)) {
          page.children.forEach(addOrganizationAlias);
        }
      };

      pages.forEach(addOrganizationAlias);
    },
  },
})
