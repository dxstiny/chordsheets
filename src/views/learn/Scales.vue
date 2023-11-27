<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
    SCALES,
    SHARP_KEYS,
    FLAT_KEYS,
    type Key,
    type Scale
} from "../../types";
import { SCALE } from "../../scales";
import Dropdown from "../../components/Dropdown.vue";
import * as Tone from "tone";
import IconButton from "@/components/IconButton.vue";
import {
    start,
    inputDevices,
    currentChord,
    activeMidiNotes
} from "./inputListener";
import Keyboard from "./Keyboard.vue";

const synth = new Tone.Synth().toDestination();

const scale = ref<Scale>(SCALES[0]);
const key = ref<Key>(SHARP_KEYS[0]);

const keys = ref<readonly string[]>(SHARP_KEYS);

const activeNotes = computed(() => {
    //SCALE[scale.value].keys.map((note) => note + keys.value.indexOf(key.value));
    const notes = [];
    for (
        let offset = keys.value.indexOf(key.value);
        offset < 88;
        offset += 12
    ) {
        notes.push(SCALE[scale.value].keys.map((note) => note + offset));
    }
    return notes.flat();
});

const playScale = () => {
    const allNotes = activeNotes.value.map((note) => keys.value[note] + "4");
    allNotes.push(keys.value[activeNotes.value[0]] + "5");

    const now = Tone.now();
    allNotes.forEach((note, index) => {
        console.log(note, index);
        synth.triggerAttackRelease(note, "8n", now + index / 2);
    });
};

onMounted(() => {
    start();
});
</script>
<template>
    <div class="learn-scales">
        <div class="header">
            <Dropdown
                label="Key"
                v-model="key"
                :options="SHARP_KEYS"
            />
            <Dropdown
                label="Scale"
                v-model="scale"
                :options="SCALES"
            />
            <IconButton
                icon="play_arrow"
                label="Play Scale"
                @click="playScale"
            />
        </div>
        <div class="body">
            <div class="scale">
                <Keyboard
                    :highlight="activeNotes"
                    :min="48"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.learn-scales {
    padding: 1em;
    gap: 1em;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.header {
    display: flex;
    align-items: center;
    gap: 1em;
}

.body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
}

.row {
    display: flex;
    align-items: center;
    gap: 1em;
}

.device.active {
    color: var(--accent);
}

hr {
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--color-border);
}
</style>
