<template>
  <div class="flex flex-row justify-center">
    <video ref="videoEl" id="video" autoplay="true" class="w-32 max-w-prose" :src="props.videoSrc">
    </video>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { VideoPlayerState, useGlobalVideoPlayer } from './VideoPlayerService';

export interface VideoPlayerProps {
  videoSrc?: string
  state?: VideoPlayerState
}

const {
  setGlobalVideoPayload,
  setGlobalVideoState,
  globalVideoState
} = useGlobalVideoPlayer()


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

</script>
