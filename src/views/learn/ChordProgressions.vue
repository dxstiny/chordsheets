<script setup lang="ts">
import { ref, computed } from "vue";
import Dropdown from "../../components/Dropdown.vue";
import Keyboard from "./Keyboard.vue";
import { SHARP_KEYS, SCALES, type Scale, type Key } from "@/types";
import { SCALE } from "@/scales";
import { getChordName } from "./inputListener";

const scale = ref<Scale>(SCALES[0]);
const key = ref<Key>(SHARP_KEYS[0]);

const roman = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII"
};

const triad = {
    1: [1, 3, 5],
    2: [2, 4, 6],
    3: [3, 5, 7],
    4: [4, 6, 1],
    5: [5, 7, 2],
    6: [6, 1, 3],
    7: [7, 2, 4]
};

const chord = (scale: Scale, key: Key, degree: keyof typeof triad) => {
    const scaleNotes = SCALE[scale];

    const keyId = SHARP_KEYS.indexOf(key);

    const notes = triad[degree].map((note) => {
        const noteId = scaleNotes.keys[note - 1];
        const id = noteId + keyId;
        return id > 12 ? id - 12 : id;
    });
    return notes;
};

const chordName = (chord: number[]) => {
    return getChordName(chord);
};
</script>
<template>
    <div class="progressions">
        <div class="options">
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
        </div>
        <div class="chords">
            <div
                class="chord"
                v-for="(name, degree) in roman"
            >
                <h3>{{ name }}</h3>
                {{ chordName(chord(scale, key, degree)) }}
                <Keyboard
                    :min="0"
                    :max="12"
                    :highlight="chord(scale, key, degree)"
                />
            </div>
        </div>
    </div>
</template>
<style scoped>
.options {
    display: flex;
    gap: 1em;
}

.chords {
    display: flex;
    flex-wrap: wrap;
    gap: 2em;

    .chord {
        flex: 1;
    }
}
</style>
