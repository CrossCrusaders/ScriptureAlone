<template>
  <div class=" pt-4 pb-4 w-full flex flex-row items-center justify-center">
    <div  class="h-1 bg-gray-400" :style="{ width: (props.width ? props.width : 33) + '%'}"></div>
  </div>
</template>

<script setup lang="ts">

  const props = defineProps([
    'width'
  ])
</script>