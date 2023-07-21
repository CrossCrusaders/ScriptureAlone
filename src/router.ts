// Home
import Home from './home/pages/Home.vue'
import FourZeroFour from './home/pages/404.vue'

// Bible Reader
import BibleReader from './bible/pages/BibleReader.vue'
import BibleSearch from './bible/pages/BibleSearch.vue'
import VerseOfTheDay from './bible/pages/VerseOfTheDay.vue'

// Account Management
import LogIn from './auth/pages/LogIn.vue'
import Register from './auth/pages/Register.vue'
import LogOut from './auth/pages/LogOut.vue'
import ForgotPassword from './auth/pages/ForgotPassword.vue'
import ResetPassword from './auth/pages/ResetPassword.vue'
import ChangePassword from './auth/pages/ChangePassword.vue'
import ChangEmail from './auth/pages/ChangeEmail.vue'
import ResetEmail from './auth/pages/ResetEmail.vue'
import DeleteAccount from './auth/pages/DeleteAccount.vue'

// User
import UserDashboard from './user/pages/UserDashboard.vue'
import UserSettings from './user/pages/UserSettings.vue'

// 
import Commentaries from './commentaries/pages/Commentaries.vue'

// Devotionals
import Devotionals from './devotionals/pages/Devotionals.vue'
import DevotionalDetails from './devotionals/pages/DevotionalDetails.vue'

// Author
import Author from './authors/pages/Author.vue'

// Truth Resources
import TruthResources from './truthResources/pages/TruthResources.vue'
import TruthResourcesDetails from './truthResources/pages/TruthResourcesDetails.vue'
import TruthResourceTextMaterials from './truthResources/pages/TextMaterials.vue'
import TruthResourceVideo from './truthResources/pages/Videos.vue'

// Notes
import NoteViewer from './notes/pages/NoteViewer.vue'

// Versions
import Updates from './versions/pages/Updates.vue'
import VersionDetails from './versions/pages/VersionDetails.vue'

import ComponentTestPage from './test/ComponentTestPage.vue'

import * as VueRouter from 'vue-router'
import Config from './config/services/ConfigService'

const routes = [
  // Home
  { path: '/', component: Home },

  // Bible
  { path: '/bible', component: BibleReader },
  { path: '/bible/search', component: BibleSearch },
  { path: '/bible/votd', component: VerseOfTheDay },

  // Devotionals
  { path: '/devotionals', component: Devotionals },
  { path: '/devotionals/:id', component: DevotionalDetails },

  // Authors
  { path: '/authors/:authorId', component: Author },

  // Account Management
  { path: '/auth/log-in', component: LogIn },
  { path: '/auth/register', component: Register },
  { path: '/auth/log-out', component: LogOut },
  { path: '/auth/forgot-password', component: ForgotPassword },
  { path: '/auth/confirm-password-reset', component: ResetPassword },
  { path: '/auth/change-password', component: ChangePassword },
  { path: '/auth/change-email', component: ChangEmail },
  { path: '/auth/confirm-email-reset', component: ResetEmail },
  { path: '/auth/delete-account', component: DeleteAccount },

  // User
  { path: '/dashboard', component: UserDashboard },
  { path: "/dashboard/settings", component: UserSettings },

  { path: '/study-tools/commentaries', component: Commentaries },

  // Truth Resources
  { path: '/truth-resources', component: TruthResources },
  { path: '/truth-resources/:id', component: TruthResourcesDetails },
  { path: '/truth-resources/text-materials', component: TruthResourceTextMaterials },
  { path: '/truth-resources/videos', component: TruthResourceVideo },

  // Notes
  { path: '/note/:id', component: NoteViewer },

  // Versions
  { path: '/versions', component: Updates },
  { path: '/versions/:id', component: VersionDetails },

  // 404
  { path: '/:pathMatch(.*)', component: FourZeroFour }
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

import { Preferences } from "@capacitor/preferences";
router.beforeEach(async(to, from)=>{
  if(to.fullPath == "/"){
    var HomeScreenEnabled = await (String(await (await Preferences.get({ key: "HomeScreenEnabled" })).value).toLowerCase() === 'true')
    if(HomeScreenEnabled == null){
      Preferences.set({
        key: "HomeScreenEnabled",
        value: "true"
      })
      HomeScreenEnabled = await (String(await (await Preferences.get({ key: "HomeScreenEnabled" })).value).toLowerCase() === 'true')
    }
  
    if(!HomeScreenEnabled){
      const string = await (await Preferences.get({ key: "LastBibleData" })).value
      const BibleData = await JSON.parse(string || "");
      router.push(`/bible?t=${BibleData?.translation}&b=${BibleData.book}&c=${BibleData.chapter}`);
    }
  }
})

export default router
