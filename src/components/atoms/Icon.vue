<template>
  <span class="material-icons-outlined">
    {{ props.iconName }}
  </span>
</template>

<script setup lang="ts">

const props = defineProps(['iconName'])
</script>