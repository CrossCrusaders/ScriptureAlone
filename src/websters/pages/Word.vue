<template>
    <AppLayout v-if="word">
        <PageContent class="flex flex-col items-center">
            <p class="text-4xl font-bold">{{ word.word }}</p>
            <p>{{ word.pronunciation }}</p>
            <div class="mt-12 p-4 bg-slate-200 rounded">
                <p v-html="`[<b>${word.definition.type}</b>] <br> ${word.definition.text}`"></p>
            </div>
        </PageContent>
    </AppLayout>
</template>
<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue';
import PageContent from '../../components/templates/PageContent.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getWord } from '../services/WebstersService'

const route = useRoute();

const word = ref()

onMounted(async() => {
    let { query } = route.params;
    word.value = await getWord(query as string);
    /*word.value = {
        word: "Whosoever",
        pronunciation: "WHOSOEVER [who, so, and ever.]",
        definition: {
            type: "pronoun",
            text: "Any one; any person whatever.WHOSOEVER will, let him take of the water of life freely. Revelations 22."
        }*/
})
</script>
<style scoped lang="css"></style>