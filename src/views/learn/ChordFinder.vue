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

onMounted(() => {
    start();
});
</script>
<template>
    <div class="chord-finder">
        <h2>Chord Finder</h2>
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
            <h3>{{ currentChord }}</h3>
        </div>
        <br />
        <Keyboard
            :highlight="Object.keys(activeMidiNotes).map((x) => parseInt(x))"
            :min="48"
            :max="72"
        >
        </Keyboard>
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
