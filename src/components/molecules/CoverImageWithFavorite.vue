<template>
  <div class="relative">
    <img :src="props.coverImage || defaultImage" class="object-cover max-h-40 w-full md:max-h-64 rounded-lg mb-4" />
    <AppButton size="sm" class="absolute top-2 right-2" variant="minimal"
      @click="emit('click:favorite', props.contentId)">
      <Icon :icon-name="props.isFavorite ? 'heart-red' : 'heart-outline'"></Icon>
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { defaultImage } from '../../user/services/UserService'
import AppButton from '../atoms/form-controls/AppButton.vue'
import Icon from '../atoms/Icon.vue'

export interface CoverImageWithFavoriteProps {
  coverImage?: string,
  isFavorite?: boolean,
  contentId?: string
}
const props = withDefaults(defineProps<CoverImageWithFavoriteProps>(), { isFavorite: false })

const emit = defineEmits(['click:favorite'])

</script>