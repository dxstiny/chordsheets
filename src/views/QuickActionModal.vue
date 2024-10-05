<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import QuickActionMenu from "@/components/QuickActionMenu.vue";

const dialog = ref<HTMLDialogElement>();
const isOpen = ref(false);

// ctrl+k or ctrl+f
const onKeyDown = (e: KeyboardEvent) => {
    if (!dialog.value) return;

    if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        dialog.value.showModal();
        isOpen.value = true;
    } else if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        dialog.value.close();
        isOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
});
onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
});
</script>
<template>
    <dialog ref="dialog">
        <QuickActionMenu
            v-if="isOpen"
            :features="[
                'song.create',
                'song.browse',
                'setlist.create',
                'setlist.browse',
                'settings',
                'library.save',
                'learn'
            ]"
            @select="dialog?.close()"
        />
    </dialog>
</template>

<style scoped>
.dialog {
    display: grid;
    grid-template-rows: max-content 1fr;
}
</style>
