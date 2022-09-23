<template>
  <div class="flex flex-row items-center gap-2 min-w-fit">
    <logo>
    </logo>
    <span :class="['text-xl md:text-3xl font-bold font-title whitespace-nowrap', textClass]">Scripture Alone</span>
  </div>
</template>
<script setup lang="ts">
import Logo from '../atoms/Logo.vue'


const props = defineProps({
  variant: { type: String, default: 'light' } // dark
})


const textClass = `${props.variant === 'dark' ? 'text-white' : 'text-gray-700'}`

</script>

