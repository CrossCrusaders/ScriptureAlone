<template>
  <!-- Spacer for the footer-->
  <Transition>
    <div v-if="showPlayer" class="z-10">
      <div class="h-40 md:h-20 bg-slate-800">

      </div>
      <div
        class="z-50 h-40 md:h-20 flex flex-col md:flex-row items-center fixed bottom-0 left-0 right-0 justify-center player-bar bg-red-900 md:gap-4 pt-1 pl-2 pb-0 md:p-4">
        <div class="flex flex-row justify-between md:justify-start md:gap-8 w-full md:w-auto items-start">
          <div v-if="contentPageLink">
            <RouterLink :to="contentPageLink">
              <h2 class="text-white text-md font-title">
                Now Playing:
              </h2>
              <p class="text-white text-md font-bold font-title underline" :title="globalAudioPayload?.title"> {{
                formatDisplayTitle() }}
              </p>
            </RouterLink>
          </div>
          <div v-else>
            <h2 class="text-white text-md font-title">
              Now Playing:
            </h2>
            <p class="text-white text-md font-bold font-title" :title="globalAudioPayload?.title"> {{
              formatDisplayTitle() }}
            </p>
          </div>

          <AppButton v-if="breakpoint === 'sm'" variant="primary-minimal" size="sm" @click="onCloseClicked">
            <Icon color="white" icon-name="close"></Icon>
          </AppButton>
        </div>
        <div class="h-fit md:flex-auto md:max-w-prose w-full p-4 md:p-0">
          <AudioPlayer :state="globalAudioState" :audio-src="globalAudioPayload?.url"></AudioPlayer>
        </div>
        <AppButton v-if="breakpoint === 'md' || breakpoint === 'lg'" variant="primary-minimal" size="sm"
          @click="onCloseClicked">
          <Icon color="white" icon-name="close"></Icon>
        </AppButton>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { AudioPlayerState, useGlobalAudioPlayer } from './AudioPlayerService'
import AudioPlayer from './AudioPlayer.vue';
import AppButton from '../../atoms/form-controls/AppButton.vue';
import Icon from '../../atoms/Icon.vue';
import { useBreakpoint } from '../../../browser/ViewportService';
import { formatMaxLengthText } from '../../../core/services/FormatService'
import { watch, onMounted, ref } from 'vue';
import { BibleBook } from '../../../bible/BibleBook';
import { getBooks } from '../../../bible/services/BibleService';
import Config from '../../../config/services/ConfigService';

const { breakpoint } = useBreakpoint()

const availableBooks = ref<BibleBook[]>([]);
const bookChapters = ref<any>();

const currentBook = ref<any>();
const currentBookChapters = ref<number>();

const {
  setGlobalAudioState,
  setGlobalAudioPayload,
  globalAudioPayload,
  globalAudioState
} = useGlobalAudioPlayer()

onMounted(async () => {
  availableBooks.value = await getBooks();
  bookChapters.value = await (await import("../../../assets/bible/bible-chapters.json")).default
})


const showPlayer = computed(() => {
  return (globalAudioState.value === AudioPlayerState.playing) || (globalAudioState.value === AudioPlayerState.paused) || (globalAudioState.value === AudioPlayerState.nextChapter)
})

const onCloseClicked = () => {
  setGlobalAudioState(AudioPlayerState.hidden)
}

const contentPageLink = computed(() => {
  return globalAudioPayload.value?.contentPage || ''
})

const formatDisplayTitle = () => {
  return breakpoint.value === 'sm' ?
    formatMaxLengthText(globalAudioPayload.value?.title || '',
      34) : globalAudioPayload.value?.title
}

watch(() => globalAudioState.value || globalAudioPayload.value, async (currentValue) => {
  if (currentValue == AudioPlayerState.nextChapter) {
    if (currentBook.value == (undefined || null) || currentBookChapters.value == (undefined || null)) {
      currentBook.value = availableBooks.value.find((book: any) => book.name === globalAudioPayload.value?.additionalData.selectedBook);
      currentBookChapters.value = await (bookChapters.value.find((book: any) => book.name === currentBook.value.name)).chapters;
    }

    let url = Config.bibleAudioUrl;
    let chapter = globalAudioPayload.value?.additionalData.selectedChapterNumber;

    if (globalAudioPayload.value?.additionalData.selectedChapterNumber == currentBookChapters.value) {
      const currentBookIndex = availableBooks.value.findIndex((book: any) => book.name === globalAudioPayload.value?.additionalData.selectedBook);
      if(currentBookIndex + 1 <= 66){
        currentBook.value = availableBooks.value[currentBookIndex + 1];
      }
      else{
        currentBook.value = availableBooks.value[0];
      }
      currentBookChapters.value = await (bookChapters.value.find((book: any) => book.name === currentBook.value.name)).chapters
      chapter = 1;
    }
    else {
      chapter++;
    }

    availableBooks.value.forEach((book, i) => {
      if (book.bookId === currentBook.value.bookId) {
        if (i + 1 < 10)
          url += `0${i + 1}`;
        else
          url += i + 1;

        url += `_${book.name.replace(" ", "")}_`;
      }
    });
    if (chapter > 99)
      url += chapter;
    else if (chapter > 10)
      url += `0${chapter}`
    else
      url += `00${chapter}`
    url += ".mp3"

    await setGlobalAudioPayload({
      id: `${currentBook.value.bookId}.${chapter}`,
      title: `${currentBook.value.name} ${chapter}`,
      author: "",
      currentTime: 0,
      url,
      contentPage: `/bible?b=${currentBook.value.bookId}&c=${currentBookChapters.value}`,
      additionalData: { selectedBookId: currentBook.value.bookId, selectedChapterNumber: chapter, selectedBook: currentBook.value.name }
    })
    await setGlobalAudioState(AudioPlayerState.playing)
  }
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
  transform: translateY(0px);
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-64px);
}

.player-bar {
  box-shadow: 0px -4px 8px 3px rgba(0, 0, 0, .16);
}
</style>