import { ref } from "vue";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", () => {
    const newEditor = ref(true);
    const editorUrl = (songId: number) => {
        let base = "/editor/";
        if (newEditor.value) {
            base += "v2/";
        }
        return base + songId;
    };

    return {
        newEditor,
        editorUrl
    };
});
