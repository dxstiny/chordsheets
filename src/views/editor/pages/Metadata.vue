<script lang="ts" setup>
import NumberInput from "@/components/NumberInput.vue";
import TextInput from "@/components/TextInput.vue";
import {
    INSTRUMENT_TYPES,
    type ISong,
    type IInstrument,
    type Chord
} from "@/types";
import { watch, ref, type PropType } from "vue";
import { useSongStore } from "@/stores/songs";

const store = useSongStore();

const props = defineProps({
    song: {
        required: true,
        type: Object as PropType<ISong>
    }
});

watch(
    () => props.song,
    (song) => {
        if (!song) return;
        eSong.value = song;
    }
);

const eSong = ref<ISong>(props.song);

const addInstrument = (slot: string) => {
    const slots = ["l", "r1", "r2"];
    if (!slots.includes(slot)) return;
    if (!eSong.value.instruments[slot]) {
        eSong.value.instruments[slot] = {
            type: INSTRUMENT_TYPES[0],
            name: INSTRUMENT_TYPES[0],
            volume: 100,
            page: 1
        } as IInstrument;
        return;
    }
};

watch(
    () => eSong.value,
    (song) => {
        if (!song) return;
        store.updateSong(song);
    }
),
    { deep: true };

const searchSpotify = async () => {
    // http://localhost:1234/api/search
    // query: `artist:${eSong.value.artist} track:${eSong.value.title}`

    if (!eSong.value.artist || !eSong.value.title) return;

    const query = `artist:${eSong.value.artist} track:${eSong.value.title}`;
    const res = await fetch("http://localhost:1234/api/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, scope: ["spotify"] })
    });
    const data = await res.json();
    const track = data.spotifyTracks?.[0];
    if (!track) return;
    eSong.value.spotify = track.url;
    eSong.value.cover = track.cover;
    getMetadata();
};

const getMetadata = async () => {
    console.log("getMetadata");

    // http://localhost:1234/api/spotify/meta
    // forceFetch: true
    // spotifyId: 6y0igZArWVi6Iz0rj35c1Y

    if (!eSong.value.spotify) return;

    if (eSong.value.spotify.includes("?")) {
        eSong.value.spotify = eSong.value.spotify.split("?")[0];
    }

    const res = await fetch("http://localhost:1234/api/spotify/meta", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            forceFetch: true,
            spotifyId: eSong.value.spotify.split("/").pop()
        })
    });
    const data = await res.json();
    eSong.value.bpm = Math.round(data.spotify.features.tempo);
    eSong.value.key = (data.spotify.features.key +
        (data.spotify.features.mode === "Minor" ? "m" : "")) as Chord;
};
</script>
<template>
    <TextInput
        v-model="eSong.title"
        label="title"
        @change="searchSpotify"
    />
    <TextInput
        v-model="eSong.artist"
        label="artist"
        @change="searchSpotify"
    />
    <TextInput
        v-model="eSong.spotify"
        label="Spotify Link"
        @change="getMetadata"
        buttonIcon="search"
        @buttonClick="searchSpotify"
    />
    <TextInput
        v-model="eSong.key"
        label="key"
    />
    <NumberInput
        v-model="eSong.bpm"
        :min="0"
        label="bpm"
    />
    <NumberInput
        v-model="eSong.transpose"
        :min="-12"
        :max="12"
        label="transpose"
    />
    <NumberInput
        v-model="eSong.octave"
        :min="-1"
        :max="1"
        label="octave"
    />
</template>
