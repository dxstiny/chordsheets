<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
    start,
    inputDevices,
    getChordName,
    activeMidiNotes
} from "./inputListener";
import Keyboard from "./Keyboard.vue";

const pressedNotes = ref<number[]>([]);

watch(activeMidiNotes.value, (notes) => {
    pressedNotes.value.push(...Object.keys(notes).map((x) => parseInt(x)));
});

const clickNote = (note: number) => {
    if (pressedNotes.value.includes(note)) {
        pressedNotes.value.splice(pressedNotes.value.indexOf(note), 1);
    } else {
        pressedNotes.value.push(note);
    }
};

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
            <h3>{{ getChordName(pressedNotes) }}</h3>
        </div>
        <br />
        <Keyboard
            :highlight="pressedNotes"
            :min="48"
            :max="72"
            clickable
            @keypress="clickNote"
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
