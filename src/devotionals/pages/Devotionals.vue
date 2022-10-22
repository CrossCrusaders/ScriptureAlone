<template>
  <AppLayout>
    <PageContent>

      <!-- Devotionals Hero -->
      <PageHero>
        <template v-slot:image>
          <img src="/logo-bible.png" class="object-contain hidden md:block max-h-32" />
        </template>
        <h2 class="text-4xl font-bold mb-2 text-slate-900">Daily Devotionals</h2>
        <p class="text-slate-600 max-w-prose">
          Find devotionals that will encourage you as you walk with the Lord. Devotionals are great way to enhance your
          daily bible reading program
          and find help in a time of need for whatever you may be facing. We pray you are encouraged.
        </p>
        <template v-slot:actions>
          <!-- <AppButton>Read Now</AppButton> -->
        </template>
      </PageHero>

      <form @submit="handleSearchSubmit($event)" class="flex justify-center mb-10">
        <div class="px-2 w-full md:w-1/2">
          <AppInput id="searchBar" type="input" name="query" v-model="searchModel" placeholder="Search Devotionals">
            <template v-slot:postfix>
              <Icon icon-name="magnify"></Icon>
            </template>
          </AppInput>
          <AppButton variant="primary-light" class="block w-full md:hidden mt-4" type="submit">Search</AppButton>
        </div>
      </form>

      <!-- Devotionals Grid Display -->
      <ContentPreviewGrid @click:author="router.push(`/authors/${$event.id}`)" :content="devotionals"
        @click:button="router.push(`/devotionals/${$event.id}`)">
      </ContentPreviewGrid>


      <div class="flex justify-center">
        <button class="text-slate-400 mb-12" @click="nextPage($event)">
          View More >
        </button>
      </div>

      <!-- My Plans -->
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
export interface SearchDevo {
  q: string
  n: number
  s: number
}
import AppLayout from "../../components/templates/AppLayout.vue"
import PageContent from "../../components/templates/PageContent.vue"
import AppButton from "../../components/atoms/form-controls/AppButton.vue"
import { onMounted, ref } from "vue"
import Icon from "../../components/atoms/Icon.vue"
import {
  getFeaturedDevotional,
  getRecentDevotionals,
  getDevotionalCategories,
  searchDevotionals,
} from "../../devotionals/services/DevotionalService"
import PageHero from "../../components/molecules/PageHero.vue"
import { useRouter, useRoute } from "vue-router"
import AppInput from "../../components/atoms/form-controls/AppInput.vue"
import ContentPreviewGrid from "../../components/molecules/ContentPreviewGrid.vue"

const loading = true
const categories = ref<any>([])
const devotionals = ref<any>([])
const search = ref("")
const page = ref(1)
const countPerPage = 8

const searchModel = ref("")

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const queryParams: SearchDevo = route.query as any
  let { q, n, s } = queryParams
  if (q != "" && n && s) {
    searchDevos(q, n, s, false)
  }
  else if (q == "" && n && s) {
    searchDevos("", n, s, true)
  }
  else {
    searchDevos("", 1, 8, true)
  }
})

const handleSearchSubmit = async (event: Event) => {
  event.preventDefault()
  if (searchModel.value && searchModel.value.length) {
    await router.push(
      `?q=${encodeURI(searchModel.value.substring(0, 255))}&n=1&s=${8}`
    )
    searchDevos(searchModel.value, 1, 8, false)
  } else {
    await router.replace("/devotionals")
    searchDevos("", 1, 8, true)
  }
}

const nextPage = async (event: Event) => {
  event.preventDefault()
  const queryParams: SearchDevo = route.query as any
  let { q, n, s } = queryParams
  if (q != "" && n && s) {
    await router.push(`?q=${encodeURI(q)}&n=${+n + +1}&s=${s}`)
    searchDevos(q, +n + +1, s, false)
  }
  else if (q == "" && n && s) {
    await router.push(`?q=&n=${+n + +1}&s=${s}`)
    searchDevos("", +n + +1, s, true)
  }
  else {
    await router.push(`?q=&n=${2}&s=${8}`)
    searchDevos("", 2, 8, true)
  }
}

async function searchDevos(searchTerm: string, pageNumber: number, pageSize: number, isBlank: boolean) {
  search.value = searchTerm
  if (!isBlank) {
    const searchedDevotionalsTagPromise = await searchDevotionals(searchTerm, pageNumber, pageSize)
    const categoriesPromise = getDevotionalCategories()

    const [
      searchedDevotionalsTag,
      devotionalCategories,
    ] = await Promise.all([
      searchedDevotionalsTagPromise,
      categoriesPromise,
    ])

    categories.value = devotionalCategories.items
    devotionals.value = searchedDevotionalsTag
  } else {
    const featuredDevotionalPromise = getFeaturedDevotional()
    const recentDevotionalsPromise = getRecentDevotionals(
      pageNumber,
      pageSize
    )
    const categoriesPromise = getDevotionalCategories()

    const [featuredDevotional, recentDevotionals, devotionalCategories] =
      await Promise.all([
        featuredDevotionalPromise,
        recentDevotionalsPromise,
        categoriesPromise,
      ])

    categories.value = devotionalCategories.items
    devotionals.value = recentDevotionals
  }
}

const formatSearchResultText = (devo: string) => {
  var searches = search.value.split(" ")
  var Text = ""
  for (let i = 0; i < searches.length; i++) {
    if (i != 0) {
      Text = Text.replace(new RegExp('(' + searches[i] + ')', 'ig'), `<strong>$1</strong>`)
    }
    else {
      Text = devo.replace(new RegExp('(' + searches[i] + ')', 'ig'), `<strong>$1</strong>`)
    }
  }
  return `<span>${Text}</span>`
}
</script>
