<template>
    <ContentCoverImage :cover-image="image" :content-id="props.truthResourceId"
      v-bind="{ ...$props }"></ContentCoverImage>
</template>
  
<script setup lang="ts">
  import { computed } from '@vue/reactivity';
  import { onMounted, ref } from 'vue';
  import ContentCoverImage from '../../components/molecules/ContentCoverImage.vue';
  import { getUserProfileImage, ToggleAction, useUserFavorites } from '../../user/services/UserService';
  import { TruthResource } from '../TruthResource';

  const image = ref();
  
  const props = defineProps([
    'truthResourceId',
    'resource'
  ])
  
  onMounted(async () => {
    image.value = await getImage(props.resource);
  })

  async function getImage(resource:TruthResource){
    if(resource.coverImage != "")
      return resource.coverImage;

    if(resource.author?.profileImage != null)
      return resource.author?.profileImage;
  }
</script>