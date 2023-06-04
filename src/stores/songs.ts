import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { empty, type ISong } from "@/types";

const ITEM_NAME = "chordsheets.songs";

export const useSongStore = defineStore("songs", () => {
    const fromLocalStorage = () =>
        JSON.parse(localStorage.getItem(ITEM_NAME) || "[]");

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
        songs.value.push(song);
    }

    function addEmptySong() {
        songs.value.push(empty);
        return songs.value.length - 1;
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

    return {
        songs,
        addSong,
        removeSong,
        updateSong,
        addEmptySong
    };
});
