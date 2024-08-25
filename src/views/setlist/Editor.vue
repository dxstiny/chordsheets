<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { jsPDF } from "jspdf";
import draggable from "vuedraggable";
import { useSongStore } from "@/stores/songs";
import Editor from "../editor2/Editor.vue";
import Song from "@/components/Song.vue";
import type { ISetlist, ISong } from "@/types";
import EditableText from "@/components/EditableText.vue";
import { isMobile } from "@/helper";
import SongSearcher from "@/components/SongSearcher.vue";
import IconButton from "@/components/IconButton.vue";
import { useSetlistStore } from "@/stores/setlists";
import { useRoute, useRouter } from "vue-router";

const store = useSongStore();
const setlistStore = useSetlistStore();
const route = useRoute();
const router = useRouter();
const allPages = ref<InstanceType<typeof Editor>[]>();
const renderDialog = ref<HTMLDialogElement>();
const renderProgress = ref(-1);

if (route.params.id === "new") {
    const { id } = setlistStore.addEmptySetlist();
    router.push({
        path: `/setlist/${id}`,
        replace: true
    });
}

const renderAll = async () => {
    renderDialog.value?.showModal();
    let pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    renderProgress.value = 0;

    const pages = allPages.value ?? [];

    for (const [index, page] of pages.entries()) {
        await page.renderTo(pdf);
        renderProgress.value++;

        if (index < pages.length - 1) {
            pdf.addPage();
        }
    }

    renderDialog.value?.close();
    renderProgress.value = -1;

    return pdf;
};

const printAll = async () => {
    const pdf = await renderAll();
    pdf.autoPrint();
    pdf.output("dataurlnewwindow");
};

const exportAll = async () => {
    const pdf = await renderAll();
    pdf.save(setlist.value.name + ".pdf");
};

const saveAll = async () => {
    const sections = setlist.value.sections.map((section) => ({
        type: "setlist",
        ...section,
        songs: section.songs.map((song) => getSong(song))
    }));
    const setlistForExport = { ...setlist.value, sections };

    const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(setlistForExport));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
        "download",
        `${setlist.value.name}.chordsheets.json`
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

const setlist = ref(
    setlistStore.setlist(Number(route.params.id)) ||
        ({ id: -1, name: "", sections: [] } as ISetlist)
);

const pageCounts = ref<number[][]>(
    setlist.value.sections.map((section) => section.songs.map(() => 1))
);

const addSection = () => {
    pageCounts.value.push([]);
    setlist.value.sections.push({
        id: new Date().getTime(),
        name: "Section " + (setlist.value.sections.length + 1),
        songs: []
    });
};

const addingSongToSection = ref<number | null>(null);

const getSong = (song: { id: number } | ISong) => {
    if ("title" in song) {
        return song;
    }
    return store.songs.find((s) => s.id === song.id) as ISong;
};

const onClick = (e: MouseEvent) => {
    addingSongToSection.value = null;
};

const duplicatesInSection = (section: { songs: { id: number }[] }) => {
    // returns all duplicates as ISong[]

    const duplicates: ISong[] = [];
    const ids = new Set<number>();

    section.songs.forEach((song) => {
        if (ids.has(song.id)) {
            duplicates.push(getSong(song));
        } else {
            ids.add(song.id);
        }
    });

    return duplicates;
};

const pagesInSection = (sectionIndex: number) => {
    // returns the number of pages in a section
    return setlist.value.sections[sectionIndex].songs
        .map((_, i) => pageCounts.value[sectionIndex]?.[i] ?? 0)
        .reduce((a, b) => a + b, 0);
};

const estimatedDuration = (section: { songs: { id: number }[] }) => {
    // returns the estimated duration of a section in minutes
    const inMinutes = section.songs.reduce((acc, song) => acc + 3, 0);
    const inHours = Math.floor(inMinutes / 60);
    if (inHours === 0) {
        return `${inMinutes}m`;
    }

    return `${inHours}h ${inMinutes % 60}m`;
};

const hasAnySong = computed(() =>
    setlist.value.sections.some((section) => section.songs.length)
);

onBeforeMount(() => {
    if (setlist.value.id === -1) {
        router.push("/");
    }
});

const onKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveAll();
    } else if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        exportAll();
    } else if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        e.stopImmediatePropagation();
        printAll();
    }
};

onMounted(() => {
    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
    <div class="browser">
        <div
            class="editor"
            @dragstart.stop
            @dragover.stop
        >
            <h1 class="page-title">
                <router-link
                    class="link-on-hover"
                    to="/setlists"
                >
                    Setlists
                </router-link>
                /
                <EditableText
                    v-model="setlist.name"
                    placeholder="Setlist name"
                >
                    {{ setlist.name }}
                </EditableText>
            </h1>
            <div class="items">
                <div
                    class="container"
                    v-for="(section, sectionIndex) in setlist.sections"
                >
                    <h2>
                        <EditableText
                            class="section-name"
                            v-model="section.name"
                            placeholder="Section name"
                        >
                            {{ section.name }}
                        </EditableText>
                    </h2>
                    <div class="section-checks">
                        <div
                            v-if="duplicatesInSection(section).length"
                            class="duplicates"
                            :title="`Duplicates: ${duplicatesInSection(section)
                                .map((s) => s.title)
                                .join(', ')}`"
                        >
                            <span class="material-symbols-rounded">
                                warning
                            </span>
                            {{ duplicatesInSection(section).length }} Duplicates
                        </div>
                        <div>
                            <span class="material-symbols-rounded">
                                music_note
                            </span>
                            {{ section.songs.length }} Songs
                        </div>
                        <div title="Pages">
                            <span class="material-symbols-rounded"> book </span>
                            {{ pagesInSection(sectionIndex) }} Pages
                        </div>
                        <div
                            class="duration"
                            title="Estimated duration (1 song = 3 minutes)"
                        >
                            <span class="material-symbols-rounded">
                                schedule
                            </span>
                            about {{ estimatedDuration(section) }}
                        </div>
                        <div
                            title="Delete Section"
                            class="delete-section"
                            @click="setlist.sections.splice(sectionIndex, 1)"
                        >
                            <span class="material-symbols-rounded">
                                delete
                            </span>
                            Delete Section
                        </div>
                    </div>
                    <draggable
                        v-model="section.songs"
                        class="songs"
                        item-key="id"
                        @dragover.stop
                        group="songs"
                        :disabled="isMobile()"
                    >
                        <template #item="{ element: song }">
                            <Song
                                :key="song.id"
                                :song="getSong(song)"
                                allow-delete
                                @delete="
                                    section.songs.splice(
                                        section.songs.indexOf(song),
                                        1
                                    )
                                "
                            />
                        </template>
                    </draggable>
                    <div
                        class="info add-song"
                        @click.stop="addingSongToSection = sectionIndex"
                    >
                        <template v-if="addingSongToSection === sectionIndex">
                            <SongSearcher
                                @click.stop
                                @select="(song) => section.songs.push(song)"
                            />
                        </template>
                        <template v-else>
                            <span class="material-symbols-rounded"> add </span>
                            Add Song
                        </template>
                    </div>
                </div>
                <div
                    class="info add-song"
                    @click="addSection"
                >
                    <span class="material-symbols-rounded"> add </span>
                    Add Section
                </div>
            </div>
        </div>

        <div
            class="preview"
            v-if="hasAnySong"
        >
            <div class="toolbar">
                <span
                    class="material-symbols-rounded"
                    @click="printAll"
                    title="Print (Ctrl+P)"
                >
                    print
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="exportAll"
                    title="Download as PDF (CTRL+SHIFT+S)"
                >
                    picture_as_pdf
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="saveAll"
                    title="Download as JSON (CTRL+S)"
                >
                    file_download
                </span>
            </div>
            <div class="content">
                <template v-for="(section, sectionIndex) in setlist.sections">
                    <hr v-if="sectionIndex > 0" />
                    <h2>{{ section.name }}</h2>
                    <Editor
                        ref="allPages"
                        v-for="(song, i) in section.songs"
                        printing
                        :song="getSong(song)"
                        @on-page-count="pageCounts[sectionIndex][i] = $event"
                        :page-offset="
                            pageCounts[sectionIndex]
                                .slice(0, i)
                                .reduce((a, b) => a + b, 0)
                        "
                        :section-name="section.name"
                        disable-hotkeys
                    />
                </template>
            </div>
        </div>

        <dialog ref="renderDialog">
            <div class="content">
                <div class="preview-container">
                    <div class="preview scale-sm">
                        <Editor
                            printing
                            v-if="renderProgress >= 0"
                            :song="store.songs[renderProgress]"
                        />
                    </div>
                </div>
                <h2>Rendering...</h2>
                <p>
                    Please wait while we render your chord sheets. This may take
                    a while.
                </p>
                <div class="row">
                    <progress
                        :value="renderProgress"
                        :max="allPages?.length"
                    />
                    <p>
                        <span>{{ renderProgress }}</span> /
                        {{ allPages?.length }}
                    </p>
                </div>
            </div>
        </dialog>
    </div>
</template>

<style scoped>
.page-title {
    margin-bottom: 1em;
    gap: 0.5em;
    display: flex;
    align-items: center;

    .editable-text {
        text-align: left;
        margin: 0;
    }
}

.editable-text.section-name {
    text-align: left;
}

.browser {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
    height: 100%;
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
}

.section-checks {
    display: flex;
    margin-bottom: 1em;
    font-size: 0.9rem;
    color: var(--color-text-mute);
    width: 100%;

    & div {
        display: flex;
        gap: 0.25em;
        align-items: center;
        padding: 0 0.5em;

        &:not(:first-child)::before {
            content: " ";
            display: block;
            width: 1px;
            height: 1em;
            background: var(--color-border);
            margin-right: 0.5em;
        }

        & span.material-symbols-rounded {
            font-size: 1em;
        }

        &.duplicates {
            color: var(--color-yellow);
        }

        &.delete-section {
            justify-self: flex-end;
            margin-left: auto;

            &:hover {
                color: var(--color-red);
                cursor: pointer;
            }

            &::before {
                content: unset;
            }
        }
    }
}

.add-song {
    display: flex;
    cursor: pointer;
    align-items: center;
    position: relative;
    gap: 0.5em;
    width: 100%;
    color: var(--accent);
    border-radius: 4px;
    overflow: clip;
    margin-top: 1em;
    padding: 1em;

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
    flex: 3;
    height: 100%;
    overflow: auto;
    padding: 1em;

    .items {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
}

.browser > .preview {
    flex: 2;
    overflow: auto;
    max-width: max-content;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: auto;

    .content {
        padding: 1em;
        padding-top: 6em;
        height: 100%;
        width: 100%;
        overflow: auto;
    }
}

.toolbar {
    display: flex;
    gap: 1em;
    justify-content: center;
    align-items: center;
    padding: 1em;
    background: var(--color-background);
    border-radius: 0.5em;
    border: 1px solid var(--color-border);
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 1em;
    z-index: 1;

    & span {
        cursor: pointer;

        &:hover {
            color: var(--color-accent);
        }
    }
}
</style>
