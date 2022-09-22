<template>
  <button v-bind="$attrs" :class="[buttonClass, buttonVariantClasses[buttonVariantKey]]">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface AppButtonProps {
  variant?: 'primary' | 'accent' | 'primary-outline' | 'accent-outline'
}
const props = defineProps<AppButtonProps>()

const buttonClass = `rounded-full pt-2 pb-2 pr-6 pl-6 min-w-fit whitespace-nowrap`
const buttonVariantClasses = {
  'primary': 'border-solid border-2 border-slate-800 bg-slate-800 text-white',
  accent: 'border-solid border-2 border-red-700 bg-red-700 text-white',
  'primary-outline': `border-solid border-2 border-slate-800 text-slate-800 bg-transparent`,
  'accent-outline': 'border-solid border-2 border-red-700 text-red-700 bg-transparent'
}

const buttonVariantKey = props.variant || 'primary'

</script>