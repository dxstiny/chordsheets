<script lang="ts" setup>
import NumberInput from "@/components/NumberInput.vue";
import TextInput from "@/components/TextInput.vue";
import {
    INSTRUMENT_TYPES,
    SECTION_TYPES,
    type ISong,
    type IInstrument,
    type Chord
} from "@/types";
import { watch, ref, onMounted, type PropType } from "vue";
import Dropdown from "@/components/Dropdown.vue";
import { useSongStore } from "@/stores/songs";
import IconButton from "@/components/IconButton.vue";
import draggable from "vuedraggable";
import { type IMidiTrack, midiFromFile } from "@/importMidi";
import { start, currentChord } from "../../learn/inputListener";

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

const addInstrument = (slot: string) => {
    const slots = ["l", "r1", "r2"];
    if (!slots.includes(slot)) return;
    if (!eSong.value.instruments[slot]) {
        eSong.value.instruments[slot] = {
            type: INSTRUMENT_TYPES[0],
            name: INSTRUMENT_TYPES[0],
            volume: 100,
            page: 1
        } as IInstrument;
        return;
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

const expanded = ref<Record<string, boolean>>({});

window.addEventListener("click", (e) => {
    let target = e.target as HTMLElement | null;
    for (let i = 0; i < 5; i++) {
        if (!target) return;
        if (target.classList.contains("group")) break;
        if (!target.parentElement) break;
        target = target.parentElement;
    }

    if (!target) return;

    const [sectionI, index] = target.id.split(".");

    for (let i = 0; i < eSong.value.sections.length; i++) {
        const section = eSong.value.sections[i];
        for (let j = 0; j < section.progression.length; j++) {
            if (i === Number(sectionI) && j === Number(index)) {
                continue;
            }

            const chord = section.progression[j];
            delete chord.selected;
        }
    }
});

interface IChordClickEvent extends Event {
    detail: {
        sectionIndex: number;
        chordIndex: number;
    };
}
window.addEventListener("chord-click", (e: Event) => {
    const { sectionIndex, chordIndex } = (e as IChordClickEvent).detail;
    const id = `${sectionIndex}.${chordIndex}`;

    const scrollIntoView = () => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };

    if (!expanded.value["sections"]) {
        expanded.value["sections"] = true;
        setTimeout(scrollIntoView, 10);
        return;
    }
    scrollIntoView();
});

const deleteMidi = (index: number) => {
    if (!eSong.value.midi) return;

    eSong.value.midi.splice(index, 1);
};

const uploadMidi = async () => {
    return new Promise<IMidiTrack>((resolve, reject) => {
        const file = document.createElement("input");
        file.type = "file";
        file.accept = ".mid";
        file.onchange = async () => {
            if (!file.files) {
                reject();
                return;
            }
            const midiFile = file.files[0];
            const midiData = await midiFromFile(midiFile);
            if (!midiData) {
                reject();
                return;
            }
            resolve(midiData);
        };
        file.click();
    });
};

const replaceMidi = async (index: number) => {
    const file = await uploadMidi();
    if (!file) return;
    if (!eSong.value.midi) return;
    eSong.value.midi[index] = file;
};

const addMidi = async () => {
    if (!eSong.value.midi) {
        eSong.value.midi = [];
    }
    const file = await uploadMidi();
    if (!file) return;
    eSong.value.midi.push(file);
};

const addChord = (element: ISong["sections"][0]) => {
    const chord = currentChord.value.includes("detected")
        ? eSong.value.key
        : currentChord.value;

    element.progression.push({
        chord: chord as Chord,
        duration: 4,
        id: Math.random().toString(36)
    });
};

onMounted(() => {
    start();
});
</script>
<template>
    <div class="group">
        <h2>Structure</h2>
        <div class="content">
            <Dropdown
                v-for="(_, index) in eSong.structure"
                v-model="eSong.structure[index]"
                @update:model-value="
                    (x) => {
                        if (x === '(none)') eSong.structure.splice(index, 1);
                    }
                "
                :options="[
                    ...eSong.sections.map((x) => String(x.type)),
                    '(none)'
                ]"
                label="section"
            />
        </div>
        <IconButton
            @click="eSong.structure.push('')"
            icon="add"
            label="add section"
        />
    </div>
    <div class="group">
        <div class="flex space-between">
            <h2>Sections</h2>
            <span
                class="material-symbols-rounded"
                @click="expanded.sections = !expanded.sections"
            >
                {{ expanded.sections ? "expand_less" : "expand_more" }}
            </span>
        </div>
        <template v-if="expanded.sections">
            <draggable
                v-model="eSong.sections"
                class="content"
                item-key="id"
                @dragover.stop
            >
                <template #item="{ element }">
                    <div class="group section">
                        <div class="flex space-between">
                            <div class="flex">
                                <Dropdown
                                    v-model="element.type"
                                    :options="SECTION_TYPES"
                                    label="type"
                                />
                                <TextInput
                                    v-model="element.name"
                                    label="name"
                                />
                            </div>
                            <span
                                @click="
                                    eSong.sections.splice(
                                        eSong.sections.indexOf(element),
                                        1
                                    )
                                "
                                class="material-symbols-rounded"
                            >
                                delete
                            </span>
                        </div>
                        <div class="content">
                            <draggable
                                v-model="element.progression"
                                class="content"
                                :item-key="element.id"
                                @dragover.stop
                            >
                                <template #item="{ element: chord }">
                                    <div
                                        class="group chord"
                                        @click="chord.selected = true"
                                        :id="
                                            eSong.sections.indexOf(element) +
                                            '.' +
                                            element.progression.indexOf(chord)
                                        "
                                    >
                                        <div class="flex end">
                                            <span
                                                @click="
                                                    element.progression.splice(
                                                        element.progression.indexOf(
                                                            chord
                                                        ),
                                                        1
                                                    )
                                                "
                                                class="material-symbols-rounded"
                                                >-</span
                                            >
                                        </div>
                                        <div class="content flex-row">
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
                                </template>
                            </draggable>
                        </div>
                        <IconButton
                            @click="addChord(element)"
                            icon="add"
                            label="add chord"
                        />
                    </div>
                </template>
            </draggable>
            <IconButton
                @click="
                    eSong.sections.push({
                        type: 'chorus',
                        progression: [],
                        id: Math.random().toString(36)
                    })
                "
                icon="add"
                label="add section"
            />
        </template>
    </div>
    <div class="group">
        <h2>Melodies</h2>
        <div class="content">
            <div
                class="group"
                v-for="(track, index) in song.midi"
            >
                <TextInput
                    v-model="track.name"
                    label="name"
                />
                <div class="flex">
                    <IconButton
                        @click="deleteMidi(index)"
                        icon="delete"
                        label="delete"
                    />
                    <IconButton
                        @click="replaceMidi(index)"
                        icon="sync"
                        label="replace"
                    />
                </div>
            </div>
        </div>
        <IconButton
            @click="addMidi"
            icon="add"
            label="add"
        />
    </div>
</template>
<style scoped>
.chord .flex-row {
    display: flex;
    flex-direction: row !important;
}
</style>
