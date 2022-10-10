<template>
  <AppLayout>
    <!-- Search Hero -->
    <div class="flex flex-col items-center mb-24">
      <img class="object-contain max-h-40 md:max-h-80 block mb-4" src="/logo-bible.png" />
      <h1
        class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b] to-[#57687f] text-transparent bg-clip-text">
        Scripture Alone</h1>
      <p class="font-body text-lg mb-2">Sound Doctrine Guaranteed</p>
      <form @submit="handleSearchSubmit($event)">
        <AppInput v-model="searchModel" class="w-80" placeholder="Search The Scripture"></AppInput>
      </form>
    </div>

    <!-- Calls To Action -->
    <div class="flex flex-col md:flex-row gap-2 items-center justify-between mb-24 p-2">
      <a :class="callToActionItemClass" href="#VOTD">
        <Icon icon-name="book-cross" :class="[callToActionIconClass]" :size="16">
        </Icon>
        <span class="text-center whitespace-nowrap text-ellipsis">Verse of the day</span>
      </a>
      <RouterLink :class="callToActionItemClass" to="/devotionals">
        <Icon icon-name="notebook-edit" :class="[callToActionIconClass]" :size="16">
        </Icon>
        Devotionals
      </RouterLink>
      <RouterLink :class="callToActionItemClass" to="/sermons">
        <Icon icon-name="cross" :class="[callToActionIconClass]" :size="16">
        </Icon>
        Sermons
      </RouterLink>
    </div>

    <!-- Verse of the Day-->
    <div class="flex flex-col gap-8 items-center mb-24 p-2" id="VOTD">
      <h2
        class="font-bold font-title text-6xl text-center bg-gradient-to-r from-[#57687f] to-[#1e293b] text-transparent bg-clip-text pb-1">
        Verse of the Day</h2>
      <div class="rounded-lg border-2 border-solid border-gray-800 p-8 max-w-prose">
        <h3 v-html="verseName" id="verseName" class="font-title font-bold text-3xl text-gray-800 mb-8"></h3>
        <p v-html="verseText" id="verseText" class="text-xl"></p>
      </div>
    </div>

    <!-- Page Divider -->
    <Divider></Divider>

    <!-- Latest Devotionals Mobile-->
    <div class="relative p-2 md:p-8 mb-16">
      <h2 class="font-bold font-title mb-8 md:mb-16 text-4xl">Recommended Devotionals</h2>
      <ContentCarousel :slides="devotionalSlides"></ContentCarousel>
    </div>



    <!-- Latest Devotionals -->
    <div class="relative p-2 md:p-8 mb-16">
      <h2 class="font-bold font-title mb-8 md:mb-16 text-4xl">Recommended Sermons</h2>
      <ContentCarousel :slides="sermonSlides"></ContentCarousel>
    </div>

  </AppLayout>
</template>

<style>
.verse-number {
  padding-right: 0.5em;
  font-weight: bold;
}
</style>

<script setup lang="ts">


import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppInput from '../../components/atoms/form-controls/AppInput.vue'
import { ref, onMounted } from 'vue'
import Divider from '../../components/atoms/Divider.vue'
import ContentCarousel from '../../components/molecules/ContentCarousel.vue'
import { useBreakpoint } from '../../browser/ViewportService'
import { getVerseOfTheDay, isBibleReference } from '../../bible/services/BibleService'
import Icon from '../../components/atoms/Icon.vue'
import { useRouter } from 'vue-router'

const verseName = ref("")
const verseText = ref("")

onMounted(async () => {
  var htmlVerse = await getVerseOfTheDay()

  verseName.value = htmlVerse.verseReference + " KJV";
  verseText.value = htmlVerse.verseText;
})

const searchModel = ref('')
const callToActionItemClass = ['cta-item border-slate-700', 'w-full', 'cursor-pointer', 'bg-slate-200',
  'rounded-xl', 'pl-4', 'pr-4', 'pt-16', 'pb-16', 'flex', 'flex-col', 'items-center', 'text-slate-900',
  'justify-center', 'text-4xl', 'font-bold', 'font-title', 'hover:bg-slate-800', 'hover:text-white', 'transition-all']

const callToActionIconClass = 'cta-icon mb-2'

const devotionalSlides = [
  {
    image: '',
    title: 'Devo 1'
  },
  {
    image: '',
    title: 'Devo 2'
  },
  {
    image: '',
    title: 'Devo 3'
  },
  {
    image: '',
    title: 'Devo 4'
  },
  {
    image: '',
    title: 'Devo 5'
  }, {
    image: '',
    title: 'Devo 6'
  }
]

const sermonSlides = [
  {
    image: '',
    title: 'Sermon 1'
  },
  {
    image: '',
    title: 'Sermon 2'
  },
  {
    image: '',
    title: 'Sermon 3'
  },
  {
    image: '',
    title: 'Sermon 4'
  },
  {
    image: '',
    title: 'Sermon 5'
  }, {
    image: '',
    title: 'Sermon 6'
  }
]

const { breakpoint } = useBreakpoint()

const router = useRouter()

const handleSearchSubmit = async (event: Event) => {
  event.preventDefault()
  if (searchModel.value && searchModel.value.length) {
    const result = await isBibleReference(searchModel.value)
    if (result) {
      return router.push(`/bible?t=ENGKJV&c=${result.chapter}&b=${result.book_id}&vs=${result.verse_start}&ve=${result.verse_end}`)
    } else {
      return router.push(`/bible/search?q=${encodeURI(searchModel.value.substring(0, 255))}`)
    }
  }

}
</script>

<style>
.cta-item .cta-icon {
  filter: invert(0);
  transition: filter 150ms ease;
}

.cta-item:hover .cta-icon {
  filter: invert(1);
}
</style>