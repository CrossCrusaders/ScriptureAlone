<template>
  <vue-final-modal v-slot="{ params, close }" v-bind="$attrs" classes="modal-container" content-class="modal-content">
    <slot v-bind="params" :close="close"></slot>

    <button class="absolute top-2 right-2" @click="close">
      <Icon icon-name="close"></Icon>
    </button>
  </vue-final-modal>
</template>

<script setup lang="ts">
import Icon from '../atoms/Icon.vue'

</script>


<style scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.modal-content) {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
  position: relative;
  width: 100%;
  max-width: 768px;
}
</style>