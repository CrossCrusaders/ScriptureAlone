<template>
  <img :class="[$attrs.class ? $attrs.class : 'w-6 h-6 fill-slate-800' ]" v-if="props.iconType === 'mdi'"
    :src="iconSrc" />
</template>

<script setup lang="ts">

// https://materialdesignicons.com/ 

import { computed } from 'vue';

const props = defineProps({
  iconName: {
    type: String,
    default: ''
  },
  iconType: {
    type: String,
    default: 'mdi'
  }
})

const iconSrc = computed(() => {
  return `/mdi/${props.iconName}.svg`
})

</script>

<style scoped>
img {
  /* width: 24px;
  height: 24px; */
  object-fit: contain;
}
</style>