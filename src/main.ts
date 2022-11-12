import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import vfmPlugin from 'vue-final-modal'
import VuePdf from 'vue3-pdfjs'

const app = createApp(App)
app.use(vfmPlugin)
app.use(router)
app.use(VuePdf)
app.mount('#app')