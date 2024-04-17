<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { debounce } from "lodash";
import type { ISong } from "@/types";
import { useSongStore } from "@/stores/songs";
import { useSettingsStore } from "@/stores/settings";
import { useRouter } from "vue-router";

const dialog = ref<HTMLDialogElement>();
const query = ref("");
const songs = useSongStore();
const results = ref<ISong[]>(songs.songs);
const settings = useSettingsStore();
const selection = ref<number>(-1);
const windowSelector = ref(0);
const router = useRouter();

const search = debounce(() => {
    results.value = songs.songs.filter((s) =>
        JSON.stringify({
            title: s.title,
            artist: s.artist,
            bpm: s.bpm,
            key: s.key
        })
            .toLowerCase()
            .includes(query.value.toLowerCase())
    );
}, 300);

// ctrl+k or ctrl+f
const onKeyDown = (e: KeyboardEvent) => {
    if (!dialog.value) return;

    if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        dialog.value.showModal();
    } else if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        dialog.value.close();
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selection.value < 2) {
            selection.value = Math.min(
                selection.value + 1,
                results.value.length - 1
            );
        } else if (windowSelector.value < results.value.length - 3) {
            windowSelector.value = Math.min(
                windowSelector.value + 1,
                results.value.length - 1
            );
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selection.value > 0) {
            selection.value = Math.max(selection.value - 1, 0);
        } else if (windowSelector.value > 0) {
            windowSelector.value = Math.max(windowSelector.value - 1, 0);
        }
    } else if (e.key === "Enter") {
        e.preventDefault();
        router.push(settings.editorUrl(results.value[selection.value].id));
    }
};

const showResults = computed(() => {
    return results.value.slice(
        windowSelector.value,
        Math.min(windowSelector.value + 3, results.value.length)
    );
});

onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
});
onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
});
</script>
<template>
    <dialog ref="dialog">
        <div class="content">
            <input
                type="text"
                placeholder="Search..."
                v-model="query"
                @input="search"
            />
            <div class="search-results">
                <div
                    v-for="result in showResults"
                    :key="result.id"
                    tabindex="0"
                    @click="$router.push(settings.editorUrl(result.id))"
                    @keydown.enter="$router.push(settings.editorUrl(result.id))"
                    class="song"
                    :class="{
                        selected:
                            selection + windowSelector ===
                            results.indexOf(result)
                    }"
                >
                    <div class="cover">
                        <img :src="result.cover || 'placeholders/song.svg'" />
                    </div>
                    <div class="info">
                        <h2>{{ result.title }}</h2>
                        <span>{{ result.artist }}</span>
                    </div>
                </div>
                <span v-if="results.length === 0">No results found</span>
            </div>
            <span v-if="results.length">{{ results.length }} songs found</span>
        </div>
    </dialog>
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

.dialog {
    display: grid;
    grid-template-rows: max-content 1fr;
}

.search-results {
    display: grid;
    align-content: start;
    gap: 0.5rem;
    padding: 0.5rem;
    height: 260px;
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
