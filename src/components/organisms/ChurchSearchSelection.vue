<template>
  <div class="flex flex-row gap-4 items-center">
    <div>
      <a @click="onCountryClick()">USA</a>
    </div>
    <div>
      <USStateSelect placeholder="State"></USStateSelect>
    </div>
  </div>

  <AppModal v-model="showCountrySelectionModal" v-slot="{ close }">
    <div class="p4">
      <p class="max-w-prose mb-4">We are currently working hard to add international content. We appreciate your
        patience!</p>
      <AppButton @click="close">Okay</AppButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import USStateSelect from '../../components/molecules/USStateSelect.vue'
import AppModal from '../../components/templates/AppModal.vue'

const showCountrySelectionModal = ref(false)

const onCountryClick = () => {
  showCountrySelectionModal.value = true
}
</script>