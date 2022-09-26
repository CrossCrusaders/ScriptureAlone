<template>
  <select>
    <option></option>
  </select>
</template>

<script setup lang="ts">

export interface AppSelectOption {
  label: string
  value: any
}

const props = defineProps({
  options: {}
})
</script>