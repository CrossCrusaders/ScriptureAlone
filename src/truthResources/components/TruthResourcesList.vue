<template>
    <h2 class="text-2xl font-bold mb-2 text-slate-900">Text Material:</h2>
    <div class="flex justify-center pb-8 pt-4">
        <div class="w-1/3 flex flex-col">
            <RouterLink class="pb-1" v-for="resource of getHalfOne" :to="`/${baseUrl}/${resource.id}` || '/'"><Icon icon-name="paper" :size="8"></Icon> {{ resource.title }}</RouterLink>
        </div>
        <div class="pl-4 pr-4 flex flex-row items-center justify-center">
            <div class="h-full w-1 bg-slate-400"></div>
        </div>
        <div class="w-1/3 flex flex-col">
            <RouterLink class="pb-1" v-for="resource of getHalfTwo" :to="`/${baseUrl}/${resource.id}` || '/'"><Icon icon-name="paper" :size="8"></Icon> {{ resource.title }}</RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../../components/atoms/Icon.vue';
import { RouterLink } from 'vue-router';

export interface Resource {
  coverImage?: string
  title?: string
  id?: string
}

export interface TruthResoursesProps {
  resources: Resource[]
  baseUrl: string
}

const getHalfOne = computed(() => {
    const resources = props.resources ?? []
    var list = [];
    var result = Math.round(resources.length / 2);
    for(let i = 0; i < result; i++){
        list.push(resources[i]);
    }
    return list;
})

const getHalfTwo = computed(() => {
    const resources = props.resources ?? []
    var list = [];
    var result = Math.round(resources.length / 2);
    var length = resources.length;
    for(let i = result; i < length; i++){
        list.push(resources[i]);
    }
    return list;
})

const props = defineProps<TruthResoursesProps>()
</script>