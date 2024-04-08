<script setup lang="ts">
import { ref } from "vue";
import type { ISong } from "@/types";
import { useSongStore } from "@/stores/songs";
import IconButton from "../IconButton.vue";

const store = useSongStore();
const toImport = ref<ISong[]>([]);
const addOrOverwrite = ref<HTMLDialogElement>();

const show = () => {
    toImport.value = [];

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const songs = JSON.parse(text);

            if (!store.songs.length) {
                store.songs = songs;
                return;
            }

            toImport.value = songs;
            addOrOverwrite.value!.showModal();
        };
        reader.readAsText(file);
    };
    input.click();
};

const merge = () => {
    for (const song of toImport.value) {
        const existing = store.songs.find(
            (x) => x.title === song.title && x.artist === song.artist
        );
        if (!existing) {
            store.songs.push(song);
        } else {
            Object.assign(existing, song);
        }
    }
    toImport.value = [];
    addOrOverwrite.value!.close();
};

const overwrite = () => {
    store.songs = toImport.value;
    toImport.value = [];
    addOrOverwrite.value!.close();
};

defineExpose({ show });
</script>

<template>
    <dialog ref="addOrOverwrite">
        <h1>{{ toImport.length }} songs to import</h1>
        <p>
            You already have {{ store.songs.length }} songs in your library.
            <br />
            Do you want to merge the libraries songs or overwrite the existing
            one?
        </p>
        <div class="actions">
            <IconButton
                label="Cancel"
                icon="close"
                :style="'red'"
                @click="addOrOverwrite!.close()"
            />
            <IconButton
                label="Merge"
                icon="merge"
                @click="merge"
            />
            <IconButton
                label="Overwrite"
                icon="sync_problem"
                :style="'yellow'"
                @click="overwrite"
            />
        </div>
    </dialog>
</template>

<style scoped>
dialog {
    position: fixed;
}

.actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
    justify-content: end;
}
</style>
