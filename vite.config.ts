import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "ChordSheets",
                short_name: "ChordSheets",
                icons: [
                    {
                        src: "/chordsheets/favicon_512.png",
                        sizes: "512x512"
                    }
                ],
                start_url: "/chordsheets/",
                display: "standalone",
                description:
                    "ChordSheets is a free web app for creating, editing, organising and sharing chord sheets for songs."
            }
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL("./index.html", import.meta.url)),
                editor: fileURLToPath(new URL("./editor.html", import.meta.url))
            }
        }
    },
    base: "/chordsheets/"
});
