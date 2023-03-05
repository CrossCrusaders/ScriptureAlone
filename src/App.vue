<template>
  <router-view></router-view>
  <GlobalAudioPlayerFooter></GlobalAudioPlayerFooter>
</template>

<script setup lang="ts">
import GlobalAudioPlayerFooter from './components/organisms/AudioPlayer/GlobalAudioPlayerFooter.vue'
import GlobalBibleAudioPlayerFooter from './components/organisms/AudioPlayer/GlobalAudioPlayerFooter.vue'
</script>