import { createApp } from 'vue'
import './style.css'
import VueApp from './App.vue'
import router from './router'
import vfmPlugin from 'vue-final-modal'
import VuePdf from 'vue3-pdfjs'
import Vue3TouchEvents from "vue3-touch-events";

const app = createApp(VueApp)
app.use(vfmPlugin)
app.use(router)
app.use(VuePdf)
app.use(Vue3TouchEvents);
app.mount('#app')

import { App } from '@capacitor/app';

App.addListener('backButton', data => {
    window.history.back()
})