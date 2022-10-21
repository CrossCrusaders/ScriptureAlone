<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'


const onScroll = async () => {
  const { scrollY, innerHeight } = window
  const { scrollHeight } = document.documentElement
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

</script>