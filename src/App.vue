<template>
  <router-view></router-view>
  <GlobalAudioPlayerFooter></GlobalAudioPlayerFooter>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import GlobalAudioPlayerFooter from './components/organisms/AudioPlayer/GlobalAudioPlayerFooter.vue'
import { useUserFavorites } from './user/services/UserService';

</script>