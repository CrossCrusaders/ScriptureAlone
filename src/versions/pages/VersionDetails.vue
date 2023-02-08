<template>
    <AppLayout>
        <div v-if="version" class="flex items-center flex-col">
            <p class="text-4xl font-bold text-slate-700 mb-4">{{ "v" + version.version + " - " + version.title }}</p>
            <p>{{ "Released: " + formatDate(version.releaseDate) }}</p>
            <div>
                <Icon v-if="version.platforms.includes('Android') || version.platforms.includes('android')" :size="48" icon-name="android" class="text-slate-700"></Icon>
                <Icon v-if="version.platforms.includes('iOS') || version.platforms.includes('ios')" :size="48" icon-name="apple" class="text-slate-700"></Icon>
                <Icon v-if="version.platforms.includes('Web') || version.platforms.includes('web')" :size="48" icon-name="web" class="text-slate-700"></Icon>
            </div>
            <p class="w-1/2 mb-4" v-html="version.description"></p>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import { getVersion } from '../services/VersionService'
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import Icon from '../../components/atoms/Icon.vue';
import { formatDate } from '../../core/services/FormatService'; 

const route = useRoute();

const version = ref();

onMounted(async () => {
    let { id } = route.params;
    version.value = await getVersion(id.toString().replaceAll("-", "."));
});
</script>
<style lang="css">
li{
    padding-left: 2em;
}
</style>