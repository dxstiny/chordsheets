<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import { useSongStore } from "@/stores/songs";
import AllPages from "./editor/AllPages.vue";
import { ref, computed } from "vue";
import { jsPDF } from "jspdf";
import Dropdown from "@/components/Dropdown.vue";
import TextInput from "@/components/TextInput.vue";
import { type ISong } from "@/types";

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

const filteredSongs = computed(() => {
    return store.songs.filter((song) => {
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
</script>
<template>
    <div class="dashboard">
        <div class="wrap">
            <h1>Chord<span class="accent">Sheets</span></h1>

            <hr />
            <div class="flex">
                <IconButton
                    icon="add"
                    label="New Song"
                    @click="$router.push('/editor')"
                />
                <IconButton
                    icon="file_download"
                    label="Save Library"
                    @click="exportLib"
                />
                <IconButton
                    icon="file_upload"
                    label="Import Library"
                    @click="importLib"
                />
                <IconButton
                    label="Export all as PDF"
                    icon="picture_as_pdf"
                    @click="exportAll"
                />
                <IconButton
                    label="Print All"
                    icon="print"
                    @click="printAll"
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
            <div class="songs">
                <router-link
                    :to="`/editor?s=${index}`"
                    v-for="(song, index) in filteredSongs"
                >
                    <div class="song">
                        <div class="header">
                            <div class="info">
                                <h2>{{ song.title }}</h2>
                                <span>{{ song.artist }}</span>
                            </div>
                            <span
                                class="material-symbols-rounded"
                                @click.prevent="store.removeSong(song)"
                            >
                                delete
                            </span>
                        </div>
                    </div>
                </router-link>
            </div>
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
.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
}

.filters {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
}

.songs {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
}

.song {
    color: var(--color-text);
    display: flex;
    gap: 1em;
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 1em;
    padding: 1em;

    &:hover {
        background: var(--color-background);
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 3em;
    }

    .material-symbols-rounded {
        font-size: 1.5rem;
        cursor: pointer;

        &:hover {
            color: var(--color-heading);
        }
    }
}

.dashboard {
    padding: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .wrap {
        min-width: 100%;

        @media (min-width: 1200px) {
            max-width: 1200px;
            min-width: 1200px;
        }
    }
}

hr {
    margin: 1em 0;
    border: none;
    border-bottom: 1px solid var(--color-border);
}

h1 .accent {
    color: var(--accent);
}
</style>
