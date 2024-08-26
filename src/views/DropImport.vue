<script setup lang="ts">
import { type ISetlist, type ISong } from "@/types";
import { useSongStore } from "@/stores/songs";
import { ref } from "vue";
import { useSetlistStore } from "@/stores/setlists";
import { useRouter } from "vue-router";

const drophover = ref(false);

const router = useRouter();
const songs = useSongStore();
const setlists = useSetlistStore();

const addItem = (item: ISong | ISetlist) => {
    if ("type" in item) {
        if (item.type == "setlist") {
            setlists.addSetlist(item);
            return "/setlists";
        } else {
            console.error("Unknown item type", item);
            return "/";
        }
    } else {
        songs.addSong(item);
        return "/browse";
    }
};

const addFiles = async (files: FileList) => {
    // read all as json
    const promises = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        promises.push(file.text());
    }
    const texts: string[] = await Promise.all(promises);
    const items: (ISong | ISong[])[] = texts.map((x) => JSON.parse(x));

    let redirect = "";

    for (const item of items) {
        if (Array.isArray(item)) {
            for (const song of item) {
                redirect = addItem(song);
            }
        } else {
            redirect = addItem(item);
        }
    }

    router.push(redirect);
};

const onDrop = (e: DragEvent) => {
    drophover.value = false;

    const files = e.dataTransfer!.files;
    if (files.length) {
        addFiles(files);
    }
};

const onDragleave = (e: any) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
        return;
    }
    drophover.value = false;
};
</script>
<template>
    <div
        class="dropzone"
        :class="{ drophover }"
        @drop.prevent="onDrop"
        @dragenter.prevent
        @dragover.prevent="drophover = true"
        @dragleave.prevent="onDragleave"
    >
        <slot />
    </div>
</template>
<style scoped>
.dropzone {
    min-height: 100vh;
    min-height: 100svh;
}

.dropzone.drophover::after {
    content: " ";
    display: block;
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.8rem;

    background: rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    position: absolute;
    inset: 0;
    margin: 1em;

    z-index: 1000;
}
</style>
