<template>
  <select v-bind="$attrs" :value="props.modelValue" @input="handleInput"
    class="active:outline-none focus:outline-none border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2 cursor-pointer">
    <option v-if="props.placeholder" value="" disabled selected>{{ props.placeholder }}</option>
    <slot></slot>
  </select>
</template>

<script setup lang="ts">


const props = defineProps([
  'modelValue',
  'placeholder'
])
const emit = defineEmits([
  'update:modelValue'
])

const handleInput = (newVal: any) => {
  emit('update:modelValue', newVal.target.value)
}

</script>