import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { type Scale, type Key, SCALES, SHARP_KEYS } from "@/types";

export const useLearnSessionStore = defineStore("learnSession", () => {
    const scale = ref<Scale>(SCALES[0]);
    const key = ref<Key>(SHARP_KEYS[0]);

    return {
        key,
        scale
    };
});
