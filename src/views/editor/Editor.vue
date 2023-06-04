<script lang="ts" setup>
import NumberInput from "@/components/NumberInput.vue";
import TextInput from "@/components/TextInput.vue";
import Checkbox from "@/components/Checkbox.vue";
import {
    INSTRUMENT_TYPES,
    SECTION_TYPES,
    type ISong,
    type IInstrument
} from "@/types";
import { watch, ref, type PropType } from "vue";
import Dropdown from "@/components/Dropdown.vue";
import { useSongStore } from "@/stores/songs";

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

const addInstrument = () => {
    const slots = ["l", "r1", "r2"];

    for (const slot of slots) {
        if (!eSong.value.instruments[slot]) {
            eSong.value.instruments[slot] = {
                type: INSTRUMENT_TYPES[0],
                name: INSTRUMENT_TYPES[0],
                volume: 100,
                page: 1
            } as IInstrument;
            return;
        }
    }
};

watch(
    () => eSong.value,
    (song) => {
        if (!song) return;
        store.updateSong(song);
    }
),
    { deep: true };
</script>
<template>
    <div class="configuration">
        <TextInput
            v-model="eSong.title"
            label="title"
        />
        <TextInput
            v-model="eSong.artist"
            label="artist"
        />
        <TextInput
            v-model="eSong.key"
            label="key"
        />
        <NumberInput
            v-model="eSong.bpm"
            :min="0"
            label="bpm"
        />
        <NumberInput
            v-model="eSong.transpose"
            :min="-12"
            :max="12"
            label="transpose"
        />
        <NumberInput
            v-model="eSong.octave"
            :min="-1"
            :max="1"
            label="octave"
        />
        <div class="group">
            <h2>Options</h2>
            <div class="content">
                <Checkbox
                    v-for="(_, name) in eSong.options"
                    v-model="eSong.options[name]"
                    :label="name"
                />
            </div>
        </div>
        <div class="group">
            <h2>Instruments</h2>
            <div class="flex end">
                <span
                    @click="addInstrument"
                    class="material-symbols-rounded"
                >
                    +
                </span>
            </div>
            <div class="content">
                <div
                    class="group"
                    v-for="name in Object.keys(eSong.instruments)"
                >
                    <h2>{{ name }}</h2>
                    <div class="flex end">
                        <span
                            @click="delete eSong.instruments[name]"
                            class="material-symbols-rounded"
                        >
                            -
                        </span>
                    </div>
                    <div class="content">
                        <TextInput
                            v-model="eSong.instruments[name].name"
                            label="name"
                        />
                        <NumberInput
                            v-model="eSong.instruments[name].volume"
                            :min="0"
                            :max="127"
                            label="volume"
                        />
                        <NumberInput
                            v-model="eSong.instruments[name].page"
                            label="page"
                        />
                        <Dropdown
                            v-model="eSong.instruments[name].type"
                            :options="INSTRUMENT_TYPES"
                            label="type"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="group">
            <h2>Sections</h2>
            <div class="flex end">
                <span
                    @click="
                        eSong.sections.push({ type: 'chorus', progression: [] })
                    "
                    class="material-symbols-rounded"
                >
                    +
                </span>
            </div>
            <div class="content">
                <div
                    class="group"
                    v-for="(section, index) in eSong.sections"
                >
                    <div class="flex end">
                        <span
                            @click="eSong.sections.splice(index, 1)"
                            class="material-symbols-rounded"
                        >
                            -
                        </span>
                    </div>
                    <Dropdown
                        v-model="section.type"
                        :options="SECTION_TYPES"
                        label="type"
                    />
                    <div class="flex end">
                        <span
                            @click="
                                eSong.sections[index].progression.push({
                                    chord: 'C',
                                    duration: 4
                                })
                            "
                            class="material-symbols-rounded"
                        >
                            +
                        </span>
                    </div>
                    <div class="content">
                        <div
                            class="group"
                            v-for="(chord, index) in section.progression"
                        >
                            <div class="flex end">
                                <span
                                    @click="
                                        section.progression.splice(index, 1)
                                    "
                                    class="material-symbols-rounded"
                                    >-</span
                                >
                            </div>
                            <div class="content">
                                <TextInput
                                    v-model="chord.chord"
                                    label="name"
                                />
                                <NumberInput
                                    v-model="chord.duration"
                                    :min="1"
                                    label="duration"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="group">
            <h2>Structure</h2>
            <div class="flex end">
                <span
                    @click="eSong.structure.push('')"
                    class="material-symbols-rounded"
                >
                    +
                </span>
            </div>
            <div class="content">
                <Dropdown
                    v-for="(_, index) in eSong.structure"
                    v-model="eSong.structure[index]"
                    @update:model-value="
                        (x) => {
                            if (x === '(none)')
                                eSong.structure.splice(index, 1);
                        }
                    "
                    :options="[
                        ...eSong.sections.map((x) => String(x.type)),
                        '(none)'
                    ]"
                    label="section"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.configuration {
    max-height: 100vh;
    overflow: auto;
}

.material-symbols-rounded {
    cursor: pointer;
}

.configuration,
.group .content {
    padding: 1em;
    display: flex;
    flex-direction: row;
    gap: 1em;
    flex-wrap: wrap;
}

h2 {
    margin: 0;
    margin-bottom: 0.5em;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.flex {
    display: flex;
    flex-direction: row;

    &.end {
        justify-content: flex-end;
    }
}

.group {
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    background: var(--color-background-soft);
    padding: 0.5em;
}
</style>
