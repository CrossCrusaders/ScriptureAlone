<template>
  <AppLayout>
    <PageContent>

    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import SermonsPreviewGrid from '../components/SermonsPreviewGrid.vue';
import { Category } from '../Sermon';
import { getSermonCategoryByKey } from '../services/SermonService'


</script>

<style scoped>

</style>