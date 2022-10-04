<template>
  <Accordion>
    <AccordionItem v-for="item of accordionTestItems" :key="item.title">
      <template v-slot:title>
        <h2>{{ item.title }}</h2>
      </template>
      <div>
        {{ item.body }}
      </div>
    </AccordionItem>
  </Accordion>
  <p>Height checker</p>
</template>

<script setup lang="ts">
import Accordion from '../components/molecules/Accordion/Accordion.vue'
import AccordionItem from '../components/molecules/Accordion/AccordionItem.vue'

const accordionTestItems = [
  {
    title: 'Panel 1',
    body: 'This is some content and what not'
  },
  {
    title: 'Panel 2',
    body: 'This is some content and what not'
  },
  {
    title: 'Panel 3',
    body: 'This is some content and what not'
  },
  {
    title: 'Panel 4',
    body: 'This is some content and what not'
  },
  {
    title: 'Panel 5',
    body: 'This is some content and what not'
  }
]
</script>

<style>

</style>
