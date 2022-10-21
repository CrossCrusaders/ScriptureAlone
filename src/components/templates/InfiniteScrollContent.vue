<template>

  <slot></slot>
  <div ref="bottomEl"></div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['scroll:end'])

const bottomEl = ref<HTMLElement | null>(null)
const entryTriggered = ref<boolean>(false)


const isTriggerInViewport = () => {
  if (!bottomEl.value)
    return false

  const { innerWidth, innerHeight } = window
  const boundingRect = bottomEl.value?.getBoundingClientRect()

  return (boundingRect.top >= 0
    && boundingRect.left >= 0
    && boundingRect.right <= innerWidth
    && boundingRect.bottom <= innerHeight)
}

const onScroll = async (first: boolean) => {
  const isInViewport = isTriggerInViewport()
  if (isInViewport && !entryTriggered.value) {
    entryTriggered.value = true
    emit('scroll:end', first)
  } else if (!isInViewport) {
    entryTriggered.value = false
  }
}

const onScrollNotFirst = onScroll.bind(null, false)

onMounted(() => {
  window.addEventListener('scroll', onScrollNotFirst)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScrollNotFirst)
})

</script>