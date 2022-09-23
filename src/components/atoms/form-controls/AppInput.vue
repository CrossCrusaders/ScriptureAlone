<template>
  <div class="mb-4">
    <label class="block text-slate-600 font-bold">
      <slot></slot>
    </label>
    <input v-bind="$attrs" :value="props.modelValue" @input="handleInput" :class="[inputClass]" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps([
  'isError',
  'modelValue'
])
const emit = defineEmits([
  'update:modelValue'
])
const inputClass = `border-solid border-2 border-slate-400 shadow-lg rounded-full bg-slate-100 block w-full py-2 px-4 focus:border-slate-800 focus:bg-white outline-none box-border`
const errorClass = ref(props.isError ? 'border-red-500' : 'border-gray-800')

watch(props.isError, () => {
  errorClass.value = props.isError ? 'border-red-500' : 'border-gray-800'
})

const handleInput = (newVal: any) => {
  emit('update:modelValue', newVal.target.value)
}
</script>
