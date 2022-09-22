import Home from './pages/Home.vue'
import BibleSearch from './pages/Bible/BibleSearch.vue'
import LogIn from './pages/Auth/LogIn.vue'
import Register from './pages/Auth/Register.vue'
import Commentaries from './pages/StudyTools/Commentaries.vue'
import Sermons from './pages/Sermons/Sermons.vue'

import * as VueRouter from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/bible', component: BibleSearch },
  { path: '/sermons', component: Sermons },

  { path: '/auth/log-in', component: LogIn },
  { path: '/auth/register', component: Register },

  { path: '/study-tools/commentaries', component: Commentaries }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: routes
})

export default router
