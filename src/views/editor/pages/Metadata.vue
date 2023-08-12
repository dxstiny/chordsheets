<script lang="ts" setup>
import NumberInput from "@/components/NumberInput.vue";
import TextInput from "@/components/TextInput.vue";
import { INSTRUMENT_TYPES, type ISong, type IInstrument } from "@/types";
import { watch, ref, type PropType } from "vue";
import { useSongStore } from "@/stores/songs";
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
</template>
