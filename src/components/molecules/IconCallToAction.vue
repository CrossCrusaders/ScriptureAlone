<template>
    <div class="flex bg-slate-200 p-8 rounded-3xl" style="flex-direction: row; justify-content:left;">
      <div class="mr-4 outline">
        <slot name="image"></slot>
        sjdk
      </div>
      <div class="outline">
        <slot class="text-[#959595]" name="title"></slot>
        <slot name="dis"></slot>
      </div>
      <div class="flex justify-end w-1/2 outline ml-4">
        <slot name="button"></slot>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
 
</script>