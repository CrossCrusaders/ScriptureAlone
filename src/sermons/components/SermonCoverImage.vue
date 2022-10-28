<template>
  <CoverImageWithFavorite :cover-image="props.coverImage" :is-favorite="isFavorite" :content-id="props.sermonId"
    @click:favorite="onFavoriteClicked($event)" v-bind="{ ...$props }"></CoverImageWithFavorite>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CoverImageWithFavorite from '../../components/molecules/CoverImageWithFavorite.vue';
import { isUserFavoriteSermon, ToggleAction, toggleUserFavoriteSermon } from '../../user/services/UserService';

const props = defineProps([
  'sermonId',
  'coverImage'
])
const isFavorite = ref(false)

onMounted(async () => {
  isFavorite.value = await isUserFavoriteSermon(props.sermonId)
})

const onFavoriteClicked = async (sermonId: string) => {

  const action = await toggleUserFavoriteSermon(sermonId)
  isFavorite.value = action === ToggleAction.created
}

</script>