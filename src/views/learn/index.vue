<script setup lang="ts">
import ChordFinder from "./ChordFinder.vue";
import ScaleFinder from "./ScaleFinder.vue";
import Scales from "./Scales.vue";
import ScaleQuiz from "./ScaleQuiz.vue";
import ChordProgressions from "./ChordProgressions.vue";

import IconButton from "@/components/IconButton.vue";

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
        <div class="main limit-width">
            <aside class="sidebar container">
                <router-link to="/learn/scale-finder">Scale Finder</router-link>
                <router-link to="/learn/scales">Scale Browser</router-link>
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
                    class="container"
                />
                <div
                    v-else
                    class="overview"
                >
                    <h1>Learn Music Theory</h1>
                    <div class="container learn-card">
                        <span class="material-symbols-rounded">search</span>
                        <div>
                            <h3>What am I playing?</h3>
                            <div class="actions">
                                <IconButton
                                    label="Which scale is this?"
                                    icon="arrow_forward"
                                    @click="$router.push('/learn/scale-finder')"
                                    :style="'blue'"
                                />
                                <IconButton
                                    label="Which chord is this?"
                                    icon="arrow_forward"
                                    @click="$router.push('/learn/chord-finder')"
                                    :style="'blue'"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="container learn-card">
                        <span class="material-symbols-rounded">explore</span>
                        <div>
                            <h3>Explore</h3>
                            <div class="actions">
                                <IconButton
                                    label="Scale Browser"
                                    icon="arrow_forward"
                                    @click="$router.push('/learn/scales')"
                                    :style="'blue'"
                                />
                                <IconButton
                                    label="Chord Progressions"
                                    icon="arrow_forward"
                                    @click="
                                        $router.push(
                                            '/learn/chord-progressions'
                                        )
                                    "
                                    :style="'blue'"
                                />
                            </div>
                        </div>
                    </div>
                    <router-link to="/learn/scale-quiz">
                        <div class="container clickable learn-card">
                            <span class="material-symbols-rounded">school</span>
                            <div>
                                <h3>Scale Quiz</h3>
                            </div>
                        </div>
                    </router-link>
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
    height: 100%;
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
}

.overview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
    margin-top: 1em;

    & h1 {
        grid-column: span 2;
    }
}

.learn-card {
    display: flex;
    gap: 1em;
    align-items: center;

    & h3 {
        margin: 0;
    }

    & .actions {
        display: flex;
        gap: 1em;
    }
}

.title {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 0.25em 0 1em;

    & img {
        width: 50px;
        aspect-ratio: 1/1;
    }

    & h1 .accent {
        color: var(--accent);
        font-weight: 900;
    }
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
        color: var(--color-heading);
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
    gap: 1em;

    @media screen and (max-width: 1200px) {
        grid-template-columns: 1fr;
    }

    .sidebar {
        display: flex;
        flex-direction: column;

        position: sticky;
        top: 0;

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
    }
}

main {
    height: 100%;
}
</style>
