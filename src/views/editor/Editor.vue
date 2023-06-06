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
import draggable from "vuedraggable";

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
            <h2>Structure</h2>
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
            <IconButton
                @click="eSong.structure.push('')"
                icon="add"
                label="add section"
            />
        </div>
        <div class="group">
            <div class="flex space-between">
                <h2>Instruments</h2>
                <span
                    class="material-symbols-rounded"
                    @click="expanded.instruments = !expanded.instruments"
                >
                    {{ expanded.instruments ? "expand_less" : "expand_more" }}
                </span>
            </div>
            <template v-if="expanded.instruments">
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
            </template>
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
                                >
                                    <template #item="{ element: chord }">
                                        <div
                                            class="group chord"
                                            @click="chord.selected = true"
                                            :id="
                                                eSong.sections.indexOf(
                                                    element
                                                ) +
                                                '.' +
                                                element.progression.indexOf(
                                                    chord
                                                )
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
                                    </template>
                                </draggable>
                            </div>
                            <IconButton
                                @click="
                                    element.progression.push({
                                        chord: 'C',
                                        duration: 4
                                    })
                                "
                                icon="add"
                                label="add chord"
                            />
                        </div>
                    </template>
                </draggable>
                <IconButton
                    @click="
                        eSong.sections.push({ type: 'chorus', progression: [] })
                    "
                    icon="add"
                    label="add section"
                />
            </template>
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
    align-items: flex-start;
    gap: 1em;

    &.end {
        justify-content: flex-end;
    }

    &.space-between {
        justify-content: space-between;
    }
}

.group {
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    background: var(--color-background-soft);
    padding: 0.5em;
}
</style>
