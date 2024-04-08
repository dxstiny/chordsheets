<script setup lang="ts">
import ChordFinder from "./ChordFinder.vue";
import ScaleFinder from "./ScaleFinder.vue";
import Scales from "./Scales.vue";
import ScaleQuiz from "./ScaleQuiz.vue";
import ChordProgressions from "./ChordProgressions.vue";

import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";

const route = useRoute();

const tabs = {
    "scale-finder": ScaleFinder,
    scales: Scales,
    "scale-quiz": ScaleQuiz,
    "chord-finder": ChordFinder,
    "chord-progressions": ChordProgressions
};

const activeTab = computed(() => {
    const tab = route.path.split("/").pop() as keyof typeof tabs;
    return tabs[tab];
});

const onClick = async () => {
    //const device = await navigator.hid.requestDevice({ filters: [] });
    let devices = await navigator.hid.getDevices();
    devices.forEach(async (device) => {
        console.log("HID: Device", device);

        console.log("HID: Open device", device.collections[0]);

        device.addEventListener("inputreport", (event) => {
            const { data, device, reportId } = event;

            console.log("HID: Input report", data, device, reportId);
        });
        const arrBuffer = new ArrayBuffer(61 - 3);
        const arr = [0x81, Array(61 - 3).fill(0x00)];
        const arrBufferView = new Uint8Array(arrBuffer);
        arrBufferView.set(arr as any);
        try {
            await device.open();
        } catch (error) {
            console.log("HID: Error opening device", error);
        }
        console.log("HID: Device opened", device);
        device.sendReport(129, arrBufferView);
        device.sendReport(128, arrBufferView);
        console.log("HID: Report sent");
    });
};
</script>
<template>
    <div class="learn">
        <header>
            <div class="limit-width content">
                <router-link to="/">
                    <h1>Chord<span class="accent">Sheets</span></h1>
                </router-link>
                <p class="material-symbols-rounded">school</p>
            </div>
        </header>
        <div class="main limit-width">
            <aside class="sidebar">
                <router-link to="/learn/scale-finder">Scale Finder</router-link>
                <router-link to="/learn/scales">Scales</router-link>
                <router-link to="/learn/scale-quiz">Scale Quiz</router-link>
                <hr />
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
                <div v-else>
                    <h1>Learn Music Theory</h1>
                    <p>Choose a topic from the sidebar.</p>
                </div>
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
        gap: 0.5em;
        align-items: flex-start;
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
    height: 100%;

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
                text-decoration: underline;
            }
        }

        & hr {
            border: none;
            border-bottom: 1px solid var(--color-border);
            margin: 0.3rem 0;
        }

        @media screen and (max-width: 1400px) {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
}

main {
    height: 100%;
}
</style>
