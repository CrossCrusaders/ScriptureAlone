<template>
  <AppLayout>
    <PageContent>
      <!-- Devotionals Hero -->

      <PageHero>
        <template v-slot:image>
          <img src="/logo-bible.png" class="object-contain hidden md:block max-h-32" />
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

      <form @submit="handleSearchSubmit($event)" class="flex justify-center">
        <div class="px-2 w-full md:w-1/2">
          <AppInput id="searchBar" type="input" name="query" v-model="searchModel" placeholder="Search Devotionals">
            <template v-slot:prefix>

            </template>
            <template v-slot:postfix>
              <Icon icon-name="magnify"></Icon>
            </template>
          </AppInput>
          <AppButton variant="primary-light" class="block w-full md:hidden mt-4" type="submit">Search</AppButton>
        </div>
      </form>

      <br />
      <br />

      <!-- Devotionals Display -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-8 mb-12"
        ref="searchResults">
        <div name="devoHolder" v-for="(devotional, index) in devotionals" :key="index"
          class="flex flex-col bg-slate-200 rounded-2xl p-6">
          <span class="text-slate-900 text-xl font-title font-semibold mb-0 break-words"
            v-html="formatSearchResultText(formatMaxLengthText(devotional.title, 32))"></span>
          <p class="text-slate-700 text-sm font-body mb-2"
            v-html="formatSearchResultText(devotional.author.firstName + ' ' + devotional.author.lastName)"></p>
          <span class="text-slate-700 text-md font-body mb-3 break-words" :title="devotional.description"
            v-html="formatSearchResultText(formatMaxLengthText(devotional.description, 64))">
          </span>
          <!-- Needs fixed to not break mid-word -->
          <p class="text-slate-600 text-md text-sm font-body mb-0" style="word-wrap: break-word">
            <b>Tags: </b>
            <a v-for="(category, index) in devotional.categories">
              <a v-if="devotional.categories != undefined && category != devotional.categories[devotional.categories.length - 1]"
                v-html="formatSearchResultText(category.label + ', ')">

              </a>
              <a v-else v-html="formatSearchResultText(category.label)"></a>
            </a>
          </p>
          <p v-if="devotional.duration" class="text-slate-600 text-md font-body text-sm mb-3">
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
        <button class="text-slate-400 mb-12" @click="nextPage($event)">
          View More >
        </button>
      </div>

      <!-- My Plans -->
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
export interface SearchDevo {
  q: string;
  n: number;
  s: number
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
import { Devotional } from "../Devotional";

const loading = true;

const categories = ref<any>([]);

const devotionals = ref<any>([]);

const search = ref("");

const page = ref(1);
const countPerPage = 8;

const searchModel = ref("");

const route = useRoute();
const router = useRouter();

const devotionalElements = ref("devoHolder");


onMounted(async () => {
  const queryParams: SearchDevo = route.query as any;
  let { q, n, s } = queryParams;
  if (q != "" && n && s) {
    searchDevos(q, n, s, false);
  }
  else if (q == "" && n && s) {
    searchDevos("", n, s, true);
  }
  else {
    searchDevos("", 1, 8, true);
  }
});

const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    await router.push(
      `?q=${encodeURI(searchModel.value.substring(0, 255))}&n=1&s=${8}`
    );
    searchDevos(searchModel.value, 1, 8, false);
  } else {
    await router.replace("/devotionals");
    searchDevos("", 1, 8, true);
  }
};

const nextPage = async (event: Event) => {
  event.preventDefault();
  const queryParams: SearchDevo = route.query as any;
  let { q, n, s } = queryParams;
  if (q != "" && n && s) {
    await router.push(`?q=${encodeURI(q)}&n=${+n + +1}&s=${s}`);
    searchDevos(q, +n + +1, s, false);
  }
  else if (q == "" && n && s) {
    await router.push(`?q=&n=${+n + +1}&s=${s}`);
    searchDevos("", +n + +1, s, true);
  }
  else {
    await router.push(`?q=&n=${2}&s=${8}`);
    searchDevos("", 2, 8, true);
  }
};

async function searchDevos(searchTerm: string, pageNumber: number, pageSize: number, isBlank: boolean) {
  search.value = searchTerm;
  if (!isBlank) {
    const searchedDevotionalsTagPromise = await searchDevotionals(searchTerm, pageNumber, pageSize);
    const categoriesPromise = getDevotionalCategories();

    const [
      searchedDevotionalsTag,
      devotionalCategories,
    ] = await Promise.all([
      searchedDevotionalsTagPromise,
      categoriesPromise,
    ]);

    categories.value = devotionalCategories.items;
    devotionals.value = searchedDevotionalsTag;
  } else {
    const featuredDevotionalPromise = getFeaturedDevotional();
    const recentDevotionalsPromise = getRecentDevotionals(
      pageNumber,
      pageSize
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

const formatSearchResultText = (devo: string) => {
  var searches = search.value.split(" ");
  var Text = "";
  for (let i = 0; i < searches.length; i++) {
    if (i != 0) {
      Text = Text.replace(new RegExp('(' + searches[i] + ')', 'ig'), `<strong>$1</strong>`);
    }
    else {
      Text = devo.replace(new RegExp('(' + searches[i] + ')', 'ig'), `<strong>$1</strong>`);
    }
  }
  return `<span>${Text}</span>`
}
</script>

<style>
.devotional-card {
  min-width: 25%;
  max-width: 25%;
}
</style>
