<template>
  <AppLayout>
    <PageContent>
      <!-- Devotionals Hero -->
      <div
        class="rounded-xl bg-slate-200 px-6 py-12 md:py-16 items-center mb-16 md:mt-8"
      >
        <!-- Inner flex parent -->
        <div class="flex flex-col md:flex-row gap-4">
          <img
            src="/logo-bible.png"
            class="object-contain hidden md:block max-h-32"
          />
          <div class="mb-4 md:mb-0">
            <h2 class="text-4xl font-bold mb-2 text-slate-900">Featured</h2>
            <p class="text-slate-600">
              Devo description here. ihdshfskhdgkjhduighaehguiwheiu
              uewhguihriguse njng srnjgnsinguidsghen uhcvnsdndv jsvn jvdjn sdjn
              vdnjbjndjnsnj
            </p>
          </div>
          <div class="flex flex-col gap-2 justify-center">
            <AppButton>Watch Now</AppButton>
            <AppButton variant="primary-outline"
              >View All Devotionals</AppButton
            >
          </div>
        </div>
      </div>

      <!-- Categories-->
      <div class="hidden md:flex flex-row justify-between items-center mb-16">
        <div
          @click="searchDevotionals(category.id, '')"
          class="cursor-pointer rounded-lg bg-slate-200 p-2 px-4"
          v-for="(category, index) in categories"
          :key="index"
        >
          <div class="flex flex-row items-center h-full gap-2">
            <Icon :icon-name="category.iconName"></Icon>
            <span>{{ category.label }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <div
          class="outline outline-2 outline-slate-300 bg-slate-200 rounded-full p-4"
        >
          <input
            id="searchBar"
            type="text"
            placeholder="Search for devotionals"
            class="focus:outline-none active:outline-none bg-slate-200"
          />
          <Icon icon-name="magnify" :size="8"></Icon>
        </div>
      </div>

      <br>
      <select id="filter" value="tag" class="active:outline-none focus:outline-none border-b-[3px] border-solid bg-transparent border-slate-400 py-1 px-2">
        <option value="tag">
          Search By Tag
        </option>
        <option value="title">
          Search By Title
        </option>
      </select>
      <br>
      <br>

      <!-- Devotionals Display -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-8 mb-24"
      >
        <div
          v-for="(devotional, index) in devotionals"
          :key="index"
          class="flex flex-col bg-slate-200 rounded-2xl p-6"
        >
          <h3 class="text-slate-900 text-xl font-title font-bold mb-0">
            {{ devotional.title }}
          </h3>
          <p class="text-slate-700 text-sm font-body mb-2">
            {{ devotional.author.firstName }}&nbsp;{{
              devotional.author.lastName
            }}
          </p>
          <p class="text-slate-700 text-md font-body mb-3 break-words">
            {{ devotional.description }}
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

      <!-- My Plans -->
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
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
import { formatMillisecondsAsReadableDuration } from "../../core/services/FormatService";

const loading = true;

const categories = ref<any>([]);

const devotionals = ref<any>([]);

const page = ref(1);
const countPerPage = 8;

onMounted(async () => {
  var Filter = document.getElementById("filter");
  var SearchBar = document.getElementById("searchBar")
  var searchedDevotionalsPromise:any;

  if(Filter?.value == "tag"){
    searchedDevotionalsPromise = searchDevotionals("", `${SearchBar?.value}`);
  }
  else{
    searchedDevotionalsPromise = searchDevotionals(`${SearchBar?.value}`, "");
  }
  const categoriesPromise = getDevotionalCategories();

  const [searchedDevotionals, devotionalCategories] =
    await Promise.all([
      searchedDevotionalsPromise,
      categoriesPromise,
    ]);

  categories.value = devotionalCategories.items;
  devotionals.value = searchedDevotionals;
});
</script>

<style>
.devotional-card {
  min-width: 25%;
  max-width: 25%;
}
</style>
