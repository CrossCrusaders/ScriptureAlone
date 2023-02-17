<template>
    <AppLayout>
        
    </AppLayout>
</template>
<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import { getVersion } from '../services/VersionService'
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { formatDate } from '../../core/services/FormatService'; 
import { Version } from '../Version';

const route = useRoute();

const versions = ref<Version[]>([]);

onMounted(async () => {
    
});
</script>
<style lang="css" scoped>
</style>