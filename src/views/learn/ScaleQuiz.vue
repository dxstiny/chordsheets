<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
    SCALES,
    SHARP_KEYS,
    FLAT_KEYS,
    type Chord,
    type Scale
} from "../../types";
import { SCALE } from "../../scales";
import * as Tone from "tone";
import IconButton from "@/components/IconButton.vue";
import Keyboard from "./Keyboard.vue";
import { start, activeMidiNotes } from "./inputListener";

const synth = new Tone.Synth().toDestination();

const randomElement = <T>(arr: readonly T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const keys = [...SHARP_KEYS, ...FLAT_KEYS] as Chord[];
const key = ref<Chord>("C");
const scale = ref<Scale>("Major");
const correctNotes = ref<number[]>([]);
const attempts = ref(0);

const reset = () => {
    key.value = randomElement(keys);
    scale.value = randomElement(SCALES);
    correctNotes.value = [];
    attempts.value = 0;
};
reset();

const activeNotes = computed(() => {
    const offset = keys.indexOf(key.value);
    return SCALE[scale.value].keys.map((note) => (note + offset) % 12);
});

const playScale = () => {
    const root = activeNotes.value[0];

    const octave = (note: number) => (note >= root ? "4" : "5");
    const allNotes = activeNotes.value.map((note) => keys[note] + octave(note));

    allNotes.push(keys[root] + "5"); // root key an octave up

    const now = Tone.now();
    allNotes.forEach((note, index) => {
        synth.triggerAttackRelease(note, "8n", now + index / 2);
    });
};

const clickNote = (note: number) => {
    if (correctNotes.value.includes(note)) return;
    if (correctNotes.value.length === activeNotes.value.length) return;
    attempts.value++;
    if (activeNotes.value.includes(note)) {
        correctNotes.value.push(note);
    }
};

const clamp = (value: number, min: number, max: number) => {
    return Math.max(Math.min(value, max), min);
};

const round = (value: number, decimals: number) => {
    return Number(
        Math.round((value + "e" + decimals) as any) + "e-" + decimals
    );
};

const score = computed(() => {
    const correctness =
        (correctNotes.value.length / activeNotes.value.length) * 100;
    const penalty = (attempts.value - correctNotes.value.length) * 5;
    const score = clamp(correctness - penalty, 0, 100);
    return round(score, 1);
});

onMounted(() => {
    start();
});

watch(activeMidiNotes.value, (notes) => {
    for (let note of Object.keys(notes)) {
        const noteNumber = parseInt(note) % 12;
        clickNote(noteNumber);
    }
});
</script>
<template>
    <div class="scale-quiz">
        <progress
            :value="correctNotes.length"
            :max="activeNotes.length"
        />
        <div class="header">
            <h2>Scale Quiz</h2>
            <div class="info">
                <h3>
                    <span class="accent">{{ key }}</span> {{ scale }}
                </h3>
                <IconButton
                    icon="play_arrow"
                    label="Play Scale"
                    @click="playScale"
                />
            </div>
            <div class="score">
                <span class="material-symbols-rounded">star</span>
                <span>{{ score }}%</span>
            </div>
        </div>
        <div class="body">
            <div class="scale">
                <Keyboard
                    :highlight="correctNotes"
                    @keypress="clickNote"
                    clickable
                    :min="0"
                    :max="11"
                />
            </div>
            <IconButton
                icon="arrow_forward"
                label="Continue"
                @click="reset"
                :disabled="correctNotes.length < activeNotes.length"
            />
        </div>
    </div>
</template>

<style scoped>
.scale-quiz {
    padding: 1em;
    gap: 1em;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

progress {
    width: 100%;
    height: 1rem;
    border: none;
    border-radius: 0.5rem;
    appearance: none;

    &::-webkit-progress-bar {
        border-radius: 0.5rem;
        background-color: var(--color-background-soft);
    }

    &::-webkit-progress-value {
        border-radius: 0.5rem;
        background-color: var(--accent);
    }
}

.body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    height: 100%;
    width: 100%;
}

.accent {
    color: var(--accent);
    font-weight: 900;
}

.header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 1em;

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .score {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 0.9rem;

        .material-symbols-rounded {
            font-size: 1rem;
        }
    }
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
