<template>
  <AppLayout>
    <div class=" mb-4 sticky top-0 bg-slate-100 px-2 py-2 md:py-4">
      <PageContent>
        <div class="flex flex-row gap-4 items-center flex-wrap">
          <div class="truncate flex flex-row gap-4 items-center">
            <RouterLink to="/">
              <Icon class="min-w-fit" icon-name="arrow-left"></Icon>
            </RouterLink>
            <h1 class=" truncate text-lg md:text-2xl font-title text-slate-700">
              Search Results: <strong :title="currentQuery">{{
              currentQuery
              }}</strong>
            </h1>
          </div>
          <BibleTranslationSelect v-model="currentBibleId"></BibleTranslationSelect>
          <p class="flex-auto"></p>
          <p class="text-sm sm:text-md">Page
            <AppSelect v-model="currentPage">
              <option v-for="index in currentBibleSearchMeta?.pagination?.total_pages" :key="index">{{ index }}</option>
            </AppSelect> of {{ currentBibleSearchMeta?.pagination?.total_pages }}
          </p>
        </div>
      </PageContent>
    </div>
    <PageContent class="p-2">

      <Spinner color="slate-800" class="mx-auto mt-8" v-if="pageLoading"></Spinner>
      <div v-else class="max-w-prose">
        <div class="p-4 px-4 cursor-pointer border-b-solid hover:bg-slate-200 rounded transition-all"
          v-for="verse of currentBibleSearchData" :key="getReferenceFromVerse(verse)" @click="onVerseClicked(verse)">
          <h3 class="mb-1 text-lg font-title font-semibold">{{ getReferenceFromVerse(verse) }}</h3>
          <span v-html="formatVerseSearchResultText(verse)"></span>
        </div>

        <div class="flex flex-row justify-between">
          <span>
            <a v-if="currentPage != 1" class="py-4 block cursor-pointer underline text-red-700"
              @click="onPreviousPageClicked">Previous Page</a>
          </span>
          <span>
            <a v-if="currentPage != currentBibleSearchMeta?.pagination?.total_pages"
              class="py-4 block cursor-pointer underline text-red-700" @click="onNextPageClicked">Next Page</a>
          </span>
        </div>
      </div>

    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * TODO: implement last 5 search result page caching or something
 * similar so that if the user hits back a few times it will cache
 * the result
 */
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { getUserSetting, setUserSetting, setUserSettings } from '../../user/services/LocalUserSettingsService'
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
import BibleTranslationSelect from '../../components/organisms/BibleTranslationSelect.vue';
import { BiblePageQueryParams } from './BibleReader.vue';
import AppSelect from '../../components/atoms/form-controls/AppSelect.vue';
import { formatMaxLengthText } from '../../core/services/FormatService';
import Icon from '../../components/atoms/Icon.vue';



interface BibleSearchQueryParams {
  q: string
  t?: string
  page?: number | string
}

const resultsPerPage = 25

const route = useRoute()
const router = useRouter()

const currentQuery = ref('')
const currentPage = ref<number | string>(1)
const currentBibleId = ref<string>('ENGKJV')
const currentBibleSearchData = ref<BibleVerse[]>([])
const currentBibleSearchMeta = ref<Partial<BibleSearchMeta>>({})

const availableBooks = ref<BibleBook[]>([])
const availableTranslations = ref<BibleTranslation[]>([])

const pageLoading = ref(true)

onMounted(async () => {

  const queryParams: BibleSearchQueryParams = route.query as any

  let { q, t: bibleId, page } = queryParams

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
  currentPage.value = parseInt(page as string)
  currentBibleId.value = bibleId


  const [books, translations, _] = await Promise.all([getBooks(), getTranslations(), search()])

  availableBooks.value = books
  availableTranslations.value = translations

  pageLoading.value = false

  watch([currentBibleId, currentPage, currentQuery], ([newBibleId], [oldBibleId]) => {
    search()
    if (newBibleId !== oldBibleId) {
      setUserSettings({ lastSearchedBibleId: newBibleId })
    }
  })
})

const search = async () => {
  pageLoading.value = true
  try {
    router.replace({ path: '/bible/search', query: { q: currentQuery.value, bibleId: currentBibleId.value, page: currentPage.value } })
    const { data, meta } = await searchBible(currentBibleId.value, currentQuery.value, currentPage.value as number, resultsPerPage)

    currentBibleSearchData.value = data
    currentBibleSearchMeta.value = meta
    window.scrollTo({ top: 0 })
  }
  finally {
    pageLoading.value = false
  }
}

const formatVerseSearchResultText = (verse: BibleVerse) => {
  // TODO: when we implement our own search API we can tokenize searching with \b
  // const verseText = verse.verse_text.replace(new RegExp('\\b(' + currentQuery.value + ')\\b', 'ig'), `<strong>$1</strong>`)
  const verseText = verse.verse_text.replace(new RegExp('(' + currentQuery.value + ')', 'ig'), `<strong>$1</strong>`)
  // return `<span>${getReferenceFromVerse(verse)}</span> - <span>${verseText}</span>` // INLINE REFERENCE FORMAT
  return `<span>${verseText}</span>` // TEXT ONLY FORMAT
}
const onVerseClicked = (verse: BibleVerse) => {
  router.push({
    path: '/bible', query: {
      t: currentBibleId.value,
      b: verse.book_id,
      c: verse.chapter,
      vs: verse.verse_start,
      ve: verse.verse_end
    }
  })
}

const onPreviousPageClicked = () => {
  let nextValue
  if (typeof currentPage.value == 'string') {
    nextValue = parseInt(currentPage.value) - 1
  } else {
    nextValue = currentPage.value - 1
  }
  currentPage.value = nextValue
}

const onNextPageClicked = () => {
  let nextValue
  if (typeof currentPage.value == 'string') {
    nextValue = parseInt(currentPage.value) + 1
  } else {
    nextValue = currentPage.value + 1
  }
  currentPage.value = nextValue
}
</script>