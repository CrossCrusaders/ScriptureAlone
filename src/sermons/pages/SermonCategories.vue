<template>
  <AppLayout>
    <PageContent>
      <h1 class="max-w-prose mx-auto text-slate-800 text-center text-5xl font-title font-bold mt-8 mb-8">Search
        Topics
      </h1>
      <div class="max-w-prose mx-auto mb-8">
        <form @submit.prevent="onFormSubmit">
          <AppInput placeholder="Search For Topics" v-model="currentQuery">
            <template v-slot:postfix>
              <AppButton variant="primary-minimal" size="sm" type="submit" v-if="!hasSearch">
                <Icon icon-name="magnify"></Icon>
              </AppButton>
              <AppButton variant="primary-minimal" @click="onClearClicked" size="sm" v-else>
                <Icon icon-name="close"></Icon>
              </AppButton>
            </template>
          </AppInput>
        </form>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <CategoryDisplayCard :link="'/sermons/topics/' + category.key" v-for="(category, index) in categories"
          :key="index" :category="category">
        </CategoryDisplayCard>
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppInput from '../../components/atoms/form-controls/AppInput.vue'
import Icon from '../../components/atoms/Icon.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { searchSermonCategories } from '../services/SermonService'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import CategoryDisplayCard from '../../components/molecules/CategoryDisplayCard.vue'
import { Category } from '../Sermon'


const router = useRouter()
const route = useRoute()
const loading = ref<boolean>(false)

const hasSearch = ref(false)

const categories = ref<Category[]>([])
const currentQuery = ref<string>('')

const currentPage = ref(1)
const countPerPage = 27

const onFormSubmit = async () => {
  loadSearchedCategories()
}

const onClearClicked = async () => {
  currentQuery.value = ''
  loadSearchedCategories()
}


const loadSearchedCategories = async () => {
  loading.value = true
  try {
    if (currentQuery.value)
      hasSearch.value = true
    else
      hasSearch.value = false
    const categoriesResult = await searchSermonCategories(currentQuery.value, currentPage.value, countPerPage)
    categories.value = categoriesResult
  }
  finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadSearchedCategories()
})

</script>

<style scoped>

</style>