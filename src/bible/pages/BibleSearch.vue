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
          <p class="flex-auto"></p>
          <p class="text-sm sm:text-md">Page
            <AppSelect v-model="currentPage">
              <option v-for="index in currentBibleSearchMeta?.pagination?.total_pages" :key="index">{{ index }}</option>
            </AppSelect> of {{ currentBibleSearchMeta?.pagination?.total_pages }}
          </p>
        </div>
      </PageContent>
    </div>
    <div class="w-full flex justify-center">
      <form class="w-full md:w-1/2 lg:w-1/3" @submit="handleSearchSubmit($event)">
        <div class="px-2">
          <AppInput type="input" name="query" v-model="searchModel" placeholder="Search The Scripture">
            <template v-slot:prefix>
              <Icon icon-name="magnify"></Icon>
            </template>
          </AppInput>
          <AppButton variant="primary-light" class="block w-full md:hidden mt-4" type="submit">Search</AppButton>
        </div>
      </form>
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
import { BibleBook } from '../BibleBook';
import { BibleVerse } from '../BibleVerse';
import {
  BibleSearchMeta,
  getBooks,
  searchBible,
  getReferenceFromVerse
} from '../services/BibleService';
import Spinner from '../../components/atoms/Spinner.vue';
import AppSelect from '../../components/atoms/form-controls/AppSelect.vue';
import AppButton from '../../components/atoms/form-controls/AppButton.vue';
import AppInput from '../../components/atoms/form-controls/AppInput.vue';
import Icon from '../../components/atoms/Icon.vue';
import {
  isBibleReference,
} from "../../bible/services/BibleService";



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
const currentBibleSearchData = ref<BibleVerse[]>([])
const currentBibleSearchMeta = ref<Partial<BibleSearchMeta>>({})

const availableBooks = ref<BibleBook[]>([])

const pageLoading = ref(true)

onMounted(async () => {

  const queryParams: BibleSearchQueryParams = route.query as any

  let { q, page } = queryParams

  // If there is no query, redirect to the home page
  if (!q)
    router.push('/')

  if (!page)
    page = 1

  currentQuery.value = q
  currentPage.value = parseInt(page as string)

  const [books, _] = await Promise.all([getBooks(), search()])

  availableBooks.value = books

  pageLoading.value = false

  watch([currentPage, currentQuery], () => {
    search()
  })
})

const search = async () => {
  pageLoading.value = true
  try {
    router.push({ path: '/bible/search', query: { q: currentQuery.value, page: currentPage.value } })
    const { data, meta } = await searchBible(currentQuery.value, currentPage.value as number, resultsPerPage)

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
  const verseText = verse.verse_text?.replace(new RegExp('(' + currentQuery.value + ')', 'ig'), `<strong>$1</strong>`)
  // return `<span>${getReferenceFromVerse(verse)}</span> - <span>${verseText}</span>` // INLINE REFERENCE FORMAT
  return `<span>${verseText}</span>` // TEXT ONLY FORMAT
}
const onVerseClicked = (verse: BibleVerse) => {
  router.push({
    path: '/bible', query: {
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

const searchModel = ref("");
const searchTranslationId = ref("ENGKJV");

const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    const result = await isBibleReference(searchModel.value);
    if (result) {
      const { data, meta } = await searchBible(currentQuery.value, currentPage.value as number, resultsPerPage)

      currentBibleSearchData.value = data
      currentBibleSearchMeta.value = meta
      window.scrollTo({ top: 0 })
      return router.push(
        `/bible?t=${searchTranslationId.value}&c=${result.chapter}&b=${result.book_id}&vs=${result.verse_start}&ve=${result.verse_end}`
      );
    } else {
      currentQuery.value = searchModel.value;
      currentPage.value = 1;
      return router.push(
        `/bible/search?q=${encodeURI(
          searchModel.value.substring(0, 255)
        )}&t=${searchTranslationId.value}`
      );
    }
  }
};
</script>