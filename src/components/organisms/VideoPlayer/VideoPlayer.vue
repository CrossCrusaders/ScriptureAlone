<template>
  <div class="flex flex-row justify-center">
    <video ref="videoEl" id="video" autoplay="autoplay" class="w-32 max-w-prose" @click="fullscreen()" :src="props.videoSrc">
    </video>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { VideoPlayerState } from './VideoPlayerService';

export interface VideoPlayerProps {
  videoSrc?: string
  state?: VideoPlayerState
}


const videoEl = ref(null)

const props = defineProps<VideoPlayerProps>()

watch(() => props.state, (currentState) => {
  const el = (videoEl.value! as HTMLVideoElement)

  if (currentState === VideoPlayerState.playing) {
    el.play()
  } else {
    el.pause()
  }
})

onMounted(() => {

  const el = (videoEl.value! as HTMLVideoElement)
  if (props.state === VideoPlayerState.playing) {
    el.play()
  }
})

const fullscreen = function(){
  //@ts-expect-error
  document.getElementById("video").style = "position: absolute; width: 20em;"
}

</script>
