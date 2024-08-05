<script lang="ts" setup>
import { type Chord, type ISong } from "@/types";
import { ref, onMounted, onUnmounted } from "vue";
import { useSongStore } from "@/stores/songs";
import { useHistoryStore } from "@/stores/history";
import { useRoute, useRouter } from "vue-router";
import MinWidth from "../MinWidth.vue";
import Editor from "./Editor.vue";
import LinkSpotify from "@/components/modals/LinkSpotify.vue";
import CleanupEmptySong from "@/components/modals/CleanupEmptySong.vue";

const songs = useSongStore();
const songHistory = useHistoryStore();

const route = useRoute();
const router = useRouter();
let textId = route.params.id as string;
const editor = ref<typeof Editor>();
const linkSpotify = ref<typeof LinkSpotify>();
const cleanupEmptySong = ref<typeof CleanupEmptySong>();

if (!textId) {
    const id = songs.addEmptySong();
    router.push({
        path: `/editor/${id}`,
        replace: true
    });
    textId = String(id);
}

const s = songs.song(textId);
if (!s) router.push("/");
const song = ref<ISong>(s as ISong);

const isSongEmpty = () => {
    if (song.value.artist) return false;
    if (song.value.title) return false;
    if (song.value.instruments.length) return false;
    if (song.value.sections.length) return false;
    if (song.value.structure.length) return false;
    return true;
};

const navigateBack = () => {
    if (isSongEmpty()) {
        cleanupEmptySong.value?.show();
        return;
    }
    router.push("/");
};

const print = async () => {
    await songs.prepareRender();
    const pdf = await editor.value!.render!();
    if (!pdf) return;
    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");
};

const download = async () => {
    await songs.prepareRender();
    const pdf = await editor.value!.render!();
    if (!pdf) return;
    pdf.save(`${song.value.title}.pdf`);
};

const save = () => {
    if (!song.value) return;
    // download 'song' as json
    const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(song.value));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
        "download",
        `${song.value.title}.chordsheets.json`
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

const onKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        save();
    } else if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        download();
    } else if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        print();
    }
};

onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
    songHistory.songEdited(song.value.id);
});
onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
});
</script>
<template>
    <MinWidth :minWidth="300">
        <LinkSpotify
            ref="linkSpotify"
            :song="song"
        />
        <CleanupEmptySong
            ref="cleanupEmptySong"
            @close="$router.push('/browse')"
        />
        <div class="editor_container">
            <a
                @click="navigateBack"
                class="back-button"
            >
                <span class="material-symbols-rounded">arrow_back</span>
            </a>

            <div class="toolbar">
                <span
                    class="material-symbols-rounded"
                    @click="print"
                    title="Print (Ctrl+P)"
                >
                    print
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="download"
                    title="Download as PDF (CTRL+SHIFT+S)"
                >
                    picture_as_pdf
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="save"
                    title="Download as JSON (CTRL+S)"
                >
                    file_download
                </span>
                <span
                    class="material-symbols-rounded"
                    @click="linkSpotify?.show()"
                    title="Link Spotify"
                >
                    link
                </span>
            </div>

            <Editor
                ref="editor"
                :song="song"
            />
        </div>
    </MinWidth>
</template>

<style></style>

<style scoped>
.back-button {
    position: fixed;
    top: 1em;
    left: calc(1em + 220px + 2em);
    z-index: 1;
    cursor: pointer;

    @media (max-width: 800px) {
        left: 1em;
    }
}

.toolbar {
    display: flex;
    gap: 1em;
    justify-content: center;
    align-items: center;
    padding: 1em;
    background: var(--color-background);
    border-radius: 0.5em;
    border: 1px solid var(--color-border);
    box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 1em;
    z-index: 1;

    & span {
        cursor: pointer;

        &:hover {
            color: var(--color-accent);
        }
    }
}

.editor_container {
    background: none;
    box-shadow: none;
    border: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    overflow: auto;
    height: 100%;
    padding-top: 6em;
    overflow-y: auto;
}
</style>
