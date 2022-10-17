<template>
  <AppLayout>
    <PageContent>
      <h1 class="text-5xl text-center font-bold text-slate-700 mb-8 mt-8 font-title ">{{ category?.label }}</h1>
      <div class="my-8">
        <SermonsPreviewGrid v-if="sermonQueryParams" :query-params="sermonQueryParams" :page="1" :per-page="50">
        </SermonsPreviewGrid>
      </div>
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

const route = useRoute()

const { categoryKey } = route.params

const sermonQueryParams = ref<any>(null)

const category = ref<Category | null>(null)

onMounted(async () => {
  category.value = await getSermonCategoryByKey(categoryKey as string)
  sermonQueryParams.value = {
    filter: `categories.key='${categoryKey as string}'`
  }
})

</script>

<style scoped>

</style>