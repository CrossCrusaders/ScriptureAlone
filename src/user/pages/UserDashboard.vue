<template>
  <AppLayout>
    <PageContent>

      <PageHero>
        <template v-slot:image>

          <img :src="userProfileImage" class="object-cover max-h-32 w-32 h-32 max-w-32 rounded-full" />

        </template>

        <h2 class="text-4xl font-bold mb-2 text-slate-900">Hello {{ user?.profile.name }}</h2>
        <p class="text-slate-600">
          We're glad you are here, remember to read the verse of the day!
        </p>
        <template v-slot:actions>
          <AppButton>Watch Now</AppButton>
          <AppButton variant="primary-outline">View All Sermons</AppButton>
        </template>
      </PageHero>

      <div class="hidden md:flex flex-row justify-between items-center mb-16">
        <Badge 
          v-for="(category, index) in categories"
          @click="goToPage(category.link)"
          :icon-name="category.badge"
          :label="category.name"
          :key="index"
          class="cursor-pointer"
        >
        </Badge>
      </div>
      <br>

      <!-- Favorite Devotionals -->
      <PageHero>
        <div class="flex justify-center">
          <h1
            class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b] to-[#57687f] text-transparent bg-clip-text">
            Favorited Devotionals
          </h1>
        </div>
        <Divider></Divider>
        <ContentPreviewGrid @click:author="router.push(`/authors/${$event.id}`)" :content="FavoriteDevotionals"
        @click:button="router.push(`/devotionals/${$event.id}`)">
        </ContentPreviewGrid>
      </PageHero>
      <!-- Favorite Sermons -->
      <PageHero>
        <div class="flex justify-center">
          <h1
            class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#57687f] to-[#1e293b] text-transparent bg-clip-text">
            Favorited Sermons
          </h1>
        </div>
        <Divider></Divider>
        <ContentPreviewGrid @click:author="router.push(`/authors/${$event.id}`)" :content="FavoriteSermons"
        @click:button="router.push(`/sermons/${$event.id}`)">
        </ContentPreviewGrid>
      </PageHero>

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
import { getUserProfileImage } from '../services/UserService'
import Badge from '../../components/molecules/Badge.vue'
import ContentPreviewGrid from '../../components/molecules/ContentPreviewGrid.vue'
import { getRecentDevotionals } from '../../devotionals/services/DevotionalService'
import { getRecentSermons } from '../../sermons/services/SermonService'
import Divider from '../../components/atoms/Divider.vue'

const categories = ref<any>([{ name:"Read VOTD", link:"/#VOTD", badge:"book-heart" }, { name:"Are you failing?", link:"", badge:"hands-pray" }, { name:"Are you truly saved?", link:"https://independentbaptist.church/salvation", badge:"cross" }, { name:"Join a Bible-based church.", link:"https://independentbaptist.church/", badge:"church" }]);


const { user } = useAuth()
const userProfileImage = getUserProfileImage(user.value)

const router = useRouter();

const FavoriteDevotionals = ref<any>([]);
const FavoriteSermons = ref<any>([]);

onMounted(async () => {
  const DevotionalsPromise = await getRecentDevotionals(1, 8);
  const SermonsPromise = await getRecentSermons(1, 8);
  FavoriteDevotionals.value = DevotionalsPromise;
  FavoriteSermons.value = SermonsPromise;
})


async function goToPage(link:string){
  if(link.startsWith("https://")){
    window.location.href = link;
  }
  else{
    await router.replace(link);
  }
}

const emit = defineEmits([
  'click:button',
  'click:author'
])
</script>

<style>

</style>