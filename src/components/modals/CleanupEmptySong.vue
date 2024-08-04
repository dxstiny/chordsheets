<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { ISong } from "@/types";
import { useSongStore } from "@/stores/songs";
import IconButton from "../IconButton.vue";

const store = useSongStore();
const modal = ref<HTMLDialogElement>();
const emit = defineEmits(["close"]);

const props = defineProps({
    song: {
        type: Object as PropType<ISong>,
        required: true
    }
});

const show = () => {
    modal.value!.showModal();
};

const close = () => {
    modal.value!.close();
    emit("close");
};

const doDelete = () => {
    store.removeSong(props.song);
    close();
};

defineExpose({ show });
</script>

<template>
    <dialog ref="modal">
        <h1>Keep Song</h1>
        <div>
            <p>
                You don't appear to have any content in this song. Do you want
                to keep it?
            </p>
        </div>
        <div class="actions">
            <IconButton
                label="Keep it"
                icon="done"
                :style="'green'"
                @click="close()"
            />
            <IconButton
                label="Remove it"
                icon="delete"
                :style="'red'"
                @click="doDelete"
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
