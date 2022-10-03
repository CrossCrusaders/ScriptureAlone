<template>
  <div>
    <div class="title" @click="if(contents[0].expanded != true) contents.forEach(c => { c.expanded = false }); contents[0].expanded = !contents[0].expanded;">
      <div>
        <b><slot name="Item1Title"></slot></b>
      </div>
      <div>
        <span v-if="contents[0].expanded">&#x2191;</span>
        <span v-else>&#x2193;</span>
      </div>
    </div>
    <div class="description" v-if="contents[0].expanded">
      <slot name="Item1Cont"></slot>
    </div>
    <div class="title" @click="if(contents[1].expanded != true) contents.forEach(c => { c.expanded = false }); contents[1].expanded = !contents[1].expanded;">
      <div>
        <b><slot name="Item2Title"></slot></b>
      </div>
      <div>
        <span v-if="contents[1].expanded">&#x2191;</span>
        <span v-else>&#x2193;</span>
      </div>
    </div>
    <div class="description" v-if="contents[1].expanded">
      <slot name="Item2Cont"></slot>
    </div>
    <div class="title" @click="if(contents[2].expanded != true) contents.forEach(c => { c.expanded = false }); contents[2].expanded = !contents[2].expanded;">
      <div>
        <b><slot name="Item3Title"></slot></b>
      </div>
      <div>
        <span v-if="contents[2].expanded">&#x2191;</span>
        <span v-else>&#x2193;</span>
      </div>
    </div>
    <div class="description" v-if="contents[2].expanded">
      <slot name="Item3Cont"></slot>
    </div>
  </div>
</template>

<script>
  var contents = Array(3)
    .fill()
    .map((_, i) => {
      return {
        expanded: false,
      };
    });
  export default {
    name: "App",
    data() {
      return {
        contents,
      };
    },
  };
</script>

<style scoped>
  .title {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }
  .title,
  .description {
    border: 1px solid lightgray;
    padding: 5px;
  }
</style>