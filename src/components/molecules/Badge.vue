<template>

  <div class="rounded-lg bg-slate-200 p-2 px-4">
    <div class="flex flex-row items-center h-full gap-2">
      <Icon :icon-name="props.iconName" class="mb-2"></Icon>
      <span class="mt-1">{{props.label}}</span>
    </div>
  </div>

</template>

<script setup lang="ts">
import Icon from '../atoms/Icon.vue'
// TODO: add configurable color
const props = defineProps([
  'iconName',
  'label'
])
</script>