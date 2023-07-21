<template>
  <div class="min-h-screen flex flex-col">
    <top-nav-bar class="z-40"></top-nav-bar>
    <div class="flex-auto z-0">
      <slot></slot>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<script setup lang="ts">
import TopNavBar from '../organisms/TopNavBar.vue'
import PageFooter from '../molecules/PageFooter.vue'
import DonateButton from '../molecules/DonateButton.vue';

</script>

