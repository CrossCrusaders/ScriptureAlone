<template>
  <div class="flex flex-row justify-center">
    <audio ref="audioEl" class="w-full max-w-prose" controls :src="props.audioSrc">
    </audio>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { AudioPlayerState } from './AudioPlayerService';

export interface AudioPlayerProps {
  audioSrc?: string
  state?: AudioPlayerState
}


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

</script>
