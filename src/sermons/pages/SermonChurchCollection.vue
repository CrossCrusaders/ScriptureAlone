<template>
  <AppLayout>
    <PageContent>
      <h1 class="text-5xl text-center font-bold text-slate-700 mb-8 mt-8 font-title ">{{ currentChurch?.name }}</h1>
      <div class="my-8">
        <!-- TODO: add church autors -->
      </div>
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
import { Church } from '../../church/Church';
import { getChurch } from '../../church/services/ChurchService';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import SermonsPreviewGrid from '../components/SermonsPreviewGrid.vue';
import { Category } from '../Sermon';
import { getSermonCategoryByKey } from '../services/SermonService'

const { params } = useRoute()

const currentChurch = ref<Church | null>(null)
const sermonQueryParams = ref<any>(null)

onMounted(async () => {
  const { churchId } = params

  currentChurch.value = await getChurch(churchId as string)

  sermonQueryParams.value = {
    filter: `author.church='${churchId as string}'`
  }
})

</script>

<style scoped>

</style>