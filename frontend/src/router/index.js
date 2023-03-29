import {createRouter, createWebHashHistory} from 'vue-router';
import MainPage from '@/views/MainPage.vue'
import WebGLPage from '@/views/WebGLPage'
import ComTestPage from '@/views/ComTestPage'

const routerHistory = createWebHashHistory();

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage,
    },
    {
        path: '/WebGLPage',
        name: 'WebGLPage',
        component: WebGLPage,
    },
    /*{
        path: '/WebGLTest',
        name: 'WebGLTest',
        component: WebGLTest,
    },*/
    {
        path: '/ComTestPage',
        name: 'ComTestPage',
        component: ComTestPage,
    },
];

const router = createRouter({
    history: routerHistory,
    routes
});

export default router;