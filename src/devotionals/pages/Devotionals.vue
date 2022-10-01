<template>
  <AppLayout>
    <PageContent>

      <!-- Devotionals Hero -->
      <div class="rounded-xl bg-slate-200 px-6 py-12 md:py-16 items-center mb-16 md:mt-8">
        <!-- Inner flex parent -->
        <div class="flex flex-col md:flex-row gap-4">
          <img src="/logo-bible.png" class="object-contain hidden md:block max-h-32" />
          <div class=" mb-4 md:mb-0">
            <h2 class="text-4xl font-bold mb-2 text-slate-900">Featured</h2>
            <p class="text-slate-600">
              Be sure to checkout the featured devotionals this week and get the most our of your bible.
              We pray it will be edifying to the listener and help you grow in your walk with Christ.
            </p>
          </div>
          <div class="flex flex-col gap-2 justify-center">
            <AppButton>Watch Now</AppButton>
            <AppButton variant="primary-outline">View All Devotionals</AppButton>
          </div>
        </div>
      </div>

      <!-- Categories-->
      <div class="hidden md:flex flex-row justify-between items-center mb-16">
        <div class="rounded-lg bg-slate-200 p-2 px-4" v-for="(category, index) in categories" :key="index">
          <div class="flex flex-row items-center h-full gap-2">
            <Icon :icon-name="category.iconName"></Icon>
            <span>{{category.label}}</span>
          </div>
        </div>
      </div>

      <Divider class="mb-16"></Divider>

      <!-- Devotionals Display -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-8 mb-24">
        <div v-for="(devotional, index) in devotionals" :key="index" class="flex flex-col bg-slate-200 rounded-2xl p-6">
          <h3 class="text-slate-900 text-xl font-title font-bold mb-0">{{ devotional.title }}</h3>
          <p class="text-slate-700 text-sm font-body mb-2">{{ devotional.author.firstName }}&nbsp;{{ devotional.author.lastName
          }}
          </p>
          <p class="text-slate-700 text-md font-body mb-3">{{ devotional.description }}</p>
          <p class="text-slate-600 text-md text-sm font-body mb-0">
            Tags:
            <span v-for="(category, innerIndex) in devotional.categories">
              {{ category.label }},&nbsp;
            </span>
          </p>
          <p v-if="devotional.duration" class="text-slate-600 text-md font-body text-sm mb-3">
            Duration: {{ formatMillisecondsAsReadableDuration(devotional.duration) }}
          </p>
          <div class="flex-auto h-8"></div>
          <a :href="'/devotionals/' + devotional.id" class="w-full block">
            <AppButton variant="primary" class="w-full">
              View Devotional
            </AppButton>
          </a>
        </div>
      </div>


      <!-- My Plans -->

    </PageContent>
  </AppLayout>

</template>

<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import { onMounted, reactive, ref } from 'vue'
import Icon from '../../components/atoms/Icon.vue'
import Divider from '../../components/atoms/Divider.vue'
import { getFeaturedDevotional, getRecentDevotionals, getDevotionalCategories } from '../../devotionals/services/DevotionalService'
import { formatMillisecondsAsReadableDuration } from '../../core/services/FormatService'


const loading = true

const categories = ref<any>([])

const devotionals = ref<any>([])

const page = ref(1)
const countPerPage = 8

onMounted(async () => {

  const featuredDevotionalPromise = getFeaturedDevotional()
  const recentDevotionalsPromise = getRecentDevotionals(page.value, countPerPage)
  const categoriesPromise = getDevotionalCategories()

  const [
    featuredDevotional,
    recentDevotionals,
    devotionalCategories
  ] = await Promise.all([
    featuredDevotionalPromise,
    recentDevotionalsPromise,
    categoriesPromise
  ])

  categories.value = devotionalCategories.items
  devotionals.value = recentDevotionals

  console.log(devotionalCategories.items)
  console.log(recentDevotionals)
})

</script>

<style>
.devotional-card {
  min-width: 25%;
  max-width: 25%;
}
</style>