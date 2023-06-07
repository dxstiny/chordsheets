<script setup lang="ts">
import { ref, onMounted } from "vue";

defineProps({
    minWidth: {
        required: true,
        type: Number
    },
    error: {
        required: false,
        type: String,
        default: "Mobile devices are currently not supported."
    }
});

const width = ref(0);

onMounted(() => {
    width.value = window.innerWidth;
});
window.addEventListener("resize", () => {
    width.value = window.innerWidth;
});
</script>

<template>
    <div
        v-if="width < minWidth"
        class="min-width"
    >
        <p>{{ error }}</p>
    </div>
    <slot v-else />
</template>

<style scoped>
.min-width {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    height: 100svh;
}
</style>
