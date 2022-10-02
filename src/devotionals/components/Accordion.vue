<template>
  <div v-for="c of contents" :key="c.title">
    <div class="title" @click="if(c.expanded != true) contents.forEach(c => { c.expanded = false }); c.expanded = !c.expanded;">
      <div>
        <b>{{ c.title }}</b>
      </div>
      <div>
        <span v-if="c.expanded">&#x2191;</span>
        <span v-else>&#x2193;</span>
      </div>
    </div>
    <div class="description" v-if="c.expanded">
      {{ c.description }}
    </div>
  </div>
</template>

<script>
  var contents = Array(10)
    .fill()
    .map((_, i) => {
      return {
        title: `title ${i}`,
        description: `description ${i}`,
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