<template>
  <img :class="iconClass" :src="iconSrc" />
</template>

<script setup lang="ts">

// https://materialdesignicons.com/ 

import { computed, useAttrs } from 'vue';

const attrs = useAttrs()

const props = defineProps({
  iconName: {
    type: String,
    default: ''
  },
  iconType: {
    type: String,
    default: 'mdi'
  },
  size: {
    type: Number,
    default: 6
  },
  invert: {
    type: Boolean,
    default: false
  }
})

const iconSrc = computed(() => {
  return `/mdi/${props.iconName}.svg`
})

const iconClass = computed(() => {
  let cssClass = attrs.class
  if (props.size) {
    cssClass += ` w-${props.size} h-${props.size} inline `
  }
  if (props.invert) {
    cssClass += ` invert `
  }

  return cssClass
})

</script>

<style scoped>
img {
  /* width: 24px;
  height: 24px; */
  object-fit: contain;
}
</style>