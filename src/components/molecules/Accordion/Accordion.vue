<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

import { onMounted, provide, useSlots } from 'vue'
import { AccordionService } from './AccordionService'

const service = new AccordionService()
provide('accordionService', service)

</script>
