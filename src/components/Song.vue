<script setup lang="ts">
import { useSongStore } from "@/stores/songs";
import type { PropType } from "vue";
import type { ISong } from "@/types";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();
const store = useSongStore();

defineProps({
    song: {
        type: Object as PropType<ISong>,
        required: true
    },
    allowDelete: {
        type: Boolean,
        default: false
    }
});
</script>
<template>
    <router-link :to="settings.editorUrl(song.id)">
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
                v-if="allowDelete"
                class="material-symbols-rounded delete"
                @click.prevent="store.removeSong(song)"
            >
                delete
            </span>
        </div>
    </router-link>
</template>

<style scoped>
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
</style>
