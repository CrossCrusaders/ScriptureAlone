<template>
    <AppLayout>
        <div v-if="version" class="flex items-center flex-col">
            <p class="text-4xl font-bold text-slate-700 mb-4">{{ "v" + version.version + " - " + version.title }}</p>
            <p>{{ "Released: " + formatDate(version.releaseDate) }}</p>
            <div class="flex ">
                <p class="mr-1">Platforms:</p>
                <p v-html="platforms"></p>
            </div>
            <p class="mt-4 w-full md:w-1/2 mb-4" v-html="version.description"></p>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import { getVersion } from '../services/VersionService'
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { formatDate } from '../../core/services/FormatService'; 

const route = useRoute();

const version = ref();
const platforms = ref("");

onMounted(async () => {
    let { id } = route.params;
    version.value = await getVersion(id.toString().replaceAll("-", "."));
    version.value.platforms.forEach((platform:string, index:number)=>{
        platforms.value += platform;
        if(index != version.value.platforms.length-1)
            platforms.value += ", ";
    })
});
</script>
<style lang="css">
li{
    padding-left: 2em;
}
</style>