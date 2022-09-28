<template>
  <audio controls :src="props.audioSrc">
  </audio>
</template>

<script setup lang="ts">

const props = defineProps({
  audioSrc: {
    type: String
  }
})

</script>