<template>
    <AppLayout>
        <PageContent v-if="note && verseRef">
            <div class="text-center">
                <p class="font-bold text-2xl">{{ note?.title.toUpperCase() }}</p>
                <p class="font-bold text-2xl">{{ verseRef }}</p>
            </div>
            <div class="bg-slate-200 rounded p-2 mb-2">
                <span v-html="verseText"></span>
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
import { getVerses } from '../../bible/services/BibleService';

const route = useRoute();

const note = ref<Note>();

const verseRef = ref("");
const versesData = ref<any>([]);
const verseText = ref("");

onMounted(async () => {
    // The Note ID
    let { id } = route.params
    id = id.toString();
    note.value = await getNote(id);
    verseRef.value = await formatVerseRef(note.value?.verses);
    verseText.value = await formatVerseText();
});

const formatVerseText = async() => {
    var str: any = "";
    versesData.value.forEach((verse: any, index: number) => {
        if (index != 0) {
            if ((versesData.value[index - 1].verse_start + 1) != verse.verse_start) {
                str += " ..."
            }
        }
        str += ` <span>[<span class="font-bold">${verse.verse_start}</span>] ${verse.text}</span>`
    });
    return str;
}

const formatVerseRef = async (verses: number[]) => {
    let str = "";

    const versePromises = verses.map((verse) => {
        return getVerses(note.value?.book_id as string, note.value?.chapter as number, verse, verse).then((response) => {
            return response.verses[0];
        });
    });
    versesData.value = await Promise.all(versePromises);

    str = `${versesData.value[0].book_name} ${versesData.value[0].chapter}:`;
    let rangeStart = versesData.value[0].verse_start;
    let rangeEnd = 0;

    for (let i = 1; i < verses.length; i++) {
        const currentVerse = versesData.value[i].verse_start;
        const prevVerse = versesData.value[i - 1].verse_start;

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

    rangeEnd = versesData.value[verses.length - 1].verse_start;
    if (rangeStart === rangeEnd) {
        str += `${rangeStart}`;
    } else {
        str += `${rangeStart}-${rangeEnd}`;
    }
    if (str.includes(";"))
        str += ";";
    return str as string;
}
</script>
<style scoped lang="css"></style>