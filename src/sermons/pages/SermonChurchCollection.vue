<template>
  <AppLayout>
    <PageContent>
      <h1 class="text-5xl text-center font-bold text-slate-700 mb-8 mt-8 font-title ">{{ currentChurch?.name }}</h1>
      <div class="my-8">
        <h2 class="text-3xl font-bold text-slate-700 mb-2 font-title ">Preachers</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AuthorDisplayCard v-for="author of authors" :author="author" :link="`/authors/${author.id}`">
          </AuthorDisplayCard>
        </div>
      </div>
      <div class="my-8">
        <h2 class="text-3xl font-bold text-slate-700 mb-2 font-title">Sermons</h2>
        <SermonsPreviewGrid v-if="sermonQueryParams" :query-params="sermonQueryParams" :page="1" :per-page="16"
          :pagination-controls="true">
        </SermonsPreviewGrid>
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Author } from '../../authors/Author';
import { getAuthorsByChurch } from '../../authors/services/AuthorService';
import { Church } from '../../church/Church';
import { getChurch } from '../../church/services/ChurchService';
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import SermonsPreviewGrid from '../components/SermonsPreviewGrid.vue';
import { Category } from '../Sermon';
import { getSermonCategoryByKey } from '../services/SermonService'
import AuthorDisplayCard from '../../components/molecules/AuthorDisplayCard.vue';

const { params } = useRoute()

const currentChurch = ref<Church | null>(null)
const sermonQueryParams = ref<any>(null)
const authors = ref<Author[]>([])

onMounted(async () => {
  const { churchId } = params

  const strChurchId: string = churchId as string

  currentChurch.value = await getChurch(strChurchId)
  authors.value = await getAuthorsByChurch(strChurchId)

  sermonQueryParams.value = {
    filter: `author.church='${churchId as string}'`,
    sort: '-sermonDate'
  }
})

</script>

<style scoped>

</style>