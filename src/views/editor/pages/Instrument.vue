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
import IconButton from "@/components/IconButton.vue";
import { type IMidiTrack, midiFromFile } from "@/importMidi";

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
                console.log("found");
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
</script>
<template>
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
        <div class="flex space-between">
            <h2>Instruments</h2>
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
        <div class="flex">
            <IconButton
                v-for="slot in ['l', 'r1', 'r2']"
                v-show="!eSong.instruments[slot]"
                @click="addInstrument(slot)"
                icon="add"
                :label="'Add ' + slot"
            />
        </div>
    </div>
</template>
