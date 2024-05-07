<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { Chord, ISong } from "@/types";
import { useSongStore } from "@/stores/songs";
import { getSongInfo, parseId, type ISongInfo } from "@/spotifyApi";
import IconButton from "../IconButton.vue";
import TextInput from "../TextInput.vue";

const store = useSongStore();
const modal = ref<HTMLDialogElement>();
const spotifyInfo = ref<ISongInfo>();

const changes = ref({
    artist: {
        from: "",
        to: ""
    },
    title: {
        from: "",
        to: ""
    },
    bpm: {
        from: 0,
        to: 0
    },
    key: {
        from: "" as Chord,
        to: "" as Chord
    },
    cover: {
        from: "",
        to: ""
    }
});

const props = defineProps({
    song: {
        type: Object as PropType<ISong>,
        required: true
    }
});

const show = () => {
    modal.value!.showModal();
    fetchSpotifyData();
};

const fetchSpotifyData = async () => {
    if (!props.song.spotify) return;

    spotifyInfo.value = await getSongInfo(parseId(props.song.spotify));
    if (!spotifyInfo.value) return;

    changes.value.artist = {
        from: props.song.artist,
        to: spotifyInfo.value.artist
    };
    changes.value.title = {
        from: props.song.title,
        to: spotifyInfo.value.name
    };
    changes.value.bpm = {
        from: props.song.bpm,
        to: spotifyInfo.value.tempo
    };
    changes.value.key = {
        from: props.song.key,
        to: spotifyInfo.value.key as Chord
    };
    changes.value.cover = {
        from: props.song.cover,
        to: spotifyInfo.value.cover ?? ""
    };
};

const changeIcon = (key: string) => {
    return (
        {
            bpm: "music_note",
            key: "piano",
            artist: "person",
            title: "title",
            cover: "image"
        }[key] ?? key
    );
};

const applyChanges = () => {
    for (const key in changes.value) {
        (props.song as any)[key] = (changes.value as any)[key].to;
    }
};

const confirm = () => {
    applyChanges();
    modal.value!.close();
};

defineExpose({ show });
</script>

<template>
    <dialog ref="modal">
        <h1>Link Spotify</h1>
        <div>
            <div class="row">
                <TextInput
                    label="Spotify URI"
                    v-model="song.spotify"
                    @change="fetchSpotifyData"
                />
                <span
                    @click="fetchSpotifyData"
                    class="material-symbols-rounded"
                >
                    refresh
                </span>
            </div>
            <div
                class="changes"
                v-if="spotifyInfo"
            >
                <h3>Changes</h3>
                <div class="content">
                    <template v-for="(value, key) in changes">
                        <span class="material-symbols-rounded">{{
                            changeIcon(key)
                        }}</span>
                        <span class="muted from">
                            {{ value.from }}
                        </span>
                        <span class="material-symbols-rounded"
                            >arrow_forward</span
                        >
                        <TextInput
                            class="to"
                            v-model="changes[key].to"
                            :disabled="true"
                        />
                        <span
                            @click="delete changes[key]"
                            class="material-symbols-rounded"
                        >
                            close
                        </span>
                    </template>
                </div>
            </div>
        </div>
        <div class="actions">
            <IconButton
                label="Cancel"
                icon="close"
                :style="'red'"
                @click="modal!.close()"
            />
            <IconButton
                label="Confirm"
                icon="done"
                @click="confirm"
                :disabled="!spotifyInfo"
            />
        </div>
    </dialog>
</template>

<style scoped>
dialog {
    position: fixed;
    min-width: clamp(20em, 50%, 30em);
}

.row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1em;
    align-items: center;
}

.changes .material-symbols-rounded {
    font-size: 1em;
    color: var(--color-text);
}

.changes {
    margin-top: 1em;
}

.changes .content {
    align-items: start;
    display: grid;
    grid-template-columns: 1ch 1fr 1ch 1fr 1ch;
    align-items: center;
    gap: 1em;
    color: var(--color-text-mute);
}

.to,
.from {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 30ch;
}

.material-symbols-rounded {
    cursor: pointer;
}

.actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
    justify-content: end;
}
</style>
