<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import { useSongStore } from "@/stores/songs";
import AllPages from "./editor/AllPages.vue";
import { ref, watch, watchEffect } from "vue";
import { jsPDF } from "jspdf";
import Dropdown from "@/components/Dropdown.vue";
import TextInput from "@/components/TextInput.vue";
import draggable from "vuedraggable";
import type { ISong } from "@/types";

const store = useSongStore();
const allPages = ref<InstanceType<typeof AllPages>[]>();

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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const songs = JSON.parse(text);
            store.songs = songs;
        };
        reader.readAsText(file);
    };
    input.click();
};

const renderAll = async () => {
    let pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    for (const page of allPages.value ?? []) {
        await page.renderTo(pdf);

        if (page.song !== store.songs[store.songs.length - 1]) {
            pdf.addPage();
        }
    }

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
                        label="Import Library"
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
                            ...new Set(store.songs.map((song) => song.artist))
                        ]"
                    />
                </div>
                <hr />
                <draggable
                    v-model="filteredSongs"
                    class="songs"
                    @change="updateOrder"
                    item-key="id"
                >
                    <template #item="{ element: song }">
                        <router-link :to="`/editor/${song.id}`">
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
            <aside class="card min-h-screen sticky learn">
                <div class="content">
                    <router-link to="/learn">
                        <h2>Learn Music Theory</h2>
                    </router-link>
                    <p>Coming soon...</p>
                </div>
            </aside>
        </div>
    </div>
    <div class="void">
        <div class="parent">
            <AllPages
                ref="allPages"
                v-for="song in store.songs"
                :song="song"
            />
        </div>
    </div>
</template>

<style scoped>
.learn p {
    color: var(--color-text-mute);
}

.learn a h2 {
    cursor: pointer;
    color: var(--color-heading);
    transition: all 0.2s ease-in-out;

    &:hover {
        text-decoration: underline;
        color: var(--accent);
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
</style>
