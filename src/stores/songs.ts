import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { empty, convertLegacySong, type ISong } from "@/types";

const ITEM_NAME = "chordsheets.songs";

export const useSongStore = defineStore("songs", () => {
    const fromLocalStorage = () =>
        JSON.parse(localStorage.getItem(ITEM_NAME) || "[]").map(
            convertLegacySong
        );

    const songs = ref<ISong[]>(fromLocalStorage());

    window.addEventListener("storage", () => {
        songs.value = JSON.parse(localStorage.getItem(ITEM_NAME) || "[]");
    });
    const songsJSON = computed(() => JSON.stringify(songs.value));
    watch(
        songs,
        () => {
            localStorage.setItem(ITEM_NAME, songsJSON.value);
        },
        { deep: true }
    );

    function addSong(song: ISong) {
        if (songs.value.find((s) => s.id === song.id)) return;

        songs.value.push(song);
    }

    function addEmptySong() {
        songs.value.push({
            ...empty,
            id: Math.round(Math.random() * 1000000)
        });
        return songs.value[songs.value.length - 1].id;
    }

    function removeSong(song: ISong) {
        const index = songs.value.indexOf(song);
        songs.value.splice(index, 1);
    }

    function updateSong(song: ISong) {
        const index = songs.value.findIndex(
            (s: ISong) => s.title === song.title && s.artist === song.artist
        );
        songs.value[index] = song;
    }

    const prepareRender = () => {
        for (const song of songs.value) {
            for (const section of song.sections) {
                for (const chord of section.progression) {
                    delete chord.selected;
                }
            }
        }

        // return promise that resolves in 50ms
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    };

    const moveTo = (oldIndex: number, newIndex: number) => {
        const song = songs.value[oldIndex];
        songs.value.splice(oldIndex, 1);
        songs.value.splice(newIndex, 0, song);
    };

    const song = (id: any) => {
        return songs.value.find((song) => song.id == id);
    };

    const createNew = () => {
        const song = {
            ...empty,
            id: Math.round(Math.random() * 1000000)
        };
        songs.value.push(song);
        return song as ISong;
    };

    const saveLib = async () => {
        await prepareRender();

        const text = JSON.stringify(songs.value, null, 4);
        const a = document.createElement("a");
        const file = new Blob([text], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = "chordsheets.json";
        a.click();
    };

    return {
        songs,
        addSong,
        removeSong,
        updateSong,
        addEmptySong,
        prepareRender,
        moveTo,
        song,
        createNew,
        saveLib
    };
});
