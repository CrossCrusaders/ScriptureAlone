<template>
  <AppLayout>
    <PageContent>

      <div class="flex flex-col-reverse md:flex-row gap-2 md:gap-8 mt-8" v-if="!loading && author">
        <div class="md:w-2/6">
          <AuthorPreviewColumn :author="author"></AuthorPreviewColumn>
          <!--TODO: Share Icons -->

        </div>
        <!-- Right Side -->
        <div class="md:w-4/6 flex-auto">
          <h1 class="font-title font-bold text-4xl mb-2 text-slate-800" v-if="author">{{ formatName(author) }}</h1>


        </div>
      </div>

    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { } from '../../authors/services/AuthorService'
import { } from '../services/SermonService'
import { useRoute } from 'vue-router'
import { Author } from '../../authors/Author'
import AuthorPreviewColumn from '../components/AuthorPreviewColumn.vue'
import { formatName } from '../../core/services/FormatService'

const route = useRoute()

const authorId = route.params.authorId as string

const author = ref<Author>()
const loading = ref<boolean>(false)

onMounted(async () => {

})
</script>

<style scoped>

</style>