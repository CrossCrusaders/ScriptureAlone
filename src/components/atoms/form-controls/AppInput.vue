<template>
  <div class="mb-4">
    <label class="block"><slot></slot></label>
    <input 
      v-bind="$attrs"
      :value="props.modelValue"
      @input="handleInput"
      :class="['border-solid border-2  rounded block w-full p-2', errorClass]" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps([
  'isError',
  'modelValue'
])

const emit= defineEmits([
  'update:modelValue'
])

const errorClass = ref(props.isError ? 'border-red-500' : 'border-gray-800')

watch(props.isError, () => {
  errorClass.value = props.isError ? 'border-red-500' : 'border-gray-800'
})

const handleInput = (newVal: any) => {
  emit('update:modelValue', newVal.target.value)
}

</script>
