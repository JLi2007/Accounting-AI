import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', "@wxt-dev/auto-icons"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  srcDir: "src",
  manifest: {
    manifest_version: 3,
    name: 'Accounting AI Extension',
    version: '1.0.0',
    description: 'Wrapper of OpenAI',
    // action: {
    //   default_popup: 'popup.html',
    //   default_icon: './icons/64.png',
    // },
    // permissions: ['storage'],
    // background: {
    //   service_worker: 'background.ts',
    // },
    // content_scripts: [
    //   {
    //     matches: ['<all_urls>'],
    //     js: ['content.ts'],
    //   },
    // ],
  },
});
