<template>
  <AppLayout>
    <PageContent>

      <!-- Devotionals Hero -->
      <PageHero>
        <template v-slot:image>
          <img src="/logo-bible.png" class="object-contain hidden md:block max-h-32" />
        </template>
        <h2 class="text-4xl font-bold mb-2 text-slate-900">Daily Devotionals</h2>
        <p class="text-slate-600 max-w-prose">
          Find devotionals that will encourage you as you walk with the Lord. Devotionals are great way to enhance your
          daily bible reading program
          and find help in a time of need for whatever you may be facing. We pray you are encouraged.
        </p>
        <template v-slot:actions>
          <!-- <AppButton>Read Now</AppButton> -->
        </template>
      </PageHero>

      <form @submit.prevent="handleSearchSubmit($event)" class="flex justify-center mb-10">
        <div class="px-2 w-full md:w-1/2">
          <AppInput id="searchBar" type="input" name="query" v-model="searchModel" placeholder="Search Devotionals">
            <template v-slot:postfix>
              <AppButton variant="primary-minimal" size="sm" v-if="hasSearch" @click="clearCurrentSearch">
                <Icon icon-name="close"></Icon>
              </AppButton>
              <AppButton variant="primary-minimal" size="sm" v-else type="submit">
                <Icon icon-name="magnify"></Icon>
              </AppButton>

            </template>
          </AppInput>
          <AppButton variant="primary-light" class="block w-full md:hidden mt-4" type="submit">Search</AppButton>
        </div>
      </form>

      <!-- Devotionals Grid Display -->
      <div class="mb-10">
        <DevotionalsPreviewGrid :query="currentSearchQuery" :page="currentPage" :show-spinner-while-loading="true"
          @click:button="router.push(`/devotionals/${$event.id}`)" @data:loaded="onDevotionalDataLoaded">
        </DevotionalsPreviewGrid>
        <div class="flex justify-between mt-2 mb-12 p-4">
          <div>
            <AppButton @click="onPreviousPageClicked" v-if="currentPaginationData?.page != 1" variant="primary-outline">
              &lt;&nbsp;Previous Page
            </AppButton>
          </div>

          <div>
            <AppButton @click="onNextPageClicked"
              v-if="currentPaginationData?.page != currentPaginationData?.totalPages" variant="primary-outline">
              Next Page&nbsp;&gt;
            </AppButton>
          </div>
        </div>

      </div>

      <!-- My Plans -->
      <UserRecommendationFooter></UserRecommendationFooter>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">

import AppLayout from "../../components/templates/AppLayout.vue"
import PageContent from "../../components/templates/PageContent.vue"
import AppButton from "../../components/atoms/form-controls/AppButton.vue"
import { computed, onMounted, ref } from "vue"
import Icon from "../../components/atoms/Icon.vue"

import PageHero from "../../components/molecules/PageHero.vue"
import { useRouter, useRoute } from "vue-router"
import AppInput from "../../components/atoms/form-controls/AppInput.vue"
import DevotionalsPreviewGrid from "../components/DevotionalsPreviewGrid.vue"
import UserRecommendationFooter from "../../components/organisms/UserRecommendationFooter.vue"
import { DevotionalSearch } from "../DevotionalSearch"
import { Pagination } from "../../core/Pagination"
import Spinner from "../../components/atoms/Spinner.vue"

const loading = ref<boolean>(false)
const searchModel = ref("")
const router = useRouter()

const currentPaginationData = ref<Pagination>()
const currentPage = ref<number>(1)
const currentSearchQuery = ref<string>('')


const handleSearchSubmit = async (event: Event) => {
  currentSearchQuery.value = searchModel.value

}

const onDevotionalDataLoaded = async (data: DevotionalSearch) => {
  const { items, ...pagination } = data
  currentPaginationData.value = { ...pagination }
  loading.value = false
}

const hasSearch = computed(() => !!currentSearchQuery.value)

const clearCurrentSearch = () => {
  currentSearchQuery.value = ''
  currentPage.value = 1
}

const onPreviousPageClicked = () => {
  if (!loading.value && currentPage.value > 1) {
    currentPage.value -= 1
    loading.value = true
  }
}
const onNextPageClicked = () => {
  if (!loading.value) {
    if (currentPaginationData.value)
      currentPage.value = Math.min(currentPage.value + 1, currentPaginationData.value.totalPages)
    else
      currentPage.value += 1
    loading.value = true
  }
}
</script>
