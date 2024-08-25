<script lang="ts" setup>
import draggable from "vuedraggable";
import type { ISong, IChord } from "@/types";
import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch,
    type PropType
} from "vue";
import EditableText from "@/components/EditableText.vue";
import EditableNumber from "@/components/EditableNumber.vue";
import type { ISection } from "@/types";
import { useSongStore } from "@/stores/songs";
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import domToImage from "dom-to-image";
import { isMobile } from "@/helper";

const props = defineProps({
    song: {
        type: Object as PropType<ISong>,
        required: true
    },
    printing: {
        type: Boolean,
        default: false
    },
    pageOffset: {
        type: Number,
        default: 0
    },
    sectionName: {
        type: String,
        required: false
    },
    disableHotkeys: {
        type: Boolean,
        default: false
    }
});

const store = useSongStore();
const resizing = ref(false);
const printing = ref(props.printing);
const parent = ref<HTMLElement>();

const insertChord = (sectionIndex: number, chordIndex: number) => {
    const section = props.song.sections[sectionIndex];
    const chord = section.progression[chordIndex];
    const newChord: IChord = { chord: chord.chord, duration: chord.duration };
    props.song.sections[sectionIndex].progression.splice(
        chordIndex + 1,
        0,
        newChord
    );
};

const onKeyDown = (e: KeyboardEvent) => {
    if (props.disableHotkeys) return;

    if (e.key === "Delete") {
        for (const section of props.song.sections) {
            section.progression = section.progression.filter(
                (chord) => !chord.selected
            );
        }
    }
    // ctrl+d or ctrl+b
    if (e.ctrlKey && (e.key === "d" || e.key === "b")) {
        e.preventDefault();
        for (const section of props.song.sections) {
            const selectedChords = section.progression.filter(
                (chord) => chord.selected
            );
            // insert all selected chords after the last selected chord
            section.progression.splice(
                section.progression.indexOf(
                    selectedChords[selectedChords.length - 1]
                ) + 1,
                0,
                ...selectedChords.map((chord) => ({
                    chord: chord.chord,
                    duration: chord.duration,
                    selected: true
                }))
            );
            selectedChords.forEach((chord) => (chord.selected = false));
        }
    }
    // ctrl+p
    if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        print();
    }
};

// onClick:
// if we press the chord, selection will be toggled
// if we press the right border, we will try to resize it using mouse move
const onMouseDown = (chord: IChord, e: MouseEvent) => {
    if (e.button === 2 || isMobile()) {
        return;
    }

    const target = e.target as HTMLElement;

    if (e.offsetX > target.clientWidth - 10) {
        e.preventDefault();
        e.stopImmediatePropagation();

        resizing.value = true;
        const avgWidth = target.getBoundingClientRect().width / chord.duration;
        let durationChange = 0;

        const onMouseMove = (e: MouseEvent) => {
            // if we're more than 1/2 of the width of the chord, we will increase the duration
            // if we're less than 1/2 of the width of the chord, we will decrease the duration

            const diff = e.clientX - target.getBoundingClientRect().left;
            durationChange = Math.round(diff / avgWidth);
            chord.duration = Math.max(1, Math.min(16, durationChange));
        };

        const onMouseUp = (e: MouseEvent) => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            resizing.value = false;
            e.stopImmediatePropagation();
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }
};

const onMouseUp = (chord: IChord, e: MouseEvent) => {
    let before = chord.selected;
    if (!e.shiftKey) {
        for (const section of props.song.sections) {
            for (const c of section.progression) {
                c.selected = false;
            }
        }
    }
    chord.selected = !before;
};

const deleteProgression = (index: number) => {
    props.song.sections.splice(index, 1);
};

const duplicateProgression = (index: number) => {
    const element = props.song.sections[index];
    const newElement: ISection = {
        type: element.type,
        progression: element.progression.map((chord) => ({
            chord: chord.chord,
            duration: chord.duration
        })),
        page: 0
    };
    props.song.sections.splice(index + 1, 0, newElement);
};

const renderTo = async (pdf: jsPDF) => {
    const elements = parent.value!.querySelectorAll(
        ".editor"
    ) as NodeListOf<HTMLElement>;
    let el = elements[0];

    const ratio = el.clientHeight / el.clientWidth;

    for (let i = 0; i < elements.length; i++) {
        el = elements[i];
        if (!el) continue;

        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();

        const scale = 2;
        const dataUrl = await domToImage.toJpeg(el, {
            height: el.clientHeight * scale,
            width: el.clientWidth * scale,
            style: {
                transform: `scale(${scale}) translate(${
                    el.clientWidth / 2 / scale
                }px, ${el.clientHeight / 2 / scale}px)`
            }
        });

        height = ratio * width;
        pdf.addImage(dataUrl, "JPG", 0, 0, width, height);

        if (i + 1 < elements.length) {
            pdf.addPage();
        }
    }
    return pdf;
};

let waitForRenderResolver: () => void;

const render = async () => {
    printing.value = true;

    if (props.song.sections.length && !props.printing) {
        const renderPromise = new Promise<void>((resolve) => {
            waitForRenderResolver = resolve;
        });
        await renderPromise;
    }

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    await renderTo(pdf);

    printing.value = props.printing;

    return pdf;
};

const print = async () => {
    await store.prepareRender();
    const pdf = await render();
    if (!pdf) return;
    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");
};

onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
    updatePages();
});

onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
});

// this will store the start/end section indices per page
interface IPage {
    start: number;
    end: number;
}

const pages = ref<IPage[]>([]);

const updatePages = () => {
    if (props.song.sections.length == 0) {
        pages.value = [
            {
                start: 0,
                end: 0
            }
        ];
        emit("onPageCount", 1);
        return;
    }

    if (!printing.value || pages.value.length == 0) {
        pages.value = [
            {
                start: 0,
                end: props.song.sections.length
            }
        ];

        if (printing.value && props.song.sections.length > 0) {
            nextTick(updatePages);
        }

        emit("onPageCount", 1);
        return;
    }

    const sectionElements = parent.value!.querySelectorAll(
        ".section"
    ) as NodeListOf<HTMLElement>;

    if (sectionElements.length == 0) return;

    const sectionParent = sectionElements[0].parentElement as HTMLElement;

    const computedParent = getComputedStyle(sectionParent);
    const bottomMinusPadding =
        sectionParent.clientHeight - parseFloat(computedParent.paddingBottom);

    // find first section that is overflowing its parent
    for (let i = 0; i < sectionElements.length; i++) {
        const section = sectionElements[i];
        const elementBottom = section.offsetTop + section.offsetHeight;

        if (elementBottom > bottomMinusPadding) {
            pages.value[pages.value.length - 1].end = i;
            pages.value.push({
                start: i,
                end: props.song.sections.length
            });
            nextTick(updatePages);
            return;
        }
    }

    emit("onPageCount", pages.value.length);
    waitForRenderResolver?.();
};

watch(() => props.song, updatePages, { deep: true });
watch(printing, () => nextTick(updatePages));
watch(
    () => props.printing,
    () => {
        printing.value = props.printing;
    }
);

defineExpose({
    renderTo,
    render,
    name: () => props.song.title
});

const emit = defineEmits(["onPageCount"]);
</script>
<template>
    <div
        ref="parent"
        class="pageWrapper"
    >
        <div
            class="editor"
            :class="{ resizing, print: printing }"
            @dragover.prevent
            v-for="(section, index) in pages"
        >
            <template v-if="index == 0">
                <div class="editor__header">
                    <EditableText
                        :locked="printing"
                        v-model="song.artist"
                        class="left"
                        placeholder="Click to edit artist name"
                        no-outline
                    >
                        <h3>{{ song.artist }}</h3>
                    </EditableText>
                    <EditableText
                        :locked="printing"
                        v-model="song.title"
                        class="left h1"
                        placeholder="Click to edit song title"
                        no-outline
                    >
                        <h1>{{ song.title }}</h1>
                    </EditableText>
                </div>
                <div class="wrap-to-line">
                    <div class="info">
                        <span class="material-symbols-rounded">music_note</span>
                        <EditableNumber
                            :locked="printing"
                            v-model="song.bpm"
                            class="left short"
                            placeholder="120"
                        >
                            {{ song.bpm }}
                        </EditableNumber>
                        BPM
                    </div>
                    <div class="info">
                        <span class="material-symbols-rounded">piano</span>
                        <EditableText
                            :locked="printing"
                            v-model="song.key"
                            class="left short"
                            placeholder="C"
                        >
                            {{ song.key }}
                        </EditableText>
                    </div>
                    <div class="info">
                        <span class="material-symbols-rounded">
                            {{
                                song.transpose > 0
                                    ? "arrow_upward"
                                    : song.transpose < 0
                                    ? "arrow_downward"
                                    : "drag_handle"
                            }}
                        </span>
                        <EditableNumber
                            :locked="printing"
                            v-model="song.transpose"
                            class="left short"
                            placeholder="0"
                        >
                            {{ song.transpose }}
                        </EditableNumber>
                    </div>
                    <template
                        v-if="song.options"
                        v-for="(name, index) in song.options"
                    >
                        <div class="info">
                            <span class="material-symbols-rounded">
                                check
                            </span>
                            <EditableText
                                :locked="printing"
                                v-model="song.options[index]"
                                class="left"
                                placeholder="Option"
                            >
                                <span class="capitalise">
                                    {{ name }}
                                </span>
                            </EditableText>
                            <span
                                v-if="!printing"
                                @click="song.options!.splice(index, 1)"
                                class="delete material-symbols-rounded"
                            >
                                delete
                            </span>
                        </div>
                    </template>
                    <div
                        class="info add-option"
                        @click="
                            !song.options
                                ? (song.options = ['Sustain'])
                                : song.options.push('Sustain')
                        "
                    >
                        <span class="material-symbols-rounded"> add </span>
                        Add Option
                    </div>
                </div>
                <hr v-if="song.instruments.length" />
                <div class="instruments">
                    <div
                        v-for="(instrument, index) in song.instruments"
                        class="instrument"
                    >
                        <span
                            v-if="!printing"
                            @click="song.instruments.splice(index, 1)"
                            class="delete material-symbols-rounded"
                        >
                            delete
                        </span>
                        <div class="flex space-between">
                            <EditableText
                                :locked="printing"
                                v-model="instrument.for"
                                class="left short"
                                placeholder="Click to edit instrument"
                                no-outline
                            >
                                <span>{{ instrument.for }}</span>
                            </EditableText>
                            <span class="flex gap-2">
                                <span class="material-symbols-rounded">
                                    volume_up
                                </span>
                                <EditableNumber
                                    :locked="printing"
                                    v-model="instrument.volume"
                                    class="left short"
                                    placeholder="100"
                                >
                                    {{ instrument?.volume }}
                                </EditableNumber>
                            </span>
                        </div>
                        <div class="settings">
                            <EditableText
                                :locked="printing"
                                v-model="instrument.name"
                                class="left h3"
                                placeholder="Click to edit instrument name"
                                no-outline
                            >
                                <h3>
                                    {{ instrument.name }}
                                </h3>
                            </EditableText>
                            <span class="muted">
                                <EditableText
                                    :locked="printing"
                                    v-model="instrument.type"
                                    class="left"
                                    placeholder="Click to edit instrument type"
                                    no-outline
                                >
                                    {{ instrument?.type }}
                                </EditableText>
                            </span>
                        </div>
                    </div>
                    <div
                        class="instrument add-option"
                        @click="
                            song.instruments.push({
                                name: 'ConcertGrand',
                                for: 'R1',
                                type: 'Piano',
                                volume: 100
                            })
                        "
                    >
                        <span class="material-symbols-rounded"> add </span>
                        Add Instrument
                    </div>
                </div>
                <hr />
            </template>
            <draggable
                v-if="!printing"
                v-model="song.sections"
                class="editor__content"
                @dragover.stop
                itemKey="id"
                :disabled="isMobile()"
            >
                <template #item="{ element, index }">
                    <div
                        class="section"
                        :id="`section-${index}`"
                    >
                        <EditableText
                            :locked="printing"
                            v-model="element.type"
                            class="left"
                            placeholder="Click to edit section name"
                            no-outline
                        >
                            <span class="name">
                                {{ element.type }}
                            </span>
                        </EditableText>
                        <div
                            class="buttons"
                            v-if="!printing"
                        >
                            <span
                                class="button material-symbols-rounded"
                                @click="duplicateProgression(index)"
                            >
                                content_copy
                            </span>
                            <span
                                class="button material-symbols-rounded"
                                @click="deleteProgression(index)"
                            >
                                delete
                            </span>
                        </div>
                        <div
                            class="progression"
                            v-if="element.progression.length === 0"
                        >
                            <div
                                class="chord create"
                                :style="{ '--cols': 4 }"
                                @click.stop="
                                    element.progression.push({
                                        chord: 'C',
                                        duration: 4
                                    })
                                "
                            >
                                <span class="material-symbols-rounded">
                                    add
                                </span>
                                Add Chord
                            </div>
                        </div>
                        <draggable
                            v-else
                            v-model="element.progression"
                            class="progression"
                            @dragover.stop
                            itemKey="id"
                            :disabled="isMobile()"
                        >
                            <template
                                #item="{ element: chord, index: chIndex }"
                            >
                                <div
                                    class="chord"
                                    ref="chordElements"
                                    :id="`chord-${index}-${chIndex}`"
                                    @mousedown="onMouseDown(chord, $event)"
                                    @mouseup="onMouseUp(chord, $event)"
                                    @click.stop
                                    :class="chord.selected ? ' selected' : ''"
                                    :style="{ '--cols': chord.duration }"
                                >
                                    <EditableText
                                        :locked="printing"
                                        v-model="chord.chord"
                                        no-outline
                                        placeholder="C"
                                    >
                                        {{ chord.chord }}
                                    </EditableText>
                                    <span
                                        v-if="!printing"
                                        class="insert_chord_here"
                                        @mousedown.stop
                                        @mouseup.stop
                                        @click.stop="
                                            insertChord(index, chIndex)
                                        "
                                    />
                                </div>
                            </template>
                        </draggable>
                    </div>
                </template>
            </draggable>
            <div
                v-else
                v-for="(element, index) in props.song.sections.slice(
                    section.start,
                    section.end
                )"
                class="section printable"
                :id="`section-${index}`"
            >
                <span class="name">
                    {{ element.type }}
                </span>
                <div class="progression">
                    <div
                        v-for="(chord, chIndex) in element.progression"
                        class="chord"
                        ref="chordElements"
                        :id="`chord-${index}-${chIndex}`"
                        :style="{ '--cols': chord.duration }"
                    >
                        {{ chord.chord }}
                    </div>
                </div>
            </div>
            <span
                v-if="printing"
                class="pageNumber"
            >
                {{ index + pageOffset + 1 }}
            </span>
            <span
                v-if="printing && sectionName"
                class="sectionName"
            >
                {{ sectionName }}
            </span>
        </div>
    </div>
</template>

<style scoped>
hr {
    margin: 0.5em var(--display-margin);
    border: none;
    border-top: 1px solid var(--color-border);
}

.pageWrapper {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding-bottom: 1em;
}

.pageNumber,
.sectionName {
    position: absolute;
    bottom: var(--display-margin-min);
    font-size: 0.8em;

    &.pageNumber {
        left: var(--display-margin);
    }

    &.sectionName {
        right: var(--display-margin);
    }
}

.add-option {
    position: relative;
    cursor: pointer;
    color: var(--accent);
    padding: 0 0.5em;
    border-radius: 4px;
    overflow: clip;

    &::before {
        content: " ";
        position: absolute;
        inset: 0;
        background: var(--accent);
        opacity: 0.1;
    }
}

.instruments {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;

    .instrument {
        border: 1px solid var(--color-border);
        border-radius: 0.5em;
        padding: 0.5em;
        position: relative;

        .material-symbols-rounded {
            font-size: 1em;
        }

        &:hover {
            .delete {
                display: block;
            }
        }

        .delete {
            display: none;
            position: absolute;
            right: 0.25em;
            bottom: 0.25em;
            cursor: pointer;
            background: white;
            z-index: 1;
            border: 1px solid var(--color-border);
            border-radius: 0.25em;
            font-size: 1rem;

            &:hover {
                color: var(--accent);
                border-color: var(--accent);
            }
        }

        &.add-option {
            cursor: pointer;
            color: var(--accent);
            border-color: transparent;
            display: flex;
            align-items: center;
            overflow: clip;

            &::before {
                content: " ";
                position: absolute;
                inset: 0;
                background: var(--accent);
                opacity: 0.1;
            }
        }

        & h3 {
            font-weight: 900;
        }

        .muted {
            font-style: italic;
            text-transform: uppercase;
            font-size: 0.8em;
            letter-spacing: 0.1em;
        }

        .flex {
            display: flex;
            flex-direction: row;
            align-items: center;
            text-transform: uppercase;

            &.space-between {
                justify-content: space-between;
            }

            &.gap-2 {
                gap: 0.5em;
            }
        }
    }
}

.wrap-to-line {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .info {
        min-width: 5ch;
        position: relative;

        display: flex;
        align-items: center;
        gap: 0.15em;

        &:hover {
            .delete {
                display: block;
            }
        }

        .delete {
            display: none;
            position: absolute;
            right: 0em;
            top: -0.5em;
            cursor: pointer;
            background: white;
            border: 1px solid var(--color-border);
            border-radius: 0.25em;

            &:hover {
                color: var(--accent);
                border-color: var(--accent);
            }
        }

        .material-symbols-rounded {
            font-size: 1em;
        }

        &:not(:last-child) {
            margin-right: 1em;
            padding-right: 1em;

            &:after {
                content: " ";
                width: 1px;
                height: 100%;
                display: block;
                position: absolute;
                right: 0;
                top: 0;
                background: var(--color-border);
            }
        }

        &.option {
            &.active {
                color: var(--color-primary);
            }
        }
    }
}

.capitalise {
    text-transform: capitalize;
}

.add-section {
    display: flex;
    cursor: pointer;
    align-items: center;
    position: relative;
    gap: 0.5em;
    width: 100%;
    justify-content: center;
    color: var(--accent);
    border-radius: 4px;
    overflow: clip;
    margin-top: 1em;

    &::after {
        content: " ";
        display: block;
        position: absolute;
        inset: 0;
        background: var(--accent);
        opacity: 0.1;
        pointer-events: none;
    }
}

.editor {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    position: relative;

    --color-heading: black;
    color: black;

    --real-height: 297mm;
    --real-width: 210mm;
    --real-margin: 20mm;

    --display-height: 80vh;
    --display-margin: calc(var(--display-height) * (20 / 297));
    --display-margin-min: calc(var(--display-height) * (10 / 297));

    width: calc(var(--display-height) * (210 / 297));
    min-height: var(--display-height);
    height: 100%;

    @media screen and (max-width: 800px) {
        --display-height: 60vh;
    }

    &.print {
        max-height: calc(var(--display-height) - var(--display-margin));
        overflow: clip;
        cursor: default;

        .chord,
        .section {
            cursor: default;
        }

        .add-option,
        .add-section,
        .chord.create {
            display: none;
        }

        &:before {
            display: none;
        }

        &:after {
            display: none;
        }
    }

    /*aspect-ratio: 210 / 297;*/

    padding: var(--display-margin) 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
    background: white;
    position: relative;

    > div:not(.editor__content),
    .editor__content > div {
        padding: 0 var(--display-margin);
    }

    font-size: 12px;

    @media screen and (max-width: 600px) {
        font-size: 10px;
    }

    @media (-webkit-device-pixel-ratio: 1.25) {
        font-size: 10px;
    }

    @media screen and (max-width: 400px) {
        font-size: 8px;
    }

    @media (-webkit-device-pixel-ratio: 1.5) {
        font-size: 8px;
    }

    &.resizing {
        cursor: ew-resize !important;

        div {
            cursor: ew-resize !important;
        }

        .insert_chord_here {
            display: none;
        }
    }

    &:before {
        content: " ";
        border-top: 1px solid violet;
        border-bottom: 1px solid violet;
        position: absolute;
        inset: 0;
        pointer-events: none;
        margin: var(--display-margin) 0;
    }

    &:after {
        content: " ";
        border-left: 1px solid violet;
        border-right: 1px solid violet;
        position: absolute;
        inset: 0;
        pointer-events: none;
        margin: 0 var(--display-margin);
    }
}

.section {
    cursor: pointer;
    position: relative;
    padding-top: 0.25em !important;
    padding-bottom: 0.25em !important;

    .name {
        font-weight: bold;
        text-transform: uppercase;
    }

    &:hover {
        .buttons {
            display: flex;
        }
    }

    .buttons {
        display: none;
        gap: 0.5em;
        position: absolute;
        right: 0.5em;
        top: -0.75em;

        .button {
            cursor: pointer;
            z-index: 1;
            background: white;
            border: 1px solid var(--color-border);
            padding: 0.125em;
            border-radius: 0.25em;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1rem;

            &:hover {
                border-color: var(--accent);
                color: var(--accent);
            }
        }
    }
}

.section:not(.printable):hover::after {
    content: " ";
    display: block;
    position: absolute;
    inset: 0;
    background: var(--accent);
    opacity: 0.1;
    pointer-events: none;
}

.section:not(:first-child) {
    margin-top: 0.5em;
}

.chord {
    position: relative;
    cursor: pointer;

    &.create {
        display: flex;
        align-items: center;
        gap: 0.5em;
        position: relative;
        border-color: transparent;
        color: var(--accent);
        border-radius: 4px;

        &:before {
            content: " ";
            position: absolute;
            inset: 0;
            background: var(--accent);
            opacity: 0.1;
        }

        & span {
            font-size: 1rem;
        }
    }

    &::after {
        content: "";
        position: absolute;
        right: -1px;
        width: 10px;
        top: 0;
        bottom: 0;
        cursor: ew-resize;
    }
}

.insert_chord_here {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -0.75rem;
    width: 1rem;
    opacity: 0;

    &:after {
        content: "+";
        background: var(--accent);
        color: white;
        position: absolute;
        top: -2ch;
        right: 1px;
        height: 2ch;
        width: 2ch;

        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 50%;
    }

    &:before {
        width: 2px;
        background: var(--accent);
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(0.5em + 1px);
    }

    &:hover {
        opacity: 1;
    }
}
</style>
