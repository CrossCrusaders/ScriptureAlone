<template>
  <AppLayout>
    <PageContent>

      <PageHero>
        <template v-slot:image>

          <img :src="userProfileImage" class="object-cover max-h-32 w-32 h-32 max-w-32 rounded-full" />

        </template>

        <h2 class="text-4xl font-bold mb-2 text-slate-900">Hello, {{ user?.profile.name }}!</h2>
        <p class="text-slate-600">
          We're glad you are here, remember to read the verse of the day!
        </p>
        <template v-slot:actions>
          <AppButton to="/dashboard/settings">Settings</AppButton>
        </template>
      </PageHero>

      <div class="hidden md:flex flex-row justify-between items-center mb-16">
        <Badge v-for="(category, index) in categories" @click="goToPage(category.link)" :icon-name="category.badge"
          :label="category.name" :key="index" class="cursor-pointer">
        </Badge>
      </div>
      <br>

      <!-- Favorite Sermons -->
      <PageHero>
        <div class="flex justify-center">
          <h1
            class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#57687f] to-[#1e293b] text-transparent bg-clip-text">
            Favorited Sermons
          </h1>
        </div>
        <Divider></Divider>
        <ContentPreviewGrid v-if="favoriteSermons?.length" @click:author="router.push(`/authors/${$event.id}`)"
          :content="favoriteSermons" @click:button="router.push(`/sermons/${$event.id}`)">
        </ContentPreviewGrid>

        <div v-else class="flex flex-col gap-3 items-center py-4">
          <p class="text-xl mb-2">You haven't favorited any sermons yet!</p>
          <div>
            <AppButton to="/sermons" variant="primary">Browse Sermons</AppButton>
          </div>
        </div>
      </PageHero>

      <!-- Favorite Devotionals -->
      <PageHero>
        <div class="flex justify-center">
          <h1
            class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b] to-[#57687f] text-transparent bg-clip-text">
            Favorited Devotionals
          </h1>
        </div>
        <Divider></Divider>

        <ContentPreviewGrid v-if="favoriteDevotionals?.length" @click:author="router.push(`/authors/${$event.id}`)"
          :content="favoriteDevotionals" @click:button="router.push(`/devotionals/${$event.id}`)">
        </ContentPreviewGrid>
        <div v-else class="flex flex-col gap-3 items-center py-4">
          <p class="text-xl mb-2">You haven't favorited any devotionals yet!</p>
          <div>
            <AppButton to="/devotionals" variant="primary">Browse Devotionals</AppButton>
          </div>
        </div>
      </PageHero>

      <div class="flex flex-row justify-center items-center mb-16">
        <AppButton variant="primary-outline" to="/auth/log-out">Log Out</AppButton>
      </div>

    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router"
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import PageHero from '../../components/molecules/PageHero.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import { useAuth } from '../../auth/services/AuthService'
import { getUserProfileImage, useUserFavorites, refreshUser } from '../services/UserService'
import Badge from '../../components/molecules/Badge.vue'
import ContentPreviewGrid from '../../components/molecules/ContentPreviewGrid.vue'
import { getUserFavoriteDevotionals } from '../../devotionals/services/DevotionalService'
import { getUserFavoriteSermons } from '../../sermons/services/SermonService'
import Divider from '../../components/atoms/Divider.vue'

const categories = ref<any>([{ name: "Read VOTD", link: "/?votd=t", badge: "book-heart" }, { name: "Are you failing?", link: "", badge: "hands-pray" }, { name: "Are you truly saved?", link: "https://independentbaptist.church/salvation", badge: "cross" }, { name: "Join a Bible-based church.", link: "https://independentbaptist.church/", badge: "church" }]);


const { user } = useAuth()
const { loadFavorites } = useUserFavorites()
const userProfileImage = getUserProfileImage(user.value)

const router = useRouter();

const favoriteDevotionals = ref<any>([]);
const favoriteSermons = ref<any>([]);

onMounted(async () => {
  if (!user.value)
    return router.replace('/')

  const devotionalSearch = await getUserFavoriteDevotionals(user.value.id, 1, 8);
  const sermonSearch = await getUserFavoriteSermons(user.value.id, 1, 8);

  favoriteDevotionals.value = devotionalSearch.items;
  favoriteSermons.value = sermonSearch.items;

  await loadFavorites()
})


async function goToPage(link: string) {
  if (link.startsWith("https://")) {
    window.location.href = link;
  }
  else {
    await router.replace(link);
  }
}
</script>

<style>

</style>