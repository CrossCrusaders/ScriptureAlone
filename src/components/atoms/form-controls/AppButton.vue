<template>
  <a v-if="props.href" :href="props.href" v-bind="$attrs"
    :class="[buttonClass, buttonVariantClasses[buttonVariant], buttonSizeClasses[buttonSize]]">
    <slot></slot>
  </a>
  <RouterLink v-else-if="props.to" :to="props.to" v-bind="$attrs"
    :class="[buttonClass, buttonVariantClasses[buttonVariant], buttonSizeClasses[buttonSize]]">
    <slot></slot>
  </RouterLink>
  <button v-else v-bind="$attrs"
    :class="[buttonClass, buttonVariantClasses[buttonVariant], buttonSizeClasses[buttonSize]]">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface AppButtonProps {
  variant?: 'primary' | 'accent' | 'primary-outline' | 'accent-outline' | 'primary-minimal' | 'primary-light' | 'secondary' | 'white-outline',
  href?: string,
  to?: string,
  size?: 'sm' | 'md' | 'lg',
  disabled?: boolean
}
const props = defineProps<AppButtonProps>()

const buttonClass = `rounded-full min-w-fit whitespace-nowrap`
const buttonVariantClasses = {
  'primary': 'border-solid border-2 border-slate-800 bg-slate-800 text-white',
  'primary-light': 'border-solid border-2 border-slate-600 bg-gradient-to-r from-slate-800 to-slate-600 text-white',
  accent: 'border-solid border-2 border-red-700 bg-red-700 text-white',
  'primary-outline': `border-solid border-2 border-slate-800 text-slate-800 bg-transparent`,
  'accent-outline': 'border-solid border-2 border-red-700 text-red-700 bg-transparent',

  'primary-minimal': `border-solid border-2 border-transparent text-slate-800 bg-transparent`,
  'secondary': `border-solid border-2 border-red-800 bg-red-800 text-white`,
  'white-outline': `border-solid border-2 border-white bg-transparent text-white`
}

const buttonSizeClasses = {
  'sm': `pt-2 pb-2 pr-2 pl-2 `,
  'md': `pt-2 pb-2 pr-6 pl-6`,
  'lg': `??`
}


const buttonVariant = computed(() => {
  return props.variant || 'primary'
})

const buttonSize = computed(() => {
  return props.size || 'md'
})

</script>