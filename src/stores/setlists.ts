import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { type ISetlist } from "@/types";
import { useSongStore } from "./songs";

const ITEM_NAME = "chordsheets.setlists";

export const useSetlistStore = defineStore("setlists", () => {
    const fromLocalStorage = () =>
        JSON.parse(localStorage.getItem(ITEM_NAME) || "[]");

    const setlists = ref<ISetlist[]>(fromLocalStorage());

    window.addEventListener("storage", () => {
        setlists.value = JSON.parse(localStorage.getItem(ITEM_NAME) || "[]");
    });
    const setlistsJSON = computed(() => JSON.stringify(setlists.value));
    watch(
        setlists,
        () => {
            localStorage.setItem(ITEM_NAME, setlistsJSON.value);
        },
        { deep: true }
    );

    function addSetlist(setlist: ISetlist) {
        const songs = useSongStore();

        // for song in setlist, if it is a song and not just an id, add it to the songs store

        setlist.sections.forEach((section) => {
            section.songs.forEach((song) => {
                if ("title" in song) {
                    songs.addSong(song);
                }
            });
            section.songs = section.songs.map((song) => ({
                id: song.id
            }));
        });

        setlists.value.push(setlist);
    }

    function addEmptySetlist() {
        const setlist: ISetlist = {
            type: "setlist",
            name: "Setlist " + (setlists.value.length + 1),
            sections: [
                {
                    name: "Section 1",
                    songs: [],
                    id: Math.round(Math.random() * 1000000)
                }
            ],
            id: Math.round(Math.random() * 1000000)
        };
        setlists.value.push(setlist);
        return setlist;
    }

    function removeSetlist(setlist: ISetlist) {
        const index = setlists.value.findIndex(
            (s: ISetlist) => s.id === setlist.id
        );
        setlists.value.splice(index, 1);
    }

    const duplicateSetlist = (setlist: ISetlist) => {
        const newSetlist = JSON.parse(JSON.stringify(setlist));
        newSetlist.id = Math.round(Math.random() * 1000000);
        newSetlist.name = "Copy of " + newSetlist.name;
        setlists.value.push(newSetlist);
        return newSetlist;
    };

    const setlist = (id: number) => {
        return setlists.value.find((s: ISetlist) => s.id === id);
    };

    return {
        setlists,
        setlistsJSON,
        addSetlist,
        addEmptySetlist,
        removeSetlist,
        duplicateSetlist,
        setlist
    };
});
