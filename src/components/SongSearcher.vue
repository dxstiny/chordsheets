<script setup lang="ts">
import Search, { type Item } from "./Search.vue";
import { useSongStore } from "@/stores/songs";

const songs = useSongStore();

const emit = defineEmits(["select"]);

const search = (query: string): Item[] => {
    return songs.songs
        .filter((s) =>
            JSON.stringify({
                title: s.title,
                artist: s.artist,
                bpm: s.bpm,
                key: s.key
            })
                .toLowerCase()
                .includes(query.toLowerCase())
        )
        .map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.artist,
            img: s.cover,
            action: () => {
                emit("select", s);
            }
        }));
};
</script>
<template>
    <Search :search="search" />
</template>
