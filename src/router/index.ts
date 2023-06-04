import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: () => import("../views/Dashboard.vue")
        },
        {
            path: "/editor/:index",
            name: "EditorIndex",
            component: () => import("../views/editor/index.vue")
        },
        {
            path: "/editor",
            name: "Editor",
            component: () => import("../views/editor/index.vue")
        }
    ]
});

export default router;
