<template>
  <AppLayout>
    <PageContent>
      <h1 id="page-title__authors"
        class="max-w-prose mx-auto text-slate-800 text-center text-5xl font-title font-bold mt-8 mb-8">Search
        Truth Resource Text Materials
      </h1>
      <div class="max-w-prose mx-auto mb-8">
        <form @submit.prevent="onFormSubmit">
          <AppInput placeholder="Search For Truth Resources" v-model="currentQuery">
            <template v-slot:postfix>
              <AppButton variant="primary-minimal" size="sm" type="submit" v-if="!hasSearch">
                <Icon icon-name="magnify"></Icon>
              </AppButton>
              <AppButton variant="primary-minimal" @focus="onClearClicked" size="sm" v-else>
                <Icon icon-name="close"></Icon>
              </AppButton>
            </template>
          </AppInput>
        </form>
      </div>
      <InfiniteScrollContent @scroll:end="onScrollEnd">
        <TruthResourcesPreviewGrid @data:loaded="loading = false" :append-content="true" :per-page="16" :page="currentPage"
          :query="searchedQuery" :query-params="queryParams">
        </TruthResourcesPreviewGrid>
      </InfiniteScrollContent>
      <div v-if="reachedEnd">
        <p class="text-center text-xl font-bold mb-4">End of Results</p>
        <p class="text-center text-xl mb-8 underline">
          <a href="#page-title__truth-resource-authors">
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
import AppInput from '../../components/atoms/form-controls/AppInput.vue'
import Icon from '../../components/atoms/Icon.vue'
import { ref } from 'vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import InfiniteScrollContent from '../../components/templates/InfiniteScrollContent.vue'
import TruthResourcesPreviewGrid from '../components/TruthResourcesPreviewGrid.vue'

const loading = ref<boolean>(false)
const reachedEnd = ref<boolean>(false)
const queryParams = ref<any>({ filter: "isVideo = false" })

const hasSearch = ref(false)

const currentQuery = ref<string>('')
const searchedQuery = ref<string>('')

const currentPage = ref(1)
const countPerPage = 27

const onFormSubmit = async () => {
  searchedQuery.value = currentQuery.value;
  currentPage.value = 1;
  hasSearch.value = true;
  if(searchedQuery.value == ""){
    hasSearch.value = false;
  }
}

const onClearClicked = async () => {
  searchedQuery.value = ''
  currentQuery.value = ''
  currentPage.value = 1
  hasSearch.value = false
}


const onScrollEnd = async () => {
  if (!reachedEnd.value) {
    currentPage.value += 1
  }
}
</script>

<style scoped>

</style>