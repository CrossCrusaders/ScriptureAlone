<template>
    <AppLayout>
        <PageContent>
            <h1 id="page-title__versions"
                class="max-w-prose mx-auto text-slate-800 text-center text-5xl font-title font-bold mt-8 mb-8">Scripture Alone Versions
            </h1>
            <InfiniteScrollContent @scroll:end="onScrollEnd">
                <VersionsPreviewGrid @data:loaded="loading = false" :append-content="true" :per-page="16" :page="currentPage"
                    query="" :query-params="queryParams">
                </VersionsPreviewGrid>
            </InfiniteScrollContent>
            <div v-if="reachedEnd">
                <p class="text-center text-xl font-bold mb-4">End of Results</p>
                <p class="text-center text-xl mb-8 underline">
                    <a href="#page-title__versions">
                        Back To Top?
                    </a>
                </p>
            </div>
        </PageContent>
    </AppLayout>
</template>
  
<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import { ref } from 'vue'
import InfiniteScrollContent from '../../components/templates/InfiniteScrollContent.vue'
import VersionsPreviewGrid from '../components/VersionsPreviewGrid.vue'

const loading = ref<boolean>(false)
const reachedEnd = ref<boolean>(false)
const queryParams = ref<any>({ sort: "-created" })

const currentPage = ref(1)

const onScrollEnd = async () => {
    if (!reachedEnd.value && !loading.value) {
        loading.value = true;
        currentPage.value += 1
    }
}
</script>
  
<style scoped></style>