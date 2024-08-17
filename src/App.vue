<script setup lang="ts">
import { RouterView } from "vue-router";
import { useSongStore } from "@/stores/songs";
import { useSettingsStore } from "@/stores/settings";
import DropImport from "./views/DropImport.vue";
import { useRouter } from "vue-router";

import { version } from "../package.json";

const router = useRouter();
const store = useSongStore();
const settings = useSettingsStore();

const newSong = () => {
    const song = store.createNew();
    router.push(settings.editorUrl(song.id));
};

console.log(`%cChordSheets v${version}`, "color:#00bd7e;font-size:2rem");
</script>

<template>
    <DropImport>
        <div class="screen">
            <aside class="sidebar">
                <div class="title">
                    <img :src="'favicon.svg'" />
                    <h1>Chord<span class="accent">Sheets</span></h1>
                </div>
                <div class="links">
                    <RouterLink to="/">
                        <span class="material-symbols-rounded">home</span>
                        <span class="label">Home</span>
                    </RouterLink>
                    <a @click="newSong">
                        <span class="material-symbols-rounded">add_circle</span>
                        <span class="label">Create</span>
                    </a>
                    <RouterLink to="/browse">
                        <span class="material-symbols-rounded">list</span>
                        <span class="label">Songs</span>
                    </RouterLink>
                    <RouterLink to="/learn">
                        <span class="material-symbols-rounded">school</span>
                        <span class="label">Learn</span>
                    </RouterLink>
                    <RouterLink to="/settings">
                        <span class="material-symbols-rounded">settings</span>
                        <span class="label">Settings</span>
                    </RouterLink>
                </div>
            </aside>
            <main class="main">
                <RouterView />
            </main>
        </div>
    </DropImport>
</template>

<style>
#app {
    min-height: 100vh;
    min-height: 100svh;
}

aside,
main>div:not(.grid),
main .container {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 1em;
    padding: 1em;
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);

    &.clickable {
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover:not(:has(button:hover)) {
            background: var(--color-background-mute);
        }
    }
}

main a:has(.clickable) {
    text-decoration: none;
    color: inherit;
}

.main>.grid {
    display: grid;
    border: none;
    background: none;
    padding: 0;
    box-shadow: none;
    gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

    @media (min-width: 800px) {
        & .w-2 {
            grid-column: span 2;
        }

        & .w-3 {
            grid-column: span 3;
        }

        & .h-2 {
            grid-row: span 2;
        }

        & .h-3 {
            grid-row: span 3;
        }
    }

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
}
</style>

<style scoped>
.screen {
    display: grid;
    grid-template-columns: 220px 1fr;
    padding: 1em;
    overflow: clip;
    gap: 1em;
    min-height: 100vh;

    background: var(--color-background-soft);

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        overflow: auto;
        padding-bottom: calc(2em + 74px);

        & aside {
            grid-row: 2;

            .links {
                flex-direction: row;
                justify-content: space-around;
            }

            .title,
            .label {
                display: none;
            }
        }
    }
}

.title {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 0.25em 0 1em;

    font-size: 0.9rem;

    & img {
        width: 35px;
        aspect-ratio: 1/1;
    }

    & h1 .accent {
        color: var(--accent);
        font-weight: 900;
    }
}

aside {
    position: sticky;
    top: 1em;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: calc(100vh - 2em);

    @media (max-width: 800px) {
        z-index: 1;
        top: unset;
        bottom: 1em;
        left: 1em;
        right: 1em;
        position: fixed;
    }
}

main {
    max-height: calc(100vh - 2em);
    display: flex;
    flex-direction: column;

    @media (max-width: 800px) {
        z-index: 0;
        max-height: unset;
        gap: 1em;
    }
}

.links {
    display: flex;
    flex-direction: column;

    & a {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: 0.5em;
        padding: 0.5em 1em;
        border-radius: 0.5em;
        transition: background-color 0.2s;
        color: var(--color-text);

        &.router-link-active {
            background: var(--color-background-soft);
            color: var(--accent);
        }

        &:hover {
            background: var(--color-background-soft);
        }
    }
}
</style>
