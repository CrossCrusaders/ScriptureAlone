<template>
  <div class="flex flex-row justify-center">
    <audio v-on:ended="onEnded()" ref="audioEl" class="w-full max-w-prose" controls controlslist="nodownload" :src="props.audioSrc">
    </audio>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { AudioPlayerState, useGlobalAudioPlayer } from './AudioPlayerService';
import Config from '../../../config/services/ConfigService';

export interface AudioPlayerProps {
  audioSrc?: string
  state?: AudioPlayerState
}

const {
  setGlobalAudioState,
  setGlobalAudioPayload,
  globalAudioPayload,
  globalAudioState
} = useGlobalAudioPlayer()

const audioEl = ref(null)

const props = defineProps<AudioPlayerProps>()

watch(() => props.state, (currentState) => {
  const el = (audioEl.value! as HTMLAudioElement)

  if (currentState === AudioPlayerState.playing) {
    el.play()
  } else {
    el.pause()
  }
})

onMounted(() => {
  const el = (audioEl.value! as HTMLAudioElement)
  if (props.state === AudioPlayerState.playing) {
    el.play()
  }
})

function onEnded(){
  if(props.audioSrc?.includes(Config.bibleAudioUrl)){
    setGlobalAudioState(AudioPlayerState.nextChapter);
  }
}
</script>
