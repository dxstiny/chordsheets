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
import Song from "@/components/Song.vue";
import { useSetlistStore } from "@/stores/setlists";

const settings = useSettingsStore();
const store = useSongStore();
const songHistory = useHistoryStore();
const setlistStore = useSetlistStore();
const router = useRouter();
const allPages = ref<InstanceType<typeof Editor>[]>();
const renderDialog = ref<HTMLDialogElement>();
const renderProgress = ref(-1);

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
        console.log(page.name());

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
    pdf.save("chordsheets.pdf");
};

const newSong = () => {
    const song = store.createNew();
    router.push(settings.editorUrl(song.id));
};

const newSetlist = () => {
    const { id } = setlistStore.addEmptySetlist();
    router.push("/setlists/edit/" + id);
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

    return favArtistsSorted?.[0]?.[0];
});

const recentlyEdited = computed(() => {
    return songHistory.history
        .map((song) => store.song(song.songId))
        .filter((song) => song !== undefined)
        .slice(0, 3);
});
</script>
<template>
    <div class="grid">
        <div class="container column w-2 h-2">
            <p class="muted row gap-2">
                <span class="material-symbols-rounded">history</span>
                Recently edited
            </p>

            <Song
                v-for="song in recentlyEdited"
                :song="song"
            />
        </div>
        <RouterLink to="/browse">
            <div class="container column clickable">
                <p class="muted row gap-2">
                    <span class="material-symbols-rounded">library_music</span>
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
        <RouterLink to="/setlists">
            <div class="container column clickable">
                <p class="muted row gap-2">
                    <span class="material-symbols-rounded">list</span>
                    Library
                </p>
                <h1 class="wght-900">
                    {{ setlistStore.setlists.length }}
                </h1>
                <div class="row space-between gap-2 centre">
                    <p class="muted row gap-2">Sets</p>
                    <IconButton
                        icon="add"
                        @click.prevent="newSetlist"
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
