<template>

  <div class="rounded-lg bg-slate-200 p-2 px-4">
    <div class="flex flex-row items-center h-full gap-2">
      <Icon class="mb-3" :icon-name="props.iconName"></Icon>
      <span>{{props.label}}</span>
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