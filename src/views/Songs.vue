<script lang="ts" setup>
import IconButton from "@/components/IconButton.vue";
import { useSongStore } from "@/stores/songs";
import { ref, watchEffect } from "vue";
import Dropdown from "@/components/Dropdown.vue";
import TextInput from "@/components/TextInput.vue";
import draggable from "vuedraggable";
import type { ISong } from "@/types";
import { useSettingsStore } from "@/stores/settings";
import { useRouter } from "vue-router";
import Song from "@/components/Song.vue";

const settings = useSettingsStore();
const store = useSongStore();
const router = useRouter();

const newSong = () => {
    const song = store.createNew();
    song.title = filters.value.query;
    router.push(settings.editorUrl(song.id));
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
    <div class="toolbar">
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
                    ...new Set(store.songs.map((song) => song.artist).sort())
                ]"
            />
        </div>
    </div>
    <div
        class="songs"
        v-if="!filteredSongs.length"
    >
        <p class="muted">
            No songs found. Do you want to add it?
            <IconButton
                icon="add"
                label="Add a new song"
                @click="newSong"
            />
        </p>
    </div>
    <draggable
        v-else
        v-model="filteredSongs"
        class="songs"
        @change="updateOrder"
        item-key="id"
        @dragover.stop
        :disabled="isMobile"
    >
        <template #item="{ element: song }">
            <router-link :to="settings.editorUrl(song.id)">
                <Song
                    :song="song"
                    allow-delete
                />
            </router-link>
        </template>
    </draggable>
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

.songs {
    overflow-y: auto;
}

.toolbar {
    background: var(--color-background);
    position: sticky;
    z-index: 1;
    top: 1em;
    padding-top: 1em;
    margin-bottom: 1em;
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

.muted {
    color: var(--color-text-mute);
    text-align: center;
    display: flex;
    flex-direction: row;
    gap: 1em;
    align-items: center;
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
