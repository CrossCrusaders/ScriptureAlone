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
      <div class="hidden md:flex flex-row justify-between items-center mb-16">
        <Badge :icon-name="category.iconName" :label="category.label" v-for="(category, index) in categories"
          :key="index">
        </Badge>
      </div>

      <Divider class="mb-16"></Divider>

      <!-- Sermons Display -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-8 mb-24">
        <div v-for="(sermon, index) in sermons" :key="index" class="flex flex-col bg-slate-200 rounded-2xl p-6">
          <h3 class="text-slate-900 text-xl font-title font-bold mb-0">{{ sermon.title }}</h3>
          <p class="text-slate-700 text-sm font-body mb-2">{{ sermon.author.firstName }}&nbsp;{{ sermon.author.lastName
          }}
          </p>
          <p class="text-slate-700 text-md font-body mb-3 break-words">{{ formatDescription(sermon.description) }}</p>
          <p class="text-slate-600 text-md text-sm font-body mb-0">
            Tags:
            <span v-for="(category, innerIndex) in sermon.categories">
              {{ category.label }},&nbsp;
            </span>
          </p>
          <p v-if="sermon.duration" class="text-slate-600 text-md font-body text-sm mb-3">
            Duration: {{ formatMillisecondsAsReadableDuration(sermon.duration) }}
          </p>
          <div class="flex-auto h-8"></div>
          <a :href="'/sermons/' + sermon.id" class="w-full block">
            <AppButton variant="primary" class="w-full">
              View Sermon
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
import Badge from '../../components/molecules/Badge.vue'
import { onMounted, reactive, ref } from 'vue'
import Icon from '../../components/atoms/Icon.vue'
import Divider from '../../components/atoms/Divider.vue'
import { getFeaturedSermon, getRecentSermons, getSermonCategories } from '../../sermons/services/SermonService'
import { formatMillisecondsAsReadableDuration } from '../../core/services/FormatService'
import PageHero from '../../components/molecules/PageHero.vue'


const loading = true

const categories = ref<any>([])

const sermons = ref<any>([])

const page = ref(1)
const countPerPage = 8

onMounted(async () => {

  const featuredSermonPromise = getFeaturedSermon()
  const recentSermomsPromise = getRecentSermons(page.value, countPerPage)
  const categoriesPromise = getSermonCategories()

  const [
    featuredSermon,
    recentSermons,
    sermonCategories
  ] = await Promise.all([
    featuredSermonPromise,
    recentSermomsPromise,
    categoriesPromise
  ])

  categories.value = sermonCategories.items
  sermons.value = recentSermons
})

const formatDescription = (description: string) => {
  const maxLen = 64
  if (description.length < maxLen)
    return description
  return description.substring(0, maxLen - 3) + '...'
}

</script>

<style>
.sermon-card {
  min-width: 25%;
  max-width: 25%;
}
</style>