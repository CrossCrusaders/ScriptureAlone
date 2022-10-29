<template>
  <CoverImageWithFavorite :cover-image="props.coverImage" :is-favorite="isFavorite" :content-id="props.devotionalId"
    @click:favorite="onFavoriteClicked($event)" v-bind="{ ...$props }"></CoverImageWithFavorite>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import CoverImageWithFavorite from '../../components/molecules/CoverImageWithFavorite.vue';
import { ToggleAction, useUserFavorites } from '../../user/services/UserService';

const props = defineProps([
  'devotionalId',
  'coverImage'
])
const isFavorite = computed(() => {
  return isUserFavoriteDevotional(props.devotionalId)
})

const { loadFavorites, isUserFavoriteDevotional, toggleUserFavoriteDevotional } = useUserFavorites()

onMounted(async () => {
  await loadFavorites()
})

const onFavoriteClicked = async (devotionalId: string) => {
  await toggleUserFavoriteDevotional(devotionalId)
}

</script>