<template>
  <router-view></router-view>
  <GlobalAudioPlayerFooter></GlobalAudioPlayerFooter>
  <GlobalVideoPlayerFooter></GlobalVideoPlayerFooter>
</template>

<script setup lang="ts">
import GlobalAudioPlayerFooter from './components/organisms/AudioPlayer/GlobalAudioPlayerFooter.vue'
import GlobalVideoPlayerFooter from './components/organisms/VideoPlayer/GlobalVideoPlayerFooter.vue';
</script>