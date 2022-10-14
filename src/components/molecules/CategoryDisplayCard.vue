<template>
  <div v-bind="$attrs" class="category-display-card" :style="styleObject">
    <span>{{ props.category?.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface CategoryDisplayCardProps {
  category: {
    label?: string
    colorStart?: string
    colorEnd?: string
    textColor?: string
    link?: string
  }
}

const props = defineProps<CategoryDisplayCardProps>()

const gradientStyle = computed(() => `linear-gradient(90deg, ${props.category?.colorStart} 0%, ${props.category?.colorEnd} 100%)`)

const styleObject = computed(() => {
  return {
    'background': gradientStyle.value,
    'color': props.category?.textColor
  }
})

</script>

<style scoped>
.category-display-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 250px;
  min-height: 200px;
  border-radius: .5rem;
  cursor: pointer;
  width: 100%;
}

.category-display-card>span {
  border: 1px solid;
  padding: 1rem 2rem;
  font-size: 1.25rem;
}
</style>