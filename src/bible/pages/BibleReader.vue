<template>
  <AppLayout>
    <PageContent>

      <div class="bible-reader-toolbar flex flex-row mb-4" style="position:sticky; top:0px; padding-top:1em; padding-bottom:1em; background-color:white;">
        <select v-model="selectedBook" style="border-bottom:3px solid whitesmoke;">
          <option v-for="book of availableBooks" :value="book.id">
            {{book.name}}
          </option>
        </select>

        <select v-model="selectedChapter" class="ml-3" style="border-bottom:3px solid whitesmoke;">
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
import { getChapter } from '../../bible/services/BibleService'


const availableBooks = ref<any[]>([])
const availableChapters = ref<any>({})
const loadedChapter = ref('')
const selectedBook = ref('JHN')
const selectedChapter = ref(1)

const loadAvailableSelections = async () => {
  const BibleBooks = await import(`../../assets/bible/books.json`)
  const BibleBookChapters = await import(`../../assets/bible/chapters.json`)
  availableBooks.value = BibleBooks.default as any
  availableChapters.value = BibleBookChapters.data
}
const loadChapter = async () => {
  const response = await getChapter(selectedBook.value, selectedChapter.value)
  loadedChapter.value = response.content
}

watch(selectedBook, () => {
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