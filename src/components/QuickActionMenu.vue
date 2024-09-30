<script setup lang="ts">
import { useRouter } from "vue-router";
import Search, { type Item } from "./Search.vue";
import { useSongStore } from "@/stores/songs";
import { useSettingsStore } from "@/stores/settings";
import { useSetlistStore } from "@/stores/setlists";
import type { PropType } from "vue";

const songs = useSongStore();
const setlists = useSetlistStore();
const router = useRouter();
const settings = useSettingsStore();

type Action =
    | "print"
    | "export"
    | "setlist.create"
    | "settings"
    | "song.create"
    | "library.save"
    | "library.import"
    | "learn";

const props = defineProps({
    features: {
        type: Array as PropType<Action[]>,
        default: ["song.create", "setlist.create", "settings"]
    }
});

const emit = defineEmits(["print", "export", "select", "import"]);

const filterSongs = (query: string): Item[] => {
    return songs.songs
        .filter((s) =>
            JSON.stringify({
                title: s.title,
                artist: s.artist,
                bpm: s.bpm,
                key: s.key
            })
                .toLowerCase()
                .includes(query.toLowerCase())
        )
        .map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.artist,
            img: s.cover,
            action: () => {
                router.push(settings.editorUrl(s.id));
            }
        }));
};

const filterSetlists = (query: string): Item[] => {
    return setlists.setlists
        .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
        .map((s) => ({
            id: s.id,
            title: s.name,
            subtitle: "Setlist",
            icon: { name: "list", tint: "blue" },
            action: () => {
                router.push("/setlists/edit/" + s.id);
            }
        }));
};

const allActions = (query: string) =>
    [
        {
            id: "setlist.create",
            title: "Create setlist",
            subtitle: "Start from scratch",
            icon: "playlist_add",
            action: () => {
                const setlist = setlists.addEmptySetlist();
                router.push("/setlists/edit/" + setlist.id);
            }
        },
        {
            id: "export",
            title: "Export all",
            subtitle: "Export all songs to PDF",
            icon: "file_download",
            action: () => {
                emit("export");
            }
        },
        {
            id: "print",
            title: "Print all",
            subtitle: "Print all songs to PDF (export + print)",
            icon: "file_download",
            action: () => {
                emit("print");
            }
        },
        {
            id: "library.save",
            title: "Save library",
            subtitle: "Save all songs to file",
            icon: "file_download",
            action: () => {
                songs.saveLib();
            }
        },
        {
            id: "library.import",
            title: "Import library",
            subtitle: "Import songs from file",
            icon: "file_download",
            action: () => {
                emit("import");
            }
        },
        {
            id: "learn",
            title: "Learn",
            subtitle: "Learn music theory",
            icon: { name: "school", tint: "red" },
            action: () => {
                router.push("/learn");
            }
        },
        {
            id: "settings",
            title: "Settings",
            subtitle: "Change app settings",
            icon: { name: "settings", tint: "red" },
            action: () => {
                router.push("/settings");
            }
        },
        {
            id: "song.create",
            title: "Create new song",
            subtitle:
                (query.startsWith("http") ? "Using Spotify link: " : "") +
                query,
            icon: "add",
            action: () => {
                const song = songs.createNew();
                if (query.startsWith("http")) {
                    song.spotify = query;
                } else {
                    song.title = query;
                }
                router.push(settings.editorUrl(song.id));
            }
        }
    ] as Item[];

const filterActions = (query: string): Item[] => {
    return allActions(query).filter(
        (a) =>
            props.features.includes(a.id as Action) &&
            JSON.stringify({
                title: a.title,
                subtitle: a.subtitle
            })
                .toLowerCase()
                .includes(query.toLowerCase())
    );
};

const search = (query: string): Item[] => {
    return [
        ...filterSongs(query),
        ...filterSetlists(query),
        ...filterActions(query)
    ];
};
</script>
<template>
    <Search
        :search="search"
        @select="(...args) => emit('select', ...args)"
        :rotatingPlaceholder="[
            'Search songs...',
            'Search setlists...',
            'Enter a song name to create it from scratch...',
            'Search actions...',
            'Paste a Spotify link to create a new song...'
        ]"
    />
</template>

<style scoped>
input {
    border: none;
    border-bottom: 1px solid #ccc;
    outline: none;
    background: none;
    width: 100%;
    font-size: 1.2rem;
    min-width: 50ch;
    padding: 0.5rem;
    font-family: inherit;
    color: var(--color-heading);
}

.content {
    width: 100%;
}

.search-results {
    display: grid;
    align-content: start;
    gap: 0.5rem;
    padding: 0.5rem;
    overflow: clip;
    height: 100%;

    transition: all 0.3s ease-in-out;
}

.song {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 1em;
    color: var(--color-text);
    border-radius: 1em;
    padding: 0.5em 1em;
    border: 1px solid transparent;
    isolation: isolate;
    position: relative;
    overflow: hidden;
    cursor: pointer;

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

    &:hover,
    &:focus,
    &.selected {
        background: var(--color-background-soft);
        border: 1px solid var(--color-border);
        outline: none;
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

h2 {
    font-size: 1.25em;
    font-weight: 500;
}
</style>
