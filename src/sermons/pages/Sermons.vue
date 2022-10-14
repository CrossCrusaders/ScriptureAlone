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
      <section class="mb-14" id="topics-section">
        <h2 class="font-title text-3xl font-bold mb-2 text-slate-700">Featured Preachers</h2>
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <AuthorDisplayCard :link="'/sermons/authors/' + author.id" v-for="(author, index) in authors" :key="index"
            :author="author">
          </AuthorDisplayCard>
        </div>
        <div class="flex flex-row justify-center">
          <RouterLink class="text-lg text-slate-600" to="/sermons/authors">View More ></RouterLink>
        </div>
      </section>

      <!-- Authors -->
      <section id="authors-section" class="mb-14">
        <h2 class="font-title text-3xl font-bold mb-2 text-slate-700">Daily Topics</h2>
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <CategoryDisplayCard :link="'/sermons/topics/' + category.key" v-for="(category, index) in categories"
            :category="category" :key="index">
          </CategoryDisplayCard>
        </div>
        <div class="flex flex-row justify-center">
          <RouterLink class="text-lg text-slate-600" to="/sermons/topics">View More ></RouterLink>
        </div>
      </section>

      <!-- <Divider class="mb-16"></Divider> -->
      <!-- Recent Sermons -->
      <section class="mb-14">
        <h2 class="font-title text-3xl font-bold mb-2 text-slate-700">Recent Sermons</h2>
        <SermonsPreviewGrid></SermonsPreviewGrid>
      </section>

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
  const authorsPromise = getFeaturedAuthors(3)

  const [
    authorsResult,
    sermonCategories
  ] = await Promise.all([
    authorsPromise,
    categoriesPromise
  ])

  categories.value = sermonCategories.slice(0, 3)
  authors.value = authorsResult
})

</script>

<style>
.sermon-card {
  min-width: 25%;
  max-width: 25%;
}
</style>