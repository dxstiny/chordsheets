import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: () => import("../views/Dashboard.vue")
        },
        {
            path: "/editor",
            name: "Editor",
            component: () => import("../views/editor/index.vue")
        },
        {
            path: "/midi",
            name: "Midi",
            component: () => import("../views/midi/index.vue")
        },
        {
            path: "/learn",
            name: "Learn",
            component: () => import("../views/learn/Scales.vue")
        }
    ]
});

export default router;
