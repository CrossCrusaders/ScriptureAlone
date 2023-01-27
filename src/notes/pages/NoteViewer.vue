<template>
    <AppLayout>
        <PageContent v-if="note">
            <div class="flex justify-center">
                <p class="font-bold text-2xl">{{ formatVerseRef(note?.verses.value) }}</p>
            </div>
            <div class="bg-slate-200 rounded p-2 mb-2">
                <span v-html="formatVerseText(note?.verses.value)"></span>
            </div>
            <textarea class="w-full bg-slate-100 rounded p-2 h-96" :value="note?.text"></textarea>
        </PageContent>
    </AppLayout>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import AppLayout from '../../components/templates/AppLayout.vue';
import PageContent from '../../components/templates/PageContent.vue';
import { getNote } from '../services/NoteService';
import { Note } from '../Note'

const route = useRoute();

const note = ref<Note>();

onMounted(async () => {
    // The Note ID
    let { id } = route.params
    id = id.toString();
    note.value = await getNote(id);
});

const formatVerseText = (verses: any) => {
    var str: any = "";
    verses.forEach((verse: any, index: number) => {
        if (index != 0) {
            if ((verses[index - 1][0].verse_start + 1) != verse[0].verse_start) {
                str += " ..."
            }
        }
        str += ` <span>[<span class="font-bold">${verse[0].verse_start}</span>] ${verse[0].verse_text}</span>`
    });
    return str;
}

const formatVerseRef = (verses: any) => {
    let str = `${verses[0][0].book_name_alt} ${verses[0][0].chapter}:`;
    let rangeStart = verses[0][0].verse_start;
    let rangeEnd = 0;

    for (let i = 1; i < verses.length; i++) {
        const currentVerse = verses[i][0].verse_start;
        const prevVerse = verses[i - 1][0].verse_start;

        if (currentVerse - prevVerse > 1) {
            rangeEnd = prevVerse;
            if (rangeStart === rangeEnd) {
                str += `${rangeStart}; `;
            } else {
                str += `${rangeStart}-${rangeEnd}; `;
            }
            rangeStart = currentVerse;
        }
    }

    rangeEnd = verses[verses.length - 1][0].verse_start;
    if (rangeStart === rangeEnd) {
        str += `${rangeStart}`;
    } else {
        str += `${rangeStart}-${rangeEnd}`;
    }
    if(str.includes(";"))
        str += ";";
    return str;
}
</script>
<style scoped lang="css">

</style>