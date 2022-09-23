<template>
  <AppLayout>
    <!-- Search Hero -->
    <div class="flex flex-col items-center mb-24">
      <img class="object-contain max-h-80 block mb-4" src="/logo-bible.png" />
      <h1 class="font-bold font-title text-3xl mb-2">Scripture Alone</h1>
      <p class="font-body text-lg mb-2">Sound Doctrine Guaranteed</p>
      <AppInput v-model="searchModel" class="w-80" placeholder="Search The Scripture"></AppInput>
    </div>

    <!-- Calls To Action -->
    <div class="flex flex-col md:flex-row gap-2 items-center justify-between mb-24 p-2">
      <a :class="callToActionItemClass">
        <span :class="[callToActionIconClass]">
          menu_book
        </span>
        Verse of the day
      </a>
      <a :class="callToActionItemClass">
        <span :class="[callToActionIconClass]">
          library_books
        </span>
        Devotionals
      </a>
      <a :class="callToActionItemClass">
        <span :class="[callToActionIconClass]">
          emoji_people
        </span>
        Sermons
      </a>
    </div>

    <!-- Verse of the Day-->
    <div class="flex flex-col gap-8 items-center mb-24 p-2">
      <h2 class="font-bold font-title text-6xl text-center">Verse of the Day</h2>
      <div class="rounded-lg border-2 border-solid border-gray-800 p-8 max-w-prose">
        <h3 id="verseName" class="font-title font-bold text-3xl text-gray-800 mb-8">1 Timothy 4:1 KJV</h3>
        <p class="text-xl">Now the Spirit speaketh expressly, that in the latter times some shall depart from the faith, giving heed to seducing spirits, and doctrines of devils;</p>
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

<script setup lang="ts">
  

  import AppLayout from '../components/templates/AppLayout.vue'
  import PageContent from '../components/templates/PageContent.vue'
  import AppInput from '../components/atoms/form-controls/AppInput.vue'
  import { ref, onMounted } from 'vue'
  import Divider from '../components/atoms/Divider.vue'
  import ContentCarousel from '../components/molecules/ContentCarousel.vue'
  import { useBreakpoint } from '../services/ViewportService'
  import { getVerseOfTheDay } from '../services/BibleService'

    onMounted(async () => {
	  getVerseOfTheDay();
    })
 
  const verseOfTheDayModel = ref('')
  const searchModel = ref('')
  const callToActionItemClass = ['border-2', 'border-solid', 'border-gray-800', 'w-full', 
    'rounded', 'pl-4', 'pr-4', 'pt-16', 'pb-16', 'flex', 'flex-col', 'items-center', 
    'justify-center', 'text-4xl', 'font-bold', 'font-title', 'hover:bg-black', 'hover:text-white', 'transition-all']

  const callToActionIconClass = 'material-icons-outlined text-6xl'

  

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
    },{
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
    },{
      image: '',
      title: 'Sermon 6'
    }
  ]

  const { breakpoint } = useBreakpoint()
</script>