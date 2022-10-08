<template>
  <AppLayout>
    <PageContent class="p-2">


      <h1 class="text-2xl mb-4 font-title font-bold text-slate-700">Bible Search Results</h1>
      <Spinner color="slate-800" v-if="pageLoading"></Spinner>
      <div v-else>
        <div class="p-4 px-4" v-for="verse of currentBibleSearchData" :key="getReferenceFromVerse(verse)">
          <span class="">{{ getReferenceFromVerse(verse) }}</span> - <span>{{ verse.verse_text }}</span>
        </div>
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { getUserSetting, setUserSetting } from '../../user/services/LocalUserSettingsService'
import { BibleBook } from '../BibleBook';
import { BibleTranslation } from '../BibleTranslation';
import { BibleVerse } from '../BibleVerse';
import {
  bibleIdKjv,
  BibleSearchMeta,
  getBooks,
  getTranslations,
  searchBible,
  getReferenceFromVerse
} from '../services/BibleService';
import Spinner from '../../components/atoms/Spinner.vue';

interface BibleSearchQueryParams {
  q: string
  bibleId?: string
  page?: number
}

const resultsPerPage = 25

const route = useRoute()
const router = useRouter()

const currentQuery = ref('')
const currentPage = ref<number>(1)
const currentBibleId = ref<string>('ENGKJV')
const currentBibleSearchData = ref<BibleVerse[]>([])
const currentBibleSearchMeta = ref<Partial<BibleSearchMeta>>({})

const availableBooks = ref<BibleBook[]>([])
const availableTranslations = ref<BibleTranslation[]>([])

const pageLoading = ref(true)



onMounted(async () => {

  const queryParams: BibleSearchQueryParams = route.query as any

  let { q, bibleId, page } = queryParams

  // If there is no query, redirect to the home page
  if (!q)
    router.replace('/')

  const lastSearchedBibleId = getUserSetting('lastSearchedBibleId')
  // If there is no bible id specified
  // try to grab the last one from the settings
  if (!bibleId) {
    bibleId = (lastSearchedBibleId || getUserSetting('lastReadBibleId') || bibleIdKjv) as string
    if (!lastSearchedBibleId || lastSearchedBibleId !== bibleId)
      setUserSetting('lastSearchedBibleId', bibleId)
  }

  if (!page)
    page = 1

  currentQuery.value = q
  currentPage.value = page
  currentBibleId.value = bibleId

  router.replace({ path: '/bible/search', query: { q: currentQuery.value, bibleId: currentBibleId.value, page: currentPage.value } })

  const [books, translations, bibleSearch] = await Promise.all([getBooks(), getTranslations(), searchBible(currentBibleId.value, currentQuery.value, currentPage.value, resultsPerPage)])

  availableBooks.value = books
  availableTranslations.value = translations
  const { data, meta } = bibleSearch

  currentBibleSearchData.value = data
  currentBibleSearchMeta.value = meta

  pageLoading.value = false

})
</script>