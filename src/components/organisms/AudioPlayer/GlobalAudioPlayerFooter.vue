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


const { breakpoint } = useBreakpoint()

const {
  setGlobalAudioState,
  setGlobalAudioPayload,
  globalAudioPayload,
  globalAudioState
} = useGlobalAudioPlayer()


const showPlayer = computed(() => {
  return (globalAudioState.value === AudioPlayerState.playing) || (globalAudioState.value === AudioPlayerState.paused)
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