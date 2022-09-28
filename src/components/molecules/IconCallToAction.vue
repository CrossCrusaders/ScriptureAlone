<template>

  <div class="flex bg-slate-200 p-8 gap-4 rounded-3xl flex-row justify-start">
    <!-- Image Slot Parent -->
    <div class="">
      <slot name="image"></slot>
    </div>

    <!-- Default Content Slot Parent -->
    <div class="flex-auto">
      <!-- I am going to remove the title, content distinction for now -->
      <!-- <slot class="text-[#959595]" name="title"></slot>
        <slot name="dis"></slot> -->

      <slot></slot>
    </div>

    <!-- Action Slot Parent -->
    <div class="flex flex-col justify-center">
      <slot name="action"></slot>
    </div>
  </div>
</template>
  
<script setup lang="ts">

</script>