<template>
  <div class="rounded-xl bg-slate-200 px-6 py-12 md:py-16 items-center mb-16 md:mt-8">
    <!-- Inner flex parent -->
    <div class="flex flex-col md:flex-row gap-4">

      <slot name="image"></slot>

      <div class="mb-4 md:mb-0 flex-auto">
        <slot></slot>
      </div>
      <div class="flex flex-col gap-2 justify-center">
        <slot name="actions"></slot>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

</script>