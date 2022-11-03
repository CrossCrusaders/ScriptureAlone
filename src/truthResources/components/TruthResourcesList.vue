<template>
    <h2 class="text-2xl font-bold mb-2 text-slate-900">Text Material:</h2>
    <div class="flex justify-center pb-8">
        <div class="w-1/6 flex flex-col">
            <label v-for="resource of props.resources"><RouterLink :to="resource.link || '/'"><Icon icon-name="cross" :size="8"></Icon> {{ resource.title }}</RouterLink></label>
        </div>
        <div class="pl-4 pr-4 flex flex-row items-center justify-center">
            <div class="h-full w-1 bg-slate-400"></div>
        </div>
        <div class="w-1/6 flex flex-col">
            <label><Icon icon-name="cross" :size="8"></Icon> Yeas</label>
            <label><Icon icon-name="cross" :size="8"></Icon> Yeas</label>
            <label><Icon icon-name="cross" :size="8"></Icon> Yeas</label>
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from '../../components/atoms/Icon.vue'
import { RouterLink } from 'vue-router';

export interface Resource {
  image?: string
  title?: string
  link?: string
}

export interface TruthResoursesProps {
  resources: Resource[]
}

const props = defineProps<TruthResoursesProps>()
</script>