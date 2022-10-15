<template>
  <AppLayout>
    <PageContent>
      <h1 class="max-w-prose mx-auto text-slate-800 text-center text-5xl font-title font-bold mt-8 mb-8">Search
        Preachers
      </h1>
      <div class="max-w-prose mx-auto mb-8">
        <form @submit.prevent="onFormSubmit">
          <AppInput placeholder="Search For Preachers" v-model="currentQuery">
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
        <AuthorDisplayCard :link="'/sermons/authors/' + author.id" v-for="(author, index) in authors" :key="index"
          :author="author">
        </AuthorDisplayCard>
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../../components/templates/AppLayout.vue'
import PageContent from '../../components/templates/PageContent.vue'
import AppInput from '../../components/atoms/form-controls/AppInput.vue';
import Icon from '../../components/atoms/Icon.vue'
import AuthorDisplayCard from '../../components/molecules/AuthorDisplayCard.vue';
import { useRoute, useRouter } from 'vue-router';
import { Author } from '../../authors/Author';
import { onMounted, ref } from 'vue';
import { searchAuthors } from '../../authors/services/AuthorService';
import AppButton from '../../components/atoms/form-controls/AppButton.vue';


const router = useRouter()
const route = useRoute()
const loading = ref<boolean>(false)

const hasSearch = ref(false)

const authors = ref<Author[]>([])
const currentQuery = ref<string>('')

const currentPage = ref(1)
const countPerPage = 27

const onFormSubmit = async () => {
  loadSearchedAuthors()
}

const onClearClicked = async () => {
  currentQuery.value = ''
  loadSearchedAuthors()
}


const loadSearchedAuthors = async () => {
  loading.value = true
  try {
    if (currentQuery.value)
      hasSearch.value = true
    else
      hasSearch.value = false
    const authorsResult = await searchAuthors(currentQuery.value, currentPage.value, countPerPage)
    authors.value = authorsResult
  }
  finally {
    loading.value = false
  }

}

onMounted(async () => {
  loadSearchedAuthors()
})

</script>

<style scoped>

</style>