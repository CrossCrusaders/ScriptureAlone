import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import vfmPlugin from 'vue-final-modal'


const app = createApp(App)
app.use(vfmPlugin)
app.use(router)
app.mount('#app')
