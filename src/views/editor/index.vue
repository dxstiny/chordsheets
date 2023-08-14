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
    <MinWidth :minWidth="300">
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
            <MinWidth
                :minWidth="1100"
                error=""
            >
                <div class="config">
                    <Editor :song="song" />
                </div>
            </MinWidth>
        </div>
    </MinWidth>
</template>

<style>
.preview {
    .print {
        display: flex;

        @media screen and (max-width: 600px) {
            transform: scale(0.8);

            .void {
                transform: scale(1);
            }
        }

        @media screen and (max-width: 500px) {
            transform: scale(0.6);

            .void {
                transform: scale(1);
            }
        }

        @media screen and (max-width: 400px) {
            transform: scale(0.5);

            .void {
                transform: scale(1);
            }
        }
    }
}
</style>

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
    height: 100svh;
    width: 100vw;
    overflow: hidden;
    position: relative;
    z-index: 0;

    @media screen and (max-width: 1100px) {
        grid-template-columns: 1fr;
    }
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

    @media screen and (max-width: 1100px) {
        border-radius: 0;
        height: 100vh;
        height: 100svh;
        width: 100vw;
        padding: 1em;
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
