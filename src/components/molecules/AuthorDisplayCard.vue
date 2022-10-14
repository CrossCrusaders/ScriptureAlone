<template>
  <RouterLink class="w-full" :to="props.link || ''">
    <div v-bind="$attrs" class="author-display-card" :style="styleObject">
      <div class="absolute bottom-0 left-0 right-0 h-14 author-name-backdrop"></div>
      <span class="text-white">{{ fullName }}</span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Author } from '../../authors/Author'

interface AuthorDisplayCardProps {
  author: Author
  link?: string
}

const props = withDefaults(defineProps<AuthorDisplayCardProps>(), {})

const styleObject = computed(() => {
  return {
    'background-image': `url(${props.author?.profileImage})`,
    'background-position': 'center center',
    'background-size': 'cover',
  }
})

const fullName = computed(() => {
  let name = ''
  if (props.author?.firstName)
    name += props.author?.firstName
  if (props.author?.lastName)
    name += ' ' + props.author?.lastName
  return name.trim()
})

</script>

<style scoped>
.author-display-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 250px;
  min-height: 200px;
  border-radius: .5rem;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  width: 100%;
}

.author-display-card>span {
  /* text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000; */
  bottom: 8px;
  right: 8px;
  position: absolute;
  font-size: 1.5rem;
}

.author-name-backdrop {

  background: linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
}
</style>