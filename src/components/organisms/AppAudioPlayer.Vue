<template>
  <div>
    <audio controls :src="props.audioSrc">
    </audio>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  audioSrc: {
    type: String
  }
})

</script>
