import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { type ISongEditedHistoryEntry } from "@/types";

const ITEM_NAME = "chordsheets.history";

export const useHistoryStore = defineStore("history", () => {
    const fromLocalStorage = () =>
        JSON.parse(localStorage.getItem(ITEM_NAME) || "[]");

    const history = ref<ISongEditedHistoryEntry[]>(fromLocalStorage());

    const historyJSON = computed(() => JSON.stringify(history.value));
    watch(
        history,
        () => {
            localStorage.setItem(ITEM_NAME, historyJSON.value);
        },
        { deep: true }
    );

    const songEdited = (songId: number) => {
        const date = new Date().toISOString();
        history.value = [
            { songId, date },
            ...history.value
                .filter((entry) => entry.songId !== songId)
                .slice(0, 9)
        ];
    };

    return {
        history,
        songEdited
    };
});
