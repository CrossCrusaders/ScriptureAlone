import { ref } from 'vue'
import { setLocalCacheItem } from '../../../cache/services/LocalStorageService'

export enum AudioPlayerState {
  paused, // visible stopped
  playing, // visible playing
  hidden,   // hidden stopped
  nextChapter // bible player next chapter
}

const globalAudioPayload = ref<GlobalAudioPayload | null>(null)
const globalAudioState = ref<AudioPlayerState>(AudioPlayerState.hidden)
const audioStateLocalStorageKey = '__global_audio_state__'

export interface GlobalAudioPayload {
  id?: string // TODO: maybe just the URL can serve as ID
  url?: string
  title?: string
  author?: string
  currentTime?: number
  contentPage?: string
  additionalData?: any
}

export function useGlobalAudioPlayer() {
  return {
    setGlobalAudioState(state: AudioPlayerState) {

      globalAudioState.value = state
    },
    setGlobalAudioPayload(payload: GlobalAudioPayload) {
      globalAudioPayload.value = { ...payload }
      setLocalCacheItem(audioStateLocalStorageKey, globalAudioPayload.value, true)
    },
    globalAudioPayload,
    globalAudioState
  }
}