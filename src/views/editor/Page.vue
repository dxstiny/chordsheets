<script setup lang="ts">
import MidiPreview from "@/components/MidiPreview.vue";
import type { IMidiTrack } from "@/importMidi";
import type { ISong, PageContent, ISection } from "@/types";
import { type PropType, ref, computed } from "vue";

const props = defineProps({
    currentPage: {
        required: true,
        type: Number
    },
    pages: {
        required: true,
        type: Array as PropType<PageContent[][]>
    },
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
});

const sections = ref<HTMLDivElement[]>([]);
const midiSections = ref<HTMLDivElement[]>([]);
const page = ref<HTMLDivElement>();

const getSections = () => {
    return [...sections.value, ...midiSections.value];
};

const onChordClick = (sectionIndex: number, chordIndex: number) => {
    // window event
    const event = new CustomEvent("chord-click", {
        detail: {
            sectionIndex,
            chordIndex
        }
    });
    window.dispatchEvent(event);
};

defineExpose({
    getSections
});

const formatSectionName = (section: ISection) => {
    let { type, name } = section;
    if (type === "(other)") {
        return name;
    }
    return type + (name ? `: ${name}` : "");
};

const sectionPages = computed(() => {
    return props.pages[props.currentPage]?.filter(
        (x) => (x as ISection | undefined)?.type
    ) as ISection[];
});

const midiPages = computed(() => {
    return props.pages[props.currentPage].filter(
        (x) => (x as IMidiTrack | undefined)?.signature ?? []
    ) as IMidiTrack[];
});
</script>

<template>
    <div
        class="page"
        ref="page"
    >
        <div
            class="meta"
            v-if="currentPage == 0"
        >
            <h2>{{ song.artist }}</h2>
            <h1>{{ song.title }}</h1>
            <div class="wrap-to-line">
                <div class="info">
                    <span class="material-symbols-rounded">music_note</span>
                    {{ song.bpm }} BPM
                </div>
                <div class="info">
                    <span class="material-symbols-rounded">piano</span>
                    {{ song.key }}
                </div>
                <div
                    class="info"
                    v-if="song.transpose"
                >
                    <span class="material-symbols-rounded">{{
                        song.transpose > 0 ? "arrow_upward" : "arrow_downward"
                    }}</span>
                    {{ song.transpose }}
                </div>
                <div
                    class="info"
                    v-if="song.octave"
                >
                    <span class="material-symbols-rounded">{{
                        song.octave > 0 ? "arrow_upward" : "arrow_downward"
                    }}</span>
                    {{ song.octave }} octave
                </div>
                <template v-for="(active, name) in song.options">
                    <div
                        class="info"
                        v-if="active"
                    >
                        <span class="material-symbols-rounded"> check </span>
                        <span class="capitalise">{{ name }}</span>
                    </div>
                </template>
            </div>
            <hr v-if="Object.keys(song.instruments).length" />
            <div class="instruments">
                <div
                    v-for="(instrument, name) in song.instruments"
                    class="instrument"
                >
                    <div class="flex space-between">
                        <span>{{ name }}</span>
                        <span class="flex gap-2">
                            <span class="material-symbols-rounded"
                                >volume_up</span
                            >
                            {{ instrument?.volume }}
                        </span>
                    </div>
                    <div class="settings">
                        <h3>
                            {{ instrument?.name }}
                        </h3>
                        <span class="muted">
                            {{ instrument?.type }}
                            <template v-if="instrument?.page">
                                | P{{ instrument?.page }}
                            </template>
                        </span>
                    </div>
                </div>
            </div>
            <template v-if="song.structure">
                <hr v-if="song.structure.length" />
                <div class="structure">
                    <span v-for="section in song.structure">
                        {{ section }}
                    </span>
                </div>
            </template>
            <hr />
        </div>
        <div
            class="section"
            v-for="(section, index) in sectionPages"
            ref="sections"
            :id="String(index)"
        >
            <span>{{ formatSectionName(section) }}</span>
            <div class="progression">
                <div
                    class="chord"
                    v-for="(chord, chIndex) in section.progression"
                    @click="onChordClick(index, chIndex)"
                    :class="
                        `w-${chord.duration}` +
                        (chord.selected ? ' selected' : '')
                    "
                >
                    {{ chord.chord }}
                </div>
            </div>
        </div>
        <div
            class="section"
            v-if="song.midi"
            v-for="track in midiPages"
            ref="midiSections"
        >
            <span>{{ track?.name }}</span>
            <MidiPreview
                :track="track"
                :width="page?.clientWidth ?? 400"
            />
        </div>
    </div>
</template>

<style scoped>
.structure span:not(:last-child)::after {
    content: " | ";
}

.progression .chord {
    cursor: pointer;

    &:hover {
        color: white;
        background: var(--accent);
    }
}
</style>
