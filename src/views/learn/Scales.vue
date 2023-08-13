<script setup lang="ts">
import { ref, computed } from "vue";
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

const synth = new Tone.Synth().toDestination();

const scale = ref<Scale>(SCALES[0]);
const key = ref<Key>(SHARP_KEYS[0]);

const keys = ref<readonly string[]>(SHARP_KEYS);
const isBlackKey = (key: Key) => {
    return key.includes("#") || key.includes("b");
};
const blackKeyPosition = (key: Key) => {
    // index of white key to the left, * 50px - 15px
    if (!isBlackKey(key)) return 0;
    const whiteKeyLeft =
        ["C", "D", "E", "F", "G", "A", "B"].indexOf(key[0]) + 1;
    return whiteKeyLeft * 50 - 15 + "px";
};

const activeNotes = computed(() =>
    SCALE[scale.value].keys.map(
        (note) => note + (keys.value.indexOf(key.value) % 12)
    )
);

const keyInScale = (thisKey: Key) => {
    const thisKeyIndex = keys.value.indexOf(thisKey);
    return activeNotes.value.includes(thisKeyIndex);
};

const playScale = () => {
    const allNotes = activeNotes.value.map((note) => keys.value[note] + "4");
    allNotes.push(keys.value[activeNotes.value[0]] + "5");

    const now = Tone.now();
    allNotes.forEach((note, index) => {
        console.log(note, index);
        synth.triggerAttackRelease(note, "8n", now + index / 2);
    });
};
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
            <div class="keyboard">
                <div
                    v-for="key in keys"
                    :class="{
                        black: isBlackKey(key as Key),
                        inScale: keyInScale(key as Key)
                    }"
                    :style="{
                        left: blackKeyPosition(key as Key)
                    }"
                    class="key"
                >
                    {{ key }}
                </div>
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
    gap: 1em;
}

.keyboard {
    display: flex;
    height: 100px;
    border-radius: 1em;
    overflow: hidden;
}

.key {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 50px;
    background: #fff;
    color: #000;

    &:not(:last-child) {
        border-right: 1px solid var(--color-border);
    }

    &.black {
        background: #000;
        color: #fff;
        position: absolute;
        height: 70%;
        width: 30px;
        z-index: 1;
    }

    &.inScale {
        background: var(--accent);
        color: #fff;

        &.black {
            background: color-mix(in srgb, var(--accent) 60%, #000);
        }
    }
}
</style>
