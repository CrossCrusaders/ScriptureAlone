<template>
  <div class="min-h-screen flex flex-col">
    <top-nav-bar></top-nav-bar>
    <donate-button></donate-button>
    <div class="flex-auto">
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

