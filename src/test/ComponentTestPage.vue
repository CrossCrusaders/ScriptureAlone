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
  <p>AppSelect Component:</p>
  <AppSelect v-model="testSelectValue">
    <option value="a">
      Option 1
    </option>
    <option value="b">
      Option 2
    </option>
    <option value="c">
      Option 3
    </option>
  </AppSelect>

  <pre class="history" v-html="history"></pre>
</template>

<script setup lang="ts">
import Accordion from '../components/molecules/Accordion/Accordion.vue'
import AccordionItem from '../components/molecules/Accordion/AccordionItem.vue'
import AppSelect from '../components/atoms/form-controls/AppSelect.vue';
import { ref, watch } from 'vue';

const testSelectValue = ref('b')
const history = ref('')

watch(testSelectValue, (val) => {
  history.value += val + '\n'
})

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
