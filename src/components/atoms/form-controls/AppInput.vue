<template>
  <label class="block text-slate-600 font-bold px-2">
    <slot></slot>
  </label>
  <div :class="[inputOuterWrapperClass]">
    <div :class="['prefix-wrapper', props.prefixClass]">
      <slot name="prefix"></slot>
    </div>
    <div class="input-wrapper flex-auto">
      <input class="py-2 h-full w-full outline-none bg-transparent" v-bind="$attrs" :value="props.modelValue"
        @input="onInputInput" @focus="onInputFocus" @blur="onInputBlur" />
    </div>
    <div :class="['postfix-wrapper', props.postfixClass]">
      <slot name="postfix"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"



const inputOuterWrapperClass = computed(() => {
  let baseClass = `
  input-outer-wrapper
  shadow-lg
  rounded-full 
  px-4 
  border-solid 
  border-2 
  transition-all
  box-border
  flex flex-row items-center gap-2
  max-h-14 h-14
  w-full
  `

  if (!isFocused.value) {
    baseClass += `border-slate-400 bg-slate-100 `
  } else {
    baseClass += `border-slate-800 bg-white`
  }

  return baseClass

})

const props = defineProps([
  'modelValue',
  'postfixClass',
  'prefixClass'
])
const emit = defineEmits([
  'update:modelValue'
])

const isFocused = ref(false)
const isDirty = ref(false)

const onInputInput = (newVal: any) => {
  emit('update:modelValue', newVal.target.value)
}

const onInputFocus = () => {
  isFocused.value = true
}

const onInputBlur = () => {
  isFocused.value = false
  isDirty.value = true
}
</script>
