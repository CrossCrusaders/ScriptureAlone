<template>
  <AppLayout>
    <PageContent>

      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && author">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :show-church-info="false" :author="author"></AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800" v-if="author">{{ formatName(author) }}</h1>
          <ChurchContactInfo :church="author.church"></ChurchContactInfo>

        </div>
      </div>

      <div v-if="queryParams">
        <InfiniteScrollContent @scroll:end="onScrollEnd">
          <SermonsPreviewGrid @data:loaded="loading = false" :infinite-scroll="true" :per-page="16" :page="currentPage"
            :query-params="queryParams">
          </SermonsPreviewGrid>
        </InfiniteScrollContent>
      </div>


    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { getAuthor } from '../../authors/services/AuthorService'
import { } from '../services/SermonService'
import { useRoute } from 'vue-router'
import { Author } from '../../authors/Author'
import AuthorPreviewColumn from '../components/AuthorPreviewColumn.vue'
import SermonsPreviewGrid from '../components/SermonsPreviewGrid.vue'
import { formatName } from '../../core/services/FormatService'
import ChurchContactInfo from '../../components/molecules/ChurchContactInfo.vue'
import InfiniteScrollContent from '../../components/templates/InfiniteScrollContent.vue'

const route = useRoute()

const authorId = route.params.authorId as string

const author = ref<Author>()
const loading = ref<boolean>(false)

const queryParams = ref<any>()
const currentPage = ref<number>(1)

onMounted(async () => {
  author.value = await getAuthor(authorId)
  queryParams.value = { filter: `author='${authorId}'` }
})

const onScrollEnd = () => {
  if (!loading.value) {
    currentPage.value += 1
    loading.value = true
  }
}


</script>

<style scoped>

</style>