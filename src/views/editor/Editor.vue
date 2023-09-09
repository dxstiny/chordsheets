<script lang="ts" setup>
import { type ISong } from "@/types";
import { watch, ref, shallowRef, type PropType } from "vue";
import { useSongStore } from "@/stores/songs";
import Instrument from "./pages/Instrument.vue";
import Metadata from "./pages/Metadata.vue";
import Structure from "./pages/Structure.vue";

const store = useSongStore();

const props = defineProps({
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
});

watch(
    () => props.song,
    (song) => {
        if (!song) return;
        eSong.value = song;
    }
);

const eSong = ref<ISong>(props.song);

const tabs = [
    {
        name: "metadata",
        component: shallowRef(Metadata)
    },
    {
        name: "instrument",
        component: shallowRef(Instrument)
    },
    {
        name: "sections",
        component: shallowRef(Structure)
    }
];
const tab = ref(tabs[0]);
</script>
<template>
    <div class="settings">
        <div
            class="spotify"
            v-if="eSong.spotify"
        >
            <iframe
                :src="`https://open.spotify.com/embed/track/${eSong.spotify
                    .split('/')
                    .pop()}`"
                width="100%"
                height="80"
                frameborder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
        </div>
        <div class="tabs flex space-between">
            <label
                v-for="t in tabs"
                :key="t.name"
                :class="{ selected: tab.name === t.name }"
                @click="tab = t"
            >
                {{ t.name }}
            </label>
        </div>
        <div class="configuration">
            <component
                :is="tab.component"
                :song="song"
            />
        </div>
    </div>
</template>

<style>
.settings label {
    cursor: pointer;
}

.settings label.selected {
    color: var(--accent);
    font-weight: bold;
}

.settings .configuration {
    overflow: auto;
}

.settings .material-symbols-rounded {
    cursor: pointer;
}

.settings .configuration,
.settings .group .content {
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.settings .group .content .content {
    padding: 0.5em 0;
}

.settings h2 {
    margin: 0;
    margin-bottom: 0.5em;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.settings .flex {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1em;

    &.end {
        justify-content: flex-end;
    }

    &.space-between {
        justify-content: space-between;
    }
}

.settings .group {
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    background: var(--color-background-soft);
    padding: 0.5em;
}

.settings {
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.settings .icon-button {
    width: 100%;
}

.settings .tabs {
    border-bottom: 1px solid var(--color-border);
    padding: 1em;
    text-transform: uppercase;
}

.spotify {
    padding: 1em;
}
</style>
