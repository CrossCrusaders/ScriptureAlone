<template>
  <AppButton size="sm" v-bind="$attrs" variant="minimal" @click="emit('click')">
    <Icon :invert="props.invert && !props.isFavorite" :icon-name="props.isFavorite ? 'heart-red' : 'heart-outline'">
    </Icon>
  </AppButton>
</template>

<script setup lang="ts">
import AppButton from './form-controls/AppButton.vue'
import Icon from './Icon.vue'

const props = defineProps([
  'isFavorite',
  'invert'
])
const emit = defineEmits(['click'])

</script>