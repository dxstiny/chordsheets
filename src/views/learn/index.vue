<script setup lang="ts">
import ChordFinder from "./ChordFinder.vue";
import ScaleFinder from "./ScaleFinder.vue";
import ChordProgressions from "./ChordProgressions.vue";

import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const tabs = {
    "scale-finder": ScaleFinder,
    "chord-finder": ChordFinder,
    "chord-progressions": ChordProgressions
};

const activeTab = computed(() => {
    const tab = route.path.split("/").pop() as keyof typeof tabs;
    return tabs[tab];
});
</script>
<template>
    <div class="learn">
        <header>
            <div class="limit-width content">
                <router-link to="/">
                    <h1>Chord<span class="accent">Sheets</span></h1>
                </router-link>
                <p>LEARN</p>
            </div>
        </header>
        <div class="main limit-width">
            <aside class="sidebar">
                <router-link to="/learn/scale-finder">Scale Finder</router-link>
                <router-link to="/learn/chord-finder">Chord Finder</router-link>
                <router-link to="/learn/chord-progressions"
                    >Chord Progressions</router-link
                >
            </aside>
            <main>
                <component
                    v-if="activeTab"
                    :is="activeTab"
                />
                <div v-else>Somewhat else</div>
            </main>
        </div>
    </div>
</template>
<style scoped>
.learn {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    height: 100svh;
}

h1 .accent {
    color: var(--accent);
    font-weight: 900;
}

header {
    border-bottom: 1px solid var(--color-border);
    background: var(--color-background-soft);
    padding: 1em;
    width: 100%;
    display: flex;
    justify-content: center;

    .content {
        display: flex;
        gap: 1em;
        align-items: flex-end;
    }
}

.limit-width {
    min-width: 100%;

    @media screen and (min-width: 1400px) {
        min-width: 1400px;
        max-width: 1400px;
    }
}

.main {
    display: grid;
    align-items: start;
    grid-template-columns: 200px 1fr;
    padding: 1em 0;
    gap: 2em;

    .sidebar {
        border: 1px solid var(--color-border);
        background: var(--color-background-soft);
        padding: 1em;
        border-radius: 1em;

        display: flex;
        flex-direction: column;

        position: sticky;
        top: 1em;

        & a {
            color: var(--color-text);

            &.router-link-active {
                color: var(--accent);
            }

            &:hover {
                color: var(--color-heading);
            }
        }
    }
}
</style>
