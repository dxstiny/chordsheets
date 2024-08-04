<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import { useSongStore } from "@/stores/songs";
import { ref, computed } from "vue";
import { jsPDF } from "jspdf";
import Editor from "./editor2/Editor.vue";
import { useSettingsStore } from "@/stores/settings";
import { useHistoryStore } from "@/stores/history";
import type { ISong } from "@/types";
import { useRouter } from "vue-router";

const settings = useSettingsStore();
const store = useSongStore();
const songHistory = useHistoryStore();
const router = useRouter();
const allPages = ref<InstanceType<typeof Editor>[]>();
const renderDialog = ref<HTMLDialogElement>();
const renderProgress = ref(-1);

const exportLib = async () => {
    await store.prepareRender();

    const text = JSON.stringify(store.songs, null, 4);
    const a = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "chordsheets.json";
    a.click();
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

const newSong = () => {
    const song = store.createNew();
    router.push(settings.editorUrl(song.id));
};

const favArtist = computed(() => {
    const favArtists = store.songs.map((song) => song.artist);
    const favArtistsCount = favArtists.reduce((acc, artist) => {
        acc[artist] = (acc[artist] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const favArtistsSorted = Object.entries(favArtistsCount).sort(
        (a, b) => b[1] - a[1]
    );

    return favArtistsSorted[0][0];
});

const recentlyEdited = computed(() => {
    return songHistory.history
        .slice(0, 3)
        .map((song) => store.song(song.songId)) as ISong[];
});
</script>
<template>
    <div class="grid">
        <div class="container column w-2 h-2">
            <p class="muted row gap-2">
                <span class="material-symbols-rounded">history</span>
                Recently edited
            </p>
            <router-link
                :to="settings.editorUrl(song.id)"
                v-for="song in recentlyEdited"
            >
                <div class="song">
                    <div class="cover">
                        <img :src="song.cover || 'placeholders/song.svg'" />
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
        </div>
        <RouterLink to="/browse">
            <div class="container column clickable">
                <p class="muted row gap-2">
                    <span class="material-symbols-rounded">list</span>
                    Library
                </p>
                <h1 class="wght-900">
                    {{ store.songs.length }}
                </h1>
                <div class="row space-between gap-2 centre">
                    <p class="muted row gap-2">Chord Sheets</p>
                    <IconButton
                        icon="add"
                        @click.prevent="newSong"
                        :style="'green'"
                    />
                </div>
            </div>
        </RouterLink>
        <div class="container column gap-2">
            <p class="muted row gap-2">
                <span class="material-symbols-rounded">list</span>
                Library
            </p>
            <div class="row space-between gap-2 centre">
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
        </div>
        <div class="container column gap-2">
            <p class="muted row gap-2">
                <span class="material-symbols-rounded">school</span>
                Learn
            </p>

            <p>How well do you know your scales?</p>

            <IconButton
                label="Start learning"
                icon="arrow_forward"
                @click="$router.push('/learn/scale-quiz')"
                :style="'blue'"
            />
        </div>
        <div class="container column">
            <p class="muted row gap-2">
                <span class="material-symbols-rounded">favorite</span>
                Favourite Artist
            </p>
            <h1 class="wght-900">{{ favArtist }}</h1>
            <p>Most common artist in your library</p>
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

.toolbar {
    background: var(--color-background);
    position: sticky;
    z-index: 1;
    top: -1px;
    padding-top: 1em;
}

.title {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 0.25em 0 1em;

    & img {
        width: 50px;
        aspect-ratio: 1/1;
    }

    & h1 .accent {
        color: var(--accent);
        font-weight: 900;
    }
}

.try-new-editor {
    margin-top: 1em;
}

main {
    grid-column: 1;
}

aside {
    grid-column: 2;
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

.filters {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
}

.card {
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
        margin-top: 1em;
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
    padding: 0 1em;

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

h2 {
    font-size: 1.25em;
    font-weight: 500;
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
