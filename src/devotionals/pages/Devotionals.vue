<template>
  <AppLayout>
    <PageContent>
      <!-- Devotionals Hero -->

      <PageHero>
        <template v-slot:image>
          <img
            src="/logo-bible.png"
            class="object-contain hidden md:block max-h-32"
          />
        </template>
        <h2 class="text-4xl font-bold mb-2 text-slate-900">Featured</h2>
        <p class="text-slate-600">
          Devo description here. ihdshfskhdgkjhduighaehguiwheiu uewhguihriguse
          njng srnjgnsinguidsghen uhcvnsdndv jsvn jvdjn sdjn vdnjbjndjnsnj
        </p>
        <template v-slot:actions>
          <AppButton>Watch Now</AppButton>
          <AppButton variant="primary-outline">View All Devotionals</AppButton>
        </template>
      </PageHero>

      <!-- Categories-->
      <div class="hidden md:flex flex-row justify-between items-center mb-16">
        <Badge
          :icon-name="category.iconName"
          :label="category.label"
          v-for="(category, index) in categories"
          :key="index"
        >
        </Badge>
      </div>

      <form @submit="handleSearchSubmit($event)">
        <div class="px-2">
          <AppInput
            type="input"
            name="query"
            v-model="searchModel"
            placeholder="Search The Scripture"
          >
            <template v-slot:prefix>
              <Icon icon-name="magnify"></Icon>
            </template>
            <template v-slot:postfix>
              <Icon icon-name="magnify"></Icon>
            </template>
          </AppInput>
          <AppButton
            variant="primary-light"
            class="block w-full md:hidden mt-4"
            type="submit"
            >Search</AppButton
          >
        </div>
      </form>

      <br />
      <br />

      <!-- Devotionals Display -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-8 mb-12"
        ref="searchResults"
      >
        <div
          v-for="(devotional, index) in devotionals"
          :key="index"
          class="flex flex-col bg-slate-200 rounded-2xl p-6"
        >
          <h3 class="text-slate-900 text-xl font-title font-bold mb-0">
            {{ formatMaxLengthText(devotional.title, 32) }}
          </h3>
          <p class="text-slate-700 text-sm font-body mb-2">
            {{ devotional.author.firstName }}&nbsp;{{
              devotional.author.lastName
            }}
          </p>
          <p
            class="text-slate-700 text-md font-body mb-3 break-words"
            :title="devotional.description"
          >
            {{ formatMaxLengthText(devotional.description, 64) }}
          </p>
          <!-- Needs fixed to not break mid-word -->
          <p
            class="text-slate-600 text-md text-sm font-body mb-0"
            style="word-wrap: break-word"
          >
            <b>Tags: </b>
            <a v-for="(category, innerIndex) in devotional.categories">
              <a
                v-if="
                  devotional.categories != undefined &&
                  category !=
                    devotional.categories[devotional.categories.length - 1]
                "
                >{{ category.label }},&nbsp;</a
              >
              <a v-else>{{ category.label }}&nbsp;</a>
            </a>
          </p>
          <p
            v-if="devotional.duration"
            class="text-slate-600 text-md font-body text-sm mb-3"
          >
            Duration:
            {{ formatMillisecondsAsReadableDuration(devotional.duration) }}
          </p>
          <div class="flex-auto h-8"></div>
          <a :href="'/devotionals/' + devotional.id" class="w-full block">
            <AppButton variant="primary" class="w-full">
              View Devotional
            </AppButton>
          </a>
        </div>
      </div>
      <div class="flex justify-center">
        <button class="text-slate-400 mb-12" @click="nextPage()">View More ></button>
      </div>

      <!-- My Plans -->
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
export interface SearchDevo {
  q: string;
  n: number;
  s: number;
}
import AppLayout from "../../components/templates/AppLayout.vue";
import PageContent from "../../components/templates/PageContent.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";
import { onMounted, reactive, ref } from "vue";
import Icon from "../../components/atoms/Icon.vue";
import Divider from "../../components/atoms/Divider.vue";
import {
  getFeaturedDevotional,
  getRecentDevotionals,
  getDevotionalCategories,
  searchDevotionals,
} from "../../devotionals/services/DevotionalService";
import {
  formatMillisecondsAsReadableDuration,
  formatMaxLengthText,
} from "../../core/services/FormatService";
import PageHero from "../../components/molecules/PageHero.vue";
import Badge from "../../components/molecules/Badge.vue";
import { useRouter, useRoute } from "vue-router";
import AppInput from "../../components/atoms/form-controls/AppInput.vue";

const loading = true;

const categories = ref<any>([]);

const devotionals = ref<any>([]);

const page = ref(1);
const countPerPage = 8;

const searchModel = ref("");

const route = useRoute();
const router = useRouter();

const searchResultsElement = ref("searchResults");

onMounted(async () => {
  const queryParams: SearchDevo = route.query as any;
  let { q, n, s } = queryParams;

  if (!q && !n && !s) {
    searchDevos("", 0, 0, true);
  } else {
    searchDevos(searchModel.value, n, s, false);
  }
});

const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    await router.push(
      `?q=${encodeURI(searchModel.value.substring(0, 255))}&n=1&s=${8}`
    );
    searchDevos(searchModel.value, 0, 0, false);
  } else {
    await router.replace("/devotionals");
    searchDevos("", 1, 8, true);
  }
};



const nextPage = async () => {
  const queryParams: SearchDevo = route.query as any;
  let { q, n, s } = queryParams;
  console.log(q)
  console.log(n)
  console.log(+n + +1)
  console.log(s)
  if(q && n && s){
    await router.push(
      `?q=${encodeURI(q)}&n=${+n + +1}&s=${s}`
    );
    searchDevos(q, +n + +1, s, false)
  }
};

async function searchDevos(
  searchTerm: string,
  pageNumber: number,
  pageSize: number,
  isBlank: boolean
) {
  if (!isBlank) {
    console.log(pageNumber)
    const searchedDevotionalsTitlePromise = await searchDevotionals(
      searchTerm,
      0,
      pageNumber,
      pageSize
    );
    const searchedDevotionalsTagPromise = await searchDevotionals(
      searchTerm,
      1,
      pageNumber,
      pageSize
    );
    const searchedDevotionalsDescriptionPromise = await searchDevotionals(
      searchTerm,
      2,
      pageNumber,
      pageSize
    );
    const searchedDevotionalsAuthorPromise = await searchDevotionals(
      searchTerm,
      3,
      pageNumber,
      pageSize
    );
    const categoriesPromise = getDevotionalCategories();

    const [
      searchedDevotionalsTag,
      searchedDevotionalsTitle,
      searchedDevotionalsDescription,
      searchedDevotionalsAuthor,
      devotionalCategories,
    ] = await Promise.all([
      searchedDevotionalsTagPromise,
      searchedDevotionalsTitlePromise,
      searchedDevotionalsDescriptionPromise,
      searchedDevotionalsAuthorPromise,
      categoriesPromise,
    ]);

    categories.value = devotionalCategories.items;
    devotionals.value = searchedDevotionalsTag.concat(
      searchedDevotionalsTitle.concat(
        searchedDevotionalsDescription.concat(searchedDevotionalsAuthor)
      )
    );
  }
  else{
    const featuredDevotionalPromise = getFeaturedDevotional();
    const recentDevotionalsPromise = getRecentDevotionals(
      page.value,
      countPerPage
    );
    const categoriesPromise = getDevotionalCategories();

    const [featuredDevotional, recentDevotionals, devotionalCategories] =
      await Promise.all([
        featuredDevotionalPromise,
        recentDevotionalsPromise,
        categoriesPromise,
      ]);

    categories.value = devotionalCategories.items;
    devotionals.value = recentDevotionals;
  }
}
</script>

<style>
.devotional-card {
  min-width: 25%;
  max-width: 25%;
}
</style>
