<script lang="ts" setup>
import { mock, type ISong } from "@/types";
import Song from "./Song.vue";
import { ref, onMounted } from "vue";
import { useSongStore } from "@/stores/songs";
import { useRoute, useRouter } from "vue-router";
import Editor from "./Editor.vue";
import MinWidth from "../MinWidth.vue";
import { $ } from "vue/macros";

const songs = useSongStore();

if (!songs.songs.length) songs.addSong(mock);

const route = useRoute();
const router = useRouter();
let textIndex = route.query.s;

if (!textIndex) {
    const id = songs.addEmptySong();
    router.push({
        query: {
            s: id
        },
        replace: true
    });
    textIndex = String(id);
}

const id = Number(textIndex);

if (isNaN(id)) router.push("/");
if (!songs.songs[id]) router.push("/");
const song = ref<ISong>(songs.songs[id]);
const preview = ref<InstanceType<typeof Song>>();
</script>
<template>
    <MinWidth :minWidth="1100">
        <div
            class="editor"
            v-if="song"
        >
            <router-link
                to="/"
                class="back-button"
            >
                <span class="material-symbols-rounded">arrow_back</span>
            </router-link>

            <div class="preview">
                <div
                    class="pages"
                    v-if="preview"
                >
                    <span
                        @click="preview.prevPage"
                        class="material-symbols-rounded"
                    >
                        chevron_left
                    </span>
                    {{ preview.getCurrentPage() }} /
                    {{ preview.getTotalPages() }}
                    <span
                        @click="preview.nextPage"
                        class="material-symbols-rounded"
                    >
                        chevron_right
                    </span>
                    <span
                        class="material-symbols-rounded"
                        @click="preview.print"
                    >
                        print
                    </span>
                    <span
                        class="material-symbols-rounded"
                        @click="preview.download"
                    >
                        file_download
                    </span>
                </div>
                <div class="print a4">
                    <Song
                        :song="song"
                        ref="preview"
                    />
                </div>
            </div>
            <div class="config">
                <Editor :song="song" />
            </div>
        </div>
    </MinWidth>
</template>

<style scoped>
.back-button {
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 1;
}

.editor {
    display: grid;
    grid-template-columns: max-content 1fr;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
    z-index: 0;
}

.preview {
    background: var(--color-background-soft);
    border-radius: 0 2rem 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1em;
    padding: 0 10em;

    .print {
        display: flex;
    }

    .pages {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        color: var(--color-text);

        .material-symbols-rounded {
            cursor: pointer;
        }
    }
}
</style>
