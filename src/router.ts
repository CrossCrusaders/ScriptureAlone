import Home from './core/pages/Home.vue'
import BibleSearch from './bible/pages/BibleSearch.vue'
import LogIn from './auth/pages/LogIn.vue'
import Register from './auth/pages/Register.vue'
import Commentaries from './commentaries/pages/Commentaries.vue'
import Sermons from './sermons/pages/Sermons.vue'
import SermonDetails from './sermons/pages/SermonDetails.vue'

import * as VueRouter from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/bible', component: BibleSearch },
  { path: '/sermons', component: Sermons },
  { path: '/sermons/:id', component: SermonDetails },

  { path: '/auth/log-in', component: LogIn },
  { path: '/auth/register', component: Register },

  { path: '/study-tools/commentaries', component: Commentaries }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: routes
})

export default router
