<template>
  <span :class="[`mdi mdi-${props.iconName}`]" :style="iconStyles"></span>
</template>

<script setup lang="ts">

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
    default: 24
  },
  invert: {
    type: Boolean,
    default: false
  },
  color: {
    type: String
  }
})

const iconSrc = computed(() => {
  return `/mdi/${props.iconName}.svg`
})

const iconStyles = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    'font-size': `${props.size}px`,
    color: props.color
  }
})


</script>
