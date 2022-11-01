// Home
import Home from './home/pages/Home.vue'

// Bible Reader
import BibleReader from './bible/pages/BibleReader.vue'
import BibleSearch from './bible/pages/BibleSearch.vue'

// Account Management
import LogIn from './auth/pages/LogIn.vue'
import Register from './auth/pages/Register.vue'
import LogOut from './auth/pages/LogOut.vue'
import UserDashboard from './user/pages/UserDashboard.vue'

// 
import Commentaries from './commentaries/pages/Commentaries.vue'

// Sermons
import Sermons from './sermons/pages/Sermons.vue'
import SermonDetails from './sermons/pages/SermonDetails.vue'
import SermonAuthors from './sermons/pages/SermonAuthors.vue'
import SermonCategories from './sermons/pages/SermonCategories.vue'
// import SermonAuthorCollection from './sermons/pages/SermonAuthorCollection.vue'
import SermonCategoryCollection from './sermons/pages/SermonCategoryCollection.vue'
import SermonChurchCollection from './sermons/pages/SermonChurchCollection.vue'
import SermonSearch from './sermons/pages/SermonSearch.vue'

// Devotionals
import Devotionals from './devotionals/pages/Devotionals.vue'
import DevotionalDetails from './devotionals/pages/DevotionalDetails.vue'

// Author
import Author from './authors/pages/Author.vue'

// Truth Resources
import TruthResources from './truth resources/pages/TruthResources.vue'



import ComponentTestPage from './test/ComponentTestPage.vue'

import * as VueRouter from 'vue-router'
import Config from './config/services/ConfigService'

const routes = [
  // Home
  { path: '/', component: Home },

  // Bible
  { path: '/bible', component: BibleReader },
  { path: '/bible/search', component: BibleSearch },

  // Sermons
  { path: '/sermons', component: Sermons },
  { path: '/sermons/search', component: SermonSearch },
  { path: '/sermons/authors', component: SermonAuthors },
  { path: '/sermons/topics', component: SermonCategories },
  // { path: '/sermons/authors/:authorId', component: SermonAuthorCollection },
  { path: '/sermons/topics/:categoryKey', component: SermonCategoryCollection },
  { path: '/sermons/churches/:churchId', component: SermonChurchCollection },
  { path: '/sermons/:id', component: SermonDetails },

  // Devotionals
  { path: '/devotionals', component: Devotionals },
  { path: '/devotionals/:id', component: DevotionalDetails },

  // Authors
  { path: '/authors/:authorId', component: Author },

  // Account Management
  { path: '/auth/log-in', component: LogIn },
  { path: '/auth/register', component: Register },
  { path: '/auth/log-out', component: LogOut },
  { path: '/dashboard', component: UserDashboard },

  { path: '/study-tools/commentaries', component: Commentaries },

  // Truth Resources
  { path: '/truthres', component: TruthResources }
]

if (Config.environment === 'dev')
  routes.push({ path: '/test', component: ComponentTestPage })

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {

    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
        offset: { y: 80 }
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.afterEach((to, from, fail) => {
  console.log(fail)
})

export default router
