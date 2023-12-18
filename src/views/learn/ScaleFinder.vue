<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { SCALES, type Key, type Scale, SHARP_KEYS } from "../../types";
import { SCALE } from "../../scales";
import Dropdown from "../../components/Dropdown.vue";
import * as Tone from "tone";
import IconButton from "@/components/IconButton.vue";
import {
    start,
    inputDevices,
    getChordName,
    activeMidiNotes
} from "./inputListener";
import Keyboard from "./Keyboard.vue";

onMounted(() => {
    start();
});

const pressedNotes = ref<number[]>([]);

watch(activeMidiNotes.value, (notes) => {
    pressedNotes.value.push(...Object.keys(notes).map((x) => parseInt(x)));
});

/**
 * @returns {Scale: number[]} A map of scales to the number of notes that are
 * in it
 */
const allScaleCombinations = computed(() => {
    const combinations = {} as Record<string, number[]>;
    for (let root = 0; root < 12; root++) {
        for (let scale of SCALES) {
            const notes = SCALE[scale];
            const name = `${SHARP_KEYS[root]} ${scale}`;
            combinations[name] = notes.keys.map((x) => (x + root) % 12);
        }
    }

    return combinations;
});

const possibleScales = computed(() => {
    const notes = [...new Set(pressedNotes.value.map((x) => x % 12))];

    const possibleScales = [];
    for (let scale of Object.keys(allScaleCombinations.value)) {
        const scaleNotes = allScaleCombinations.value[scale];

        if (notes.some((x) => !scaleNotes.includes(x))) continue;

        possibleScales.push({
            name: scale,
            notes: scaleNotes
        });
    }

    return possibleScales;
});

const clickNote = (note: number) => {
    if (pressedNotes.value.includes(note)) {
        pressedNotes.value.splice(pressedNotes.value.indexOf(note), 1);
    } else {
        pressedNotes.value.push(note);
    }
};
</script>
<template>
    <div class="chord-finder">
        <h2>Scale Finder</h2>
        <p>Connected Midi Devices:</p>
        <ul>
            <li
                v-for="device in inputDevices"
                :key="device.id"
                class="device"
                :class="{
                    active: Object.values(activeMidiNotes).some(
                        (x) => x.device === device.name
                    )
                }"
            >
                {{ device.name }}
            </li>
        </ul>
        <br />
        <div class="row">
            <span>Playing:</span>
            <h3>{{ getChordName(pressedNotes) }}</h3>
        </div>
        <br />
        <Keyboard
            :min="48"
            :max="72"
            :highlight="pressedNotes"
            clickable
            @keypress="clickNote"
        >
        </Keyboard>
        <br />
        <hr />
        <br />
        <div class="scales">
            <ul>
                <li
                    v-for="scale in possibleScales"
                    :key="scale.name"
                    class="scale"
                >
                    {{ scale.name }}
                </li>
            </ul>
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
