<script setup lang="ts">
import { RouterView } from "vue-router";
import DropImport from "./views/DropImport.vue";
import QuickActionModal from "./views/QuickActionModal.vue";

import { version } from "../package.json";
import Sidebar from "./components/Sidebar.vue";

console.log(`%cChordSheets v${version}`, "color:#00bd7e;font-size:2rem");
</script>

<template>
    <QuickActionModal />
    <DropImport>
        <div class="screen">
            <Sidebar />
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
    grid-template-columns: max-content 1fr;
    padding: 1em;
    overflow: clip;
    gap: 1em;
    min-height: 100vh;

    background: var(--color-background-soft);

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        overflow: auto;
        padding-bottom: calc(2em + 74px);
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
</style>
