<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import { useSongStore } from "@/stores/songs";
import AllPages from "./editor/AllPages.vue";
import { ref, watch, watchEffect } from "vue";
import { jsPDF } from "jspdf";
import Dropdown from "@/components/Dropdown.vue";
import TextInput from "@/components/TextInput.vue";
import Import from "@/components/modals/Import.vue";
import draggable from "vuedraggable";
import type { ISong } from "@/types";
import Editor from "./editor2/Editor.vue";
import Switch from "@/components/Switch.vue";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();
const store = useSongStore();
const allPages = ref<InstanceType<typeof Editor>[]>();
const renderDialog = ref<HTMLDialogElement>();
const renderProgress = ref(-1);
const importDialog = ref<typeof Import>();

const exportLib = async () => {
    await store.prepareRender();

    const text = JSON.stringify(store.songs, null, 4);
    const a = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "chordsheets.json";
    a.click();
};

const importLib = () => {
    importDialog.value?.show();
};

const renderAll = async () => {
    renderDialog.value?.showModal();
    let pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    renderProgress.value = 0;

    for (const page of allPages.value ?? []) {
        console.log(page.name());

        await page.renderTo(pdf);
        renderProgress.value++;

        if (page.song !== store.songs[store.songs.length - 1]) {
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
    pdf.save("chordsheets.pdf");
};

const filters = ref({
    artist: "",
    query: ""
});

const filteredSongs = ref<ISong[]>([]);

watchEffect(() => {
    filteredSongs.value = store.songs.filter((song) => {
        if (
            filters.value.artist &&
            filters.value.artist !== "(any)" &&
            !song.artist
                .toLowerCase()
                .includes(filters.value.artist.toLowerCase())
        ) {
            return false;
        }

        const queryCouldMatch = `${song.title} ${song.artist}`.toLowerCase();

        if (
            filters.value.query &&
            !queryCouldMatch.includes(filters.value.query.toLowerCase())
        ) {
            return false;
        }

        return true;
    });
});

const updateOrder = ({
    moved
}: {
    moved: {
        newIndex: number;
        oldIndex: number;
        element: ISong;
    };
}) => {
    const from = store.songs.findIndex((song) => song.id === moved.element.id);
    const prevElement =
        filteredSongs.value[moved.newIndex - (1 % filteredSongs.value.length)];
    const prev = prevElement
        ? store.songs.findIndex((song) => song.id === prevElement.id)
        : -1;
    const to = moved.newIndex > moved.oldIndex ? prev : prev + 1;

    store.moveTo(from, to);
};

const isMobile = window.innerWidth < 800;
</script>
<template>
    <div class="dashboard">
        <div class="wrap">
            <main>
                <h1>Chord<span class="accent">Sheets</span></h1>
                <div class="flex">
                    <IconButton
                        icon="add"
                        label="New Song"
                        @click="$router.push('/editor')"
                        :style="'green'"
                    />
                    <IconButton
                        icon="file_download"
                        label="Save Library"
                        @click="exportLib"
                        :style="'yellow'"
                    />
                    <IconButton
                        icon="file_upload"
                        label="Import"
                        @click="importLib"
                        :style="'yellow'"
                    />
                    <IconButton
                        label="Export all as PDF"
                        icon="picture_as_pdf"
                        @click="exportAll"
                        :style="'blue'"
                    />
                    <IconButton
                        label="Print All"
                        icon="print"
                        @click="printAll"
                        :style="'blue'"
                    />
                </div>
                <hr />
                <div class="filters">
                    <TextInput
                        label="Search"
                        v-model="filters.query"
                        placeholder="Search for a song"
                    />
                    <Dropdown
                        label="Artist"
                        v-model="filters.artist"
                        :options="[
                            '(any)',
                            ...new Set(
                                store.songs.map((song) => song.artist).sort()
                            )
                        ]"
                    />
                </div>
                <hr />
                <draggable
                    v-model="filteredSongs"
                    class="songs"
                    @change="updateOrder"
                    item-key="id"
                    @dragover.stop
                    :disabled="isMobile"
                >
                    <template #item="{ element: song }">
                        <router-link :to="settings.editorUrl(song.id)">
                            <div class="song">
                                <div class="cover">
                                    <img
                                        :src="
                                            song.cover ||
                                            'placeholders/song.svg'
                                        "
                                    />
                                </div>
                                <div class="info">
                                    <h2>{{ song.title }}</h2>
                                    <span>{{ song.artist }}</span>
                                </div>
                                <span class="bpm"> {{ song.bpm }} BPM </span>
                                <span class="key">
                                    {{ song.key }}
                                </span>
                                <span
                                    class="material-symbols-rounded delete"
                                    @click.prevent="store.removeSong(song)"
                                >
                                    delete
                                </span>
                            </div>
                        </router-link>
                    </template>
                </draggable>
            </main>
            <aside class="card sticky learn">
                <div class="content">
                    <h2>Learn Music Theory</h2>
                    <IconButton
                        label="Try the Beta"
                        icon="arrow_forward"
                        @click="$router.push('/learn')"
                        :style="'blue'"
                    />
                    <hr />
                    <h2>Try the new editor!</h2>
                    <p>
                        The new editor will let you edit your songs directly
                        in-place. No more switching between editor and preview.
                        It also introduces new shortcuts to improve your
                        workflow.
                    </p>
                    <Switch
                        class="try-new-editor"
                        v-model="settings.newEditor"
                        label="Try the new editor"
                    />
                </div>
            </aside>
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
                Please wait while we render your chord sheets. This may take a
                while.
            </p>
            <div class="row">
                <progress
                    :value="renderProgress"
                    :max="allPages?.length"
                />
                <p>
                    <span>{{ renderProgress }}</span> / {{ allPages?.length }}
                </p>
            </div>
        </div>
    </dialog>
    <Import ref="importDialog" />
    <div class="void">
        <div class="parent">
            <Editor
                ref="allPages"
                v-for="song in store.songs"
                printing
                :song="song"
            />
        </div>
    </div>
</template>

<style scoped>
.learn a h2 {
    cursor: pointer;
    color: var(--color-heading);
    transition: all 0.2s ease-in-out;

    &:hover {
        text-decoration: underline;
        color: var(--accent);
    }
}

.try-new-editor {
    margin-top: 1em;
}

progress {
    width: 100%;
    height: 1rem;
    border: none;
    border-radius: 0.5rem;
    appearance: none;

    &::-webkit-progress-bar {
        border-radius: 0.5rem;
        background-color: var(--color-background);
    }

    &::-webkit-progress-value {
        border-radius: 0.5rem;
        background-color: var(--accent);
    }
}

.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;

    & button {
        flex: 1;
    }
}

dialog {
    color: var(--color-text);
    gap: 1em;
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 1em;
    padding: 1em;
    outline: none;

    inset: 0;
    margin: auto;
    position: fixed;

    &::backdrop {
        background: rgba(0, 0, 0, 0.5);
    }

    .content {
        .preview-container {
            position: relative;
            height: 25vh;
            width: 100%;
            margin-bottom: 1em;
        }

        .preview.scale-sm {
            position: absolute;
            margin: auto;
            overflow: auto;
            justify-self: center;
            align-self: center;
            max-height: 50vh;
            scale: 0.5;
            transform-origin: top;
        }

        .row {
            display: grid;
            grid-template-columns: 1fr max-content;
            align-items: center;
            gap: 1em;
        }
    }
}

.filters {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
}

.card {
    color: var(--color-text);
    display: flex;
    gap: 1em;
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 1em;
    padding: 1em;

    &.min-h-screen {
        min-height: calc(100vh - 2em);
        min-height: calc(100svh - 2em);
    }

    &.learn {
        @media (max-width: 800px) {
            min-height: 0;
        }
    }

    &.sticky {
        position: sticky;
        top: 1em;
    }
}

.song {
    display: grid;
    grid-template-columns: max-content 1fr 100px 30px max-content;
    align-items: center;
    gap: 1em;
    color: var(--color-text);
    border-radius: 1em;
    padding: 0.5em 1em;
    border: 1px solid transparent;

    @media screen and (max-width: 400px) {
        grid-template-columns: max-content 1fr max-content;
        font-size: 0.8em;

        .bpm,
        .key {
            display: none;
        }
    }

    & span {
        text-align: center;
    }

    .delete {
        padding-left: 1em;
    }

    &:hover {
        background: var(--color-background-soft);
        border: 1px solid var(--color-border);
    }
    .material-symbols-rounded {
        font-size: 1.5rem;
        cursor: pointer;

        &:hover {
            color: var(--color-heading);
        }
    }

    .cover {
        overflow: hidden;
        display: flex;
        align-items: center;

        & img {
            width: 50px;
            aspect-ratio: 1/1;
            border-radius: 0.5em;

            @media screen and (max-width: 400px) {
                width: 30px;
            }
        }
    }
}

.dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;

    .wrap {
        display: grid;
        grid-template-columns: 1fr 300px;
        position: relative;
        gap: 1em;
        min-width: 100%;
        align-items: start;

        @media (max-width: 800px) {
            grid-template-columns: 1fr;
        }

        @media (min-width: 1400px) {
            max-width: 1400px;
            min-width: 1400px;
        }
    }
}

hr {
    margin: 1em 0;
    border: none;
    border-bottom: 1px solid var(--color-border);
}

h1 {
    margin: 0.25em 0 1em;
}

h2 {
    font-size: 1.25em;
    font-weight: 500;
}

h1 .accent {
    color: var(--accent);
    font-weight: 900;
}

.parent {
    position: absolute;
    top: 0;
    left: 0;

    & > * {
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
