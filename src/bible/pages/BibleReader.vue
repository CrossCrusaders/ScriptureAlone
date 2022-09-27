<template>
  <AppLayout>
    <PageContent>

      <div class="bible-reader-toolbar flex flex-row mb-4 sticky top-0 pt-4 pb-4 bg-white" style="justify-content: center;">
        <select v-model="selectedBook" class="border-b-[3px] border-solid border-gray-200">
          <option v-for="book of availableBooks" :value="book.id">
            {{book.name}}
          </option>
        </select>

        <select v-model="selectedChapter" class="ml-3 border-b-[3px] border-solid border-gray-200" >
          <option v-for="chapter of availableChapters[selectedBook]" :value="chapter.number">
            {{chapter.number}}
          </option>
        </select>
      </div>
      <div class="bible-reader-content max-w-prose mx-auto leading-loose" v-html="loadedChapter"></div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { getVerses } from '../../bible/services/BibleService'


const availableBooks = ref<any[]>([])
const availableChapters = ref<any>({})
const loadedChapter = ref('')

const selectedBible = ref('ENGKJV')
const selectedBook = ref('JHN')
const selectedChapter = ref(1)

const loadAvailableSelections = async () => {
  const BibleBooks = await import(`../../assets/bible/books.json`)
  const BibleBookChapters = await import(`../../assets/bible/chapters.json`)
  availableBooks.value = BibleBooks.default as any
  availableChapters.value = BibleBookChapters.data
}
const loadChapter = async () => {
  const response = await getVerses(selectedBible.value, selectedBook.value, selectedChapter.value)
  const chapterText = response.reduce((aggregate, verse, index) => {
    return aggregate + `<p class="verse"><span class="verse-number">${verse.verse_start_alt}<span> <span class="verse-text">${verse.verse_text}</span></p> `
  }, "")
  loadedChapter.value = chapterText
}

watch(selectedBook, () => {
  if (selectedChapter.value != 1)
    return selectedChapter.value = 1
  loadChapter()
})

watch(selectedChapter, () => {
  loadChapter()
})

onMounted(async () => {
  loadAvailableSelections()
  loadChapter()
})
</script>

<style>
.bible-reader-content>p {
  text-indent: 1.5em;
}

.bible-reader-content .wj {
  color: theme('colors.red.700');
}
</style>