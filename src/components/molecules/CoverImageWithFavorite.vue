<template>
  <div class="relative">
    <img :src="props.coverImage || defaultImage" class="object-cover max-h-64 w-full md:max-h-64 rounded-lg mb-4" />
    <FavoriteButton style="filter: drop-shadow(0px 0px 0.5em #000000);" class="absolute top-2 right-2" @click="emit('click:favorite', props.contentId)"
      :is-favorite="props.isFavorite"></FavoriteButton>

  </div>
</template>

<script setup lang="ts">
import { defaultImage } from '../../user/services/UserService'
import FavoriteButton from '../atoms/FavoriteButton.vue';

export interface CoverImageWithFavoriteProps {
  coverImage?: string,
  isFavorite?: boolean,
  contentId?: string
}
const props = withDefaults(defineProps<CoverImageWithFavoriteProps>(), { isFavorite: false })

const emit = defineEmits(['click:favorite'])

</script>