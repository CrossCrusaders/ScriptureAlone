<template>
  <AppLayout>
    <PageContent>

      <PageHero>
        <template v-slot:image>
          <img src="/logo-bible.png" class="object-contain hidden md:block max-h-32" />
        </template>
        <h2 class="text-4xl font-bold mb-2 text-slate-900">Featured</h2>
        <p class="text-slate-600">
          Be sure to checkout the featured sermons this week and get the most out of your bible.
          We pray it will be edifying to the listener and help you grow in your walk with Christ.
        </p>
        <template v-slot:actions>
          <AppButton>Watch Now</AppButton>
          <AppButton variant="primary-outline">View All Sermons</AppButton>
        </template>
      </PageHero>

      <!-- Categories-->
      <div class="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
        <AuthorDisplayCard v-for="(author, index) in authors" :key="index" :author="author">
        </AuthorDisplayCard>
      </div>

      <!-- Authors -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
        <CategoryDisplayCard v-for="(category, index) in categories" :category="category" :key="index">
        </CategoryDisplayCard>
      </div>


      <Divider class="mb-16"></Divider>


      <SermonsPreviewGrid></SermonsPreviewGrid>


      <!-- My Plans -->

    </PageContent>
  </AppLayout>

</template>

<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import Badge from '../../components/molecules/Badge.vue'
import { onMounted, reactive, ref } from 'vue'
import Icon from '../../components/atoms/Icon.vue'
import Divider from '../../components/atoms/Divider.vue'
import { getFeaturedSermon, getRecentSermons, getSermonCategories } from '../../sermons/services/SermonService'
import PageHero from '../../components/molecules/PageHero.vue'
import ContentPreviewCard from '../../components/molecules/ContentPreviewCard.vue'
import { useRouter } from 'vue-router'
import SermonsPreviewGrid from '../components/SermonsPreviewGrid.vue'
import { getFeaturedAuthors } from '../../authors/services/AuthorService'
import { Author } from '../../authors/Author'
import { Category } from '../Sermon'
import CategoryDisplayCard from '../../components/molecules/CategoryDisplayCard.vue'
import AuthorDisplayCard from '../../components/molecules/AuthorDisplayCard.vue'

const router = useRouter()

const loading = true

const categories = ref<Category[]>([])
const authors = ref<Author[]>([])

const sermons = ref<any>([])

const page = ref(1)
const countPerPage = 8

onMounted(async () => {
  // const featuredSermonPromise = getFeaturedSermon()
  const categoriesPromise = getSermonCategories()
  const authorsPromise = getFeaturedAuthors()

  const [
    // featuredSermon,
    authorsResult,
    sermonCategories
  ] = await Promise.all([
    // featuredSermonPromise,
    authorsPromise,
    categoriesPromise
  ])

  categories.value = sermonCategories.slice(0, 3)
  authors.value = authorsResult.slice(0, 3)
})

</script>

<style>
.sermon-card {
  min-width: 25%;
  max-width: 25%;
}
</style>