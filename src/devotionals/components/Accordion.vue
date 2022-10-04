<script lang="ts" setup>
  import { reactive } from 'vue'

  let contents = reactive({ Item1Expanded:false, Item2Expanded:false, Item3Expanded:false });
</script>

<template>
  <div>
    <div class="title" @click="contents.Item2Expanded = false; contents.Item3Expanded = false; contents.Item1Expanded = !contents.Item1Expanded;">
      <div>
        <b><slot name="Item1Title"></slot></b>
      </div>
      <div>
        <span v-if="contents.Item1Expanded">&#x2191;</span>
        <span v-else>&#x2193;</span>
      </div>
    </div>
    <div class="description" v-if="contents.Item1Expanded">
      <slot name="Item1Cont"></slot>
    </div>
    <div class="title" @click="contents.Item1Expanded = false; contents.Item3Expanded = false; contents.Item2Expanded = !contents.Item2Expanded;">
      <div>
        <b><slot name="Item2Title"></slot></b>
      </div>
      <div>
        <span v-if="contents.Item2Expanded">&#x2191;</span>
        <span v-else>&#x2193;</span>
      </div>
    </div>
    <div class="description" v-if="contents.Item2Expanded">
      <slot name="Item2Cont"></slot>
    </div>
    <div class="title" @click="contents.Item1Expanded = false; contents.Item2Expanded = false; contents.Item3Expanded = !contents.Item3Expanded;">
      <div>
        <b><slot name="Item3Title"></slot></b>
      </div>
      <div>
        <span v-if="contents.Item3Expanded">&#x2191;</span>
        <span v-else>&#x2193;</span>
      </div>
    </div>
    <div class="description" v-if="contents.Item3Expanded">
      <slot name="Item3Cont"></slot>
    </div>
  </div>
</template>

<style scoped>
  .title {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    background-color: whitesmoke;
    padding: 1em;
  }
  .description {
    padding: 0.8em;
  }
</style>