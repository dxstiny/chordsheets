<script setup lang="ts">
import { RouterView } from "vue-router";
import { useSongStore } from "@/stores/songs";
import { useSettingsStore } from "@/stores/settings";
import DropImport from "./views/DropImport.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useSongStore();
const settings = useSettingsStore();

const newSong = () => {
    const song = store.createNew();
    router.push(settings.editorUrl(song.id));
};
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
                        Home
                    </RouterLink>
                    <a @click="newSong">
                        <span class="material-symbols-rounded">add_circle</span>
                        Create
                    </a>
                    <RouterLink to="/browse">
                        <span class="material-symbols-rounded">list</span>
                        Songs
                    </RouterLink>
                    <RouterLink to="/learn">
                        <span class="material-symbols-rounded">school</span>
                        Learn
                    </RouterLink>
                    <RouterLink to="/settings">
                        <span class="material-symbols-rounded">settings</span>
                        Settings
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
main > div:not(.grid),
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

.main > .grid {
    display: grid;
    border: none;
    background: none;
    padding: 0;
    box-shadow: none;
    gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

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
}

main {
    max-height: calc(100vh - 2em);
    display: flex;
    flex-direction: column;
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
