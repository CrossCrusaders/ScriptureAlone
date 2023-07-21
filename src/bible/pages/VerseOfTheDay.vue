<template>
  <AppLayout>
    <!-- Search Hero -->
    <div class="flex flex-col items-center md:mb-24 w-full">
      <div class="flex flex-col items-center w-full">
        <!-- Text -->
        <h2 name="votd" class="font-bold font-title text-3xl md:text-4xl lg:text-5xl text-center bg-gradient-to-r from-[#57687f] to-[#1e293b] text-transparent bg-clip-text">
          Verse of the Day
        </h2>

        <!-- Page Divider -->
        <Divider class="w-2/3"></Divider>

        <!-- Verse of the Day-->
        <Transition name="votdMenu">
          <div v-if="verseText && verseName"
            class="mx-2 flex flex-col gap-2 items-center mb-2 bg-gray-200 p-4 mb-4 rounded-lg lg:w-1/2">
            <div class="rounded-lg border-2 border-solid border-gray-800 px-4 p-4 max-w-prose w-full flex flex-col text-center">
              <h3 v-html="verseName" id="verseName" class="font-title font-bold text-2xl md:text-3xl text-gray-800 mb-4">
              </h3>
              <p v-html="verseText" id="verseText" class="text-xl"></p>
            </div>
            <AppButton>
              <RouterLink :to="`/bible?b=${verseBookId}&c=${verseChapter}`">Continue Reading
              </RouterLink>
            </AppButton>
          </div>
        </Transition>
      </div>
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
import { ref, onMounted } from "vue";
import Divider from "../../components/atoms/Divider.vue";
import { getVerseOfTheDay } from "../../bible/services/BibleService";

const verseName = ref("");
const verseText = ref("");
const verseBookId = ref("");
const verseChapter = ref(0)

onMounted(async () => {
  var htmlVerse = await getVerseOfTheDay(); // { verseReference: "1 Chronicles 1:1", verseText: "Adam, Sheth, Enosh,", verseBookId: "1CH", verseChapter: 1 }
  verseName.value = htmlVerse.verseReference;
  verseText.value = htmlVerse.verseText;
  verseBookId.value = htmlVerse.verseBookId;
  verseChapter.value = htmlVerse.verseChapter;
});
</script>

<style>
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
