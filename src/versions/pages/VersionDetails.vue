<template>
    <AppLayout>
        <div v-if="version" class="flex items-center flex-col">
            <p class="text-4xl font-bold text-slate-700 mb-4">{{ "v" + version.version + " - " + version.title }}</p>
            <p class="w-1/2 mb-4" v-html="version.description"></p>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import { getVersion } from '../services/VersionService'
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

const route = useRoute();

const version = ref();

onMounted(async () => {
    let { id } = route.params;
    version.value = await getVersion(id.toString());
});
</script>
<style lang="css">
li{
    padding-left: 2em;
}
</style>