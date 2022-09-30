//Home
import Home from './core/pages/Home.vue'
//Bible Reader
import BibleReader from './bible/pages/BibleReader.vue'
//Account Management
import LogIn from './auth/pages/LogIn.vue'
import Register from './auth/pages/Register.vue'
//
import Commentaries from './commentaries/pages/Commentaries.vue'
//Sermons
import Sermons from './sermons/pages/Sermons.vue'
import SermonDetails from './sermons/pages/SermonDetails.vue'
//Devotionals
import Devotionals from './devotionals/pages/Devotionals.vue'
import DevotionalDetails from './devotionals/pages/DevotionalDetails.vue'

import UserDashboard from './user/pages/UserDashboard.vue'

import * as VueRouter from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/bible', component: BibleReader },

  { path: '/dashboard', component: UserDashboard },

  //Sermons
  { path: '/sermons', component: Sermons },
  { path: '/sermons/:id', component: SermonDetails },

  //Devotionals
  { path: '/devotionals', component: Devotionals },
  { path: '/devotionals/:id', component: DevotionalDetails },

  //Account Management
  { path: '/auth/log-in', component: LogIn },
  { path: '/auth/register', component: Register },

  { path: '/study-tools/commentaries', component: Commentaries }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: routes
})

export default router
