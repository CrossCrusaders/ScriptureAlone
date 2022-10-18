<template>
  <div class="flex flex-row justify-between items-center gap-8 pt-2 pb-2 pl-4 pr-4">
    <RouterLink to="/">
      <logo-and-name></logo-and-name>
    </RouterLink>
    <TopNavMenu></TopNavMenu>
  </div>
</template>

<script setup lang="ts">

import LogoAndName from '../molecules/LogoAndName.vue'
import TopNavMenu from '../molecules/TopNavMenu.vue'

</script>