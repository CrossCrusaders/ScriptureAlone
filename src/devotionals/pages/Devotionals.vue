<template>
  <AppLayout>
    <PageContent>
      <h1 id="page-title__devotional-authors"
        class="max-w-prose mx-auto text-slate-800 text-center text-5xl font-title font-bold mt-8 mb-8">Search
        Devotionals
      </h1>
      <div class="max-w-prose mx-auto">
        <form @submit.prevent="onFormSubmit">
          <AppInput placeholder="Search For Devotionals" v-model="currentQuery">
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
      <div class="max-w-prose mx-auto mb-8 flex flex-row gap-6 font-title font-semibold text-slate-500">
        <div>
          <AppSelect class="mr-0 md:mr-4" v-model="minMonth">
            <option v-for="mon in monthDays" :value="mon.index">
              {{ mon.name }}
            </option>
          </AppSelect>
          <AppSelect v-model="minYear">
            <option v-for="yr in years" :value="yr">
              {{ yr }}
            </option>
          </AppSelect>
        </div>
        <p class="font-bold mt-1 md:mt-2">&#8212;</p>
        <div>
          <AppSelect class="mr-0 md:mr-4" v-model="maxMonth">
            <option v-for="mon in monthDays" :value="mon.index">
              {{ mon?.name }}
            </option>
          </AppSelect>
          <AppSelect v-model="maxYear">
            <option v-for="yr in years" :value="yr">
              {{ yr }}
            </option>
          </AppSelect>
        </div>
      </div>
      <InfiniteScrollContent @scroll:end="onScrollEnd">
        <DevotionalsPreviewGrid @data:loaded="loading = false" :append-content="true" :per-page="16" :page="currentPage"
          :query="searchedQuery" :query-params="queryParams" :min-date="minDevoDate" :max-date="maxDevoDate">
        </DevotionalsPreviewGrid>
      </InfiniteScrollContent>
      <div v-if="reachedEnd">
        <p class="text-center text-xl font-bold mb-4">End of Results</p>
        <p class="text-center text-xl mb-8 underline">
          <a href="#page-title__devotional-authors">
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
import AppSelect from '../../components/atoms/form-controls/AppSelect.vue'
import Icon from '../../components/atoms/Icon.vue'
import { onMounted, ref, watch } from 'vue'
import AppButton from '../../components/atoms/form-controls/AppButton.vue'
import InfiniteScrollContent from '../../components/templates/InfiniteScrollContent.vue'
import DevotionalsPreviewGrid from '../components/DevotionalsPreviewGrid.vue'

const loading = ref<boolean>(false)
const reachedEnd = ref<boolean>(false)
const queryParams = ref<any>({})

const hasSearch = ref(false)

const currentQuery = ref<string>('')
const searchedQuery = ref<string>('')

const currentPage = ref(1)
const countPerPage = 27

const minYear = ref<any>();
const minMonth = ref<any>();
const minDevoDate = ref("");
const maxYear = ref<any>();
const maxMonth = ref<any>();
const maxDevoDate = ref("");
const monthDays = ref([
  { value: 31, name: "Jan", index: 0 },
  { value: 29, name: "Feb", index: 1 },
  { value: 31, name: "Mar", index: 2 },
  { value: 30, name: "Apr", index: 3 },
  { value: 31, name: "May", index: 4 },
  { value: 30, name: "Jun", index: 5 },
  { value: 31, name: "Jul", index: 6 },
  { value: 31, name: "Aug", index: 7 },
  { value: 30, name: "Sep", index: 8 },
  { value: 31, name: "Oct", index: 9 },
  { value: 30, name: "Nov", index: 10 },
  { value: 31, name: "Dec", index: 11 }
]);
const years = ref([
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017"
]);

onMounted(async()=>{
  watch(() => minMonth.value, () => {
    minDevoDate.value = transformDate(minMonth.value, minYear.value);
  });
  watch(() => maxMonth.value, () => {
    maxDevoDate.value = transformDate(maxMonth.value, maxYear.value, true);
  });
  watch(() => minYear.value, () => {
    minDevoDate.value = transformDate(minMonth.value, minYear.value);
  });
  watch(() => maxYear.value, () => {
    maxDevoDate.value = transformDate(maxMonth.value, maxYear.value, true);
  });

  maxMonth.value = ((new Date).getMonth() + 1).toString();
  maxYear.value = (new Date).getFullYear();
  minYear.value = 2019;
  minMonth.value = 0;
})

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

function transformDate(mm: any, yy: any, max?: boolean){
  var MM = mm;
  MM++;
  var DD;
  DD = "01";
  if(max)
    DD = monthDays.value[parseInt(mm)].value;
  if(MM != ("10" || "11" || "12" || 10 || 11 || 12))
    MM = "0" + MM;
  return `${yy}-${MM}-${DD}`;
}
</script>

<style scoped>

</style>