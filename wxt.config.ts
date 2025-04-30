import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  autoIcons: {
    grayscaleOnDevelopment: false,
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  srcDir: "src",
  manifest: {
    name: "Accounting AI Extension",
    version: "1.0.0",
    description: "Wrapper of OpenAI",
    permissions: ["identity"],
    // action: {
    //   default_popup: 'popup.html',
    //   default_icon: './icons/64.png',
    // },
    background: {
      service_worker: "background.js",
    },
    oauth2: {
      client_id:
        "312610270965-99jbu0n8av8ogp7bah5l8pi4beeaovrv.apps.googleusercontent.com",
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
      ],
    },
    host_permissions: [    "https://accounts.google.com/*",
      "https://www.googleapis.com/*"],
    content_security_policy: {
      extension_pages: `
      script-src 'self' http://localhost:3000;
      object-src 'self';
    `,
    },
    web_accessible_resources: [
      {
        resources: ["client.js", "gapi.js"],
        matches: ["<all_urls>"],
      },
    ],

    // content_scripts: [
    //   {
    //     matches: ['<all_urls>'],
    //     js: ['content.ts'],
    //   },
    // ],
  },
});
