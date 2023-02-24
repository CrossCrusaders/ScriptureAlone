<template>
  <AppLayout>
    <!-- Search Hero -->
    <div class="flex flex-col items-center md:mb-24">
      <RouterLink to="/bible">
        <img class="transition-all hover:rotate-12 hover:scale-105 object-contain max-h-40 md:max-h-60 block md:mb-4"
          src="/logo-bible.png" />
      </RouterLink>
      <div class="flex flex-col items-center">
        <h1 v-if="breakpoint != 'sm'" class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b]
                to-[#57687f] text-transparent bg-clip-text">
          Scripture Alone
        </h1>
        <p v-if="breakpoint != 'sm'" class="font-body text-lg mb-2">Sound Doctrine Guaranteed</p>

        <form class="mb-4 md:mb-0" @submit="handleSearchSubmit($event)">
          <div class="px-2">
            <AppInput type="input" name="query" v-model="searchModel" placeholder="Search The Scripture">
              <template v-slot:prefix>
                <Icon icon-name="magnify"></Icon>
              </template>
              <template v-slot:postfix>
                <BibleTranslationSelect v-model="searchTranslationId"></BibleTranslationSelect>
              </template>
            </AppInput>
            <AppButton variant="primary-light" class="block w-full md:hidden mt-4" type="submit">Search</AppButton>
          </div>
        </form>

        <!-- Page Divider -->
        <Divider v-if="breakpoint == 'sm'"></Divider>

        <!-- Verse of the Day-->
        <Transition name="votdMenu">
          <div v-if="verseText && verseName && breakpoint == 'sm'"
            class="mx-2 flex flex-col gap-2 items-center mb-2 bg-gray-200 p-4 mt-4 rounded-lg">
            <h2 name="votd"
              class="font-bold font-title text-3xl text-center bg-gradient-to-r from-[#57687f] to-[#1e293b] text-transparent bg-clip-text">
              Verse of the Day
            </h2>
            <div class="rounded-lg border-2 border-solid border-gray-800 px-4 p-4 max-w-prose">
              <h3 v-html="verseName" id="verseName" class="font-title font-bold text-2xl md:text-3xl text-gray-800 mb-4">
              </h3>
              <p v-html="verseText" id="verseText" class="text-xl"></p>
            </div>
            <AppButton>
              <RouterLink :to="`/bible?t=${searchTranslationId}&b=${verseBookId}&c=${verseChapter}`">Continue Reading
              </RouterLink>
            </AppButton>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Page Divider -->
    <Divider v-if="breakpoint == 'sm'"></Divider>

    <!-- Calls To Action -->
    <div class="flex flex-col md:flex-row gap-2 items-center justify-between mb-2 md:mb-24 p-2">
      <RouterLink :class="callToActionItemClass" to="/truth-resources">
        <Icon icon-name="book-cross" color="black" hoverColor="text-white" :class="[callToActionIconClass]" :size="56">
        </Icon>
        <span class="text-center text-xl lg:text-4xl">Truth Resources</span>
      </RouterLink>
      <RouterLink :class="callToActionItemClass" to="/sermons">
        <Icon icon-name="cross" color="black" hoverColor="text-white" :class="[callToActionIconClass]" :size="56">
        </Icon>
        <span class="text-xl md:text-2xl lg:text-4xl">Sermons</span>
      </RouterLink>
      <RouterLink :class="callToActionItemClass" to="/devotionals">
        <Icon icon-name="notebook-edit" color="black" hoverColor="text-white" :class="[callToActionIconClass]" :size="56">
        </Icon>
        <span class="text-xl md:text-2xl lg:text-4xl">Devotionals</span>
      </RouterLink>
    </div>

    <!-- Verse of the Day-->
    <div v-if="breakpoint != 'sm'" class="flex flex-col gap-8 items-center mb-24 p-2">
      <h2 id="votd" name="votd"
        class="font-bold font-title text-6xl text-center bg-gradient-to-r from-[#57687f] to-[#1e293b] text-transparent bg-clip-text pb-1">
        Verse of the Day
      </h2>
      <div class="rounded-lg border-2 border-solid border-gray-800 p-8 max-w-prose">
        <h3 v-html="verseName" id="verseName" class="font-title font-bold text-2xl md:text-3xl text-gray-800 mb-8"></h3>
        <p v-html="verseText" id="verseText" class="text-xl"></p>
      </div>
    </div>

    <!-- Page Divider -->
    <Divider></Divider>

    <!-- Latest Sermons -->
    <div class="relative p-2 md:p-8 mb-16">
      <h2 class="font-bold font-title mb-8 md:mb-16 text-4xl">
        Recommended Sermons
      </h2>
      <ContentCarousel :slides="sermonList" base-url="sermons"></ContentCarousel>
    </div>

    <!-- Latest Devotionals -->
    <div class="relative p-2 md:p-8 mb-16">
      <h2 class="font-bold font-title mb-8 md:mb-16 text-4xl">
        Recommended Devotionals
      </h2>
      <ContentCarousel :slides="devoList" base-url="devotionals"></ContentCarousel>
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
import AppLayout from "../../components/templates/AppLayout.vue";
import AppInput from "../../components/atoms/form-controls/AppInput.vue";
import { ref, onMounted } from "vue";
import Divider from "../../components/atoms/Divider.vue";
import ContentCarousel from "../../components/molecules/ContentCarousel.vue";
import {
  getVerseOfTheDay,
  isBibleReference,
} from "../../bible/services/BibleService";
import Icon from "../../components/atoms/Icon.vue";
import { useRouter, useRoute } from "vue-router";
import BibleTranslationSelect from "../../components/organisms/BibleTranslationSelect.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";
import { useBreakpoint } from '../../browser/ViewportService'

import { getSearch } from '../../search/services/SearchService'

const verseName = ref("");
const verseText = ref("");
const verseBookId = ref("");
const verseChapter = ref(0)

let devoList = ref<any[]>([])
let sermonList = ref<any[]>([])

const route = useRoute()

const { breakpoint } = useBreakpoint();

onMounted(async () => {
  console.log(breakpoint.value)
  var htmlVerse = await getVerseOfTheDay();
  verseName.value = htmlVerse.verseReference + " KJV";
  verseText.value = htmlVerse.verseText;
  verseBookId.value = htmlVerse.verseBookId;
  verseChapter.value = htmlVerse.verseChapter;

  const recentDevotionalsPromise = getSearch("devotionals", "", 1, 6, []);
  const recentSermonsPromise = getSearch("sermons", "", 1, 6, []);
  const [recentDevotionals, recentSermons] = await Promise.all([recentDevotionalsPromise, recentSermonsPromise]);

  const defaultImage = '/logo-bible.png'

  devoList.value = recentDevotionals.items
  sermonList.value = recentSermons.items

  if (route.query.votd == 't') {
    document.getElementById("votd")?.scrollIntoView({ behavior: "smooth" });
  }
});

const searchModel = ref("");
const searchTranslationId = ref("ENGKJV");
const callToActionItemClass = [
  "cta-item border-slate-700",
  "md:w-2/6",
  "w-full",
  "h-48",
  "lg:h-64",
  "cursor-pointer",
  "bg-slate-200",
  "rounded-xl",
  "px-4",
  "py-8",
  "md:py-16",
  "flex",
  "flex-col",
  "items-center",
  "text-slate-900",
  "justify-center",
  "text-4xl",
  "font-bold",
  "font-title",
  "hover:bg-slate-800",
  "hover:text-white",
  "transition-all",
];

const callToActionIconClass = "cta-icon mb-2";

const router = useRouter();

const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    const result = await isBibleReference(searchModel.value);
    if (result) {
      return router.push(
        `/bible?t=${searchTranslationId.value}&c=${result.chapter}&b=${result.book_id}&vs=${result.verse_start}&ve=${result.verse_end}`
      );
    } else {
      return router.push(
        `/bible/search?t=${searchTranslationId.value}&q=${encodeURI(
          searchModel.value.substring(0, 255)
        )}`
      );
    }
  }
};
</script>

<style>
.cta-item .cta-icon {
  filter: invert(0);
  transition: filter 150ms ease;
}

.cta-item:hover .cta-icon {
  filter: invert(1);
}

.votdMenu-enter-active,
.votdMenu-leave-active {
  animation: bounce-in 0.7s ease;
  max-height: 100%;
}

.votdMenu-enter-from,
.votdMenu-leave-to {
  /* transform: scale(0); */
  opacity: 0;
  max-height: 0;
}

@keyframes bounce-in {
  0% {
    transform: translateY(-10em);
    opacity: 0;
  }

  50% {
    transform: translateY(-10em);
    opacity: 0;
  }

  100% {
    transform: translateY(0em);
    opacity: 1;
  }
}
</style>
