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

      <!-- Churches -->
      <section class="mb-14" id="church-section">
        <h2 class="font-title text-3xl font-bold mb-2 text-slate-700">Search By Church</h2>
        <ChurchSearchSelection @update:church="onChurchSelected($event)"></ChurchSearchSelection>
      </section>
      <!-- Categories-->
      <section class="mb-14" id="authors-section">
        <h2 class="font-title text-3xl font-bold mb-2 text-slate-700">Featured Preachers</h2>
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <AuthorDisplayCard :link="'/authors/' + author.id" v-for="(author, index) in authors" :key="index"
            :author="author">
          </AuthorDisplayCard>
        </div>
        <div class="flex flex-row justify-center">
          <RouterLink class="text-lg text-slate-600" to="/sermons/authors">View More ></RouterLink>
        </div>
      </section>

      <!-- Authors -->
      <section id="topics-section" class="mb-14">
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

      <!-- Recent Sermons -->
      <section class="mb-14">
        <h2 class="font-title text-3xl font-bold mb-2 text-slate-700">Recent Sermons</h2>
        <SermonsPreviewGrid></SermonsPreviewGrid>
        <div class="flex flex-row justify-center">
          <RouterLink class="text-lg text-slate-600" to="/sermons/search">View More ></RouterLink>
        </div>
      </section>

      <!-- My Plans -->

    </PageContent>
  </AppLayout>



</template>

<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import { onMounted, ref } from 'vue'
import { getSermonCategories } from '../../sermons/services/SermonService'
import PageHero from '../../components/molecules/PageHero.vue'
import SermonsPreviewGrid from '../components/SermonsPreviewGrid.vue'
import { getFeaturedAuthors } from '../../authors/services/AuthorService'
import { Author } from '../../authors/Author'
import { Category } from '../Sermon'
import CategoryDisplayCard from '../../components/molecules/CategoryDisplayCard.vue'
import AuthorDisplayCard from '../../components/molecules/AuthorDisplayCard.vue'
import ChurchSearchSelection from '../../components/organisms/ChurchSearchSelection.vue'
import { Church } from '../../church/Church'
import { useRouter } from 'vue-router'


const categories = ref<Category[]>([])
const authors = ref<Author[]>([])
const router = useRouter()

onMounted(async () => {
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

const onChurchSelected = (church: Church) => {
  router.push(`/sermons/churches/${church.id}`)
}

</script>

<style>
.sermon-card {
  min-width: 25%;
  max-width: 25%;
}
</style>