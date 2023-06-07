<script lang="ts" setup>
import { ref } from "vue";
import { midiFromFile, type IMidiTrack } from "../../importMidi";
import MidiPreview from "../../components/MidiPreview.vue";

const track = ref<IMidiTrack | null>(null);

const parse = async () => {
    let source = document.getElementById("filereader");
    if (!source) return;
    const file = (source as HTMLInputElement).files?.[0];
    if (!file) return;
    track.value = await midiFromFile(file);

    console.log(JSON.stringify(track.value));
};
</script>
<template>
    <div class="test">
        <input
            type="file"
            id="filereader"
            @change="parse"
        />
        <br />
        <br />
        <MidiPreview
            v-if="track"
            :track="track"
        />
    </div>
</template>

<style scoped>
.test {
    padding: 1em;
}
</style>
