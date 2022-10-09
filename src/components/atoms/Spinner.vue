<template>
  <div :class="['lds-ring']">
    <div :class="colorClass"></div>
    <div :class="colorClass"></div>
    <div :class="colorClass"></div>
    <div :class="colorClass"></div>
  </div>
</template>

<script setup lang="ts">import { computed } from 'vue';


const props = defineProps({
  color: {
    type: String,
    default: 'white'
  }
})

const colorClass = computed(() => {
  return `border-solid border-8 border-${props.color} border-t-${props.color} border-l-transparent border-b-transparent border-r-transparent`
})
</script>

<style>
.lds-ring {

  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;

  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>