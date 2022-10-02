<template>
  <div class="flex p-8 gap-4 flex-col md:flex-row justify-start">
    <div class="flex gap-4 flex-row justify-start flex-auto">
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
    </div>
    <!-- Action Slot Parent -->
    <div class="flex flex-col justify-center">
      <slot name="action"></slot>
    </div>
  </div>
</template>
  
<script setup lang="ts">

</script>