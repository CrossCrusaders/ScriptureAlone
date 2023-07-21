<template>
  <AppLayout>
    <!-- Search Hero -->
    <div class="flex flex-col items-center">
      <RouterLink to="/bible">
        <img class="transition-all hover:rotate-12 hover:scale-105 object-contain max-h-40 md:max-h-60 block md:mb-4"
          src="/logo-bible.png" />
      </RouterLink>
      <div class="flex flex-col items-center">
        <h1 v-if="breakpoint != 'sm'" class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b]
                to-[#57687f] text-transparent bg-clip-text">
          Scripture Alone
        </h1>
        <p v-if="breakpoint != 'sm'" class="font-body text-lg mb-2">Sound Doctrine Guaranteed</p>

        <form class="mb-2 md:mb-0" @submit="handleSearchSubmit($event)">
          <div class="px-2">
            <AppInput type="input" name="query" v-model="searchModel" placeholder="Search The Scripture">
              <template v-slot:prefix>
                <Icon icon-name="magnify"></Icon>
              </template>
            </AppInput>
            <AppButton variant="primary-light" class="block w-full md:hidden mt-4" type="submit">Search</AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Page Divider -->
    <Divider v-if="breakpoint == 'sm'" class="w-1/2 mx-auto"></Divider>

    <!-- Calls To Action -->
    <div class="flex flex-col md:flex-row gap-2 items-center justify-between mb-2 p-2">
      <RouterLink :class="callToActionItemClass" to="/truth-resources">
        <Icon icon-name="book-cross" color="black" hoverColor="text-white" :class="[callToActionIconClass]" :size="56">
        </Icon>
        <span class="text-center text-xl lg:text-4xl">Truth Resources</span>
      </RouterLink>
      <RouterLink :class="callToActionItemClass" to="/bible/votd">
        <Icon icon-name="notebook-edit" color="black" hoverColor="text-white" :class="[callToActionIconClass]" :size="56">
        </Icon>
        <span class="text-xl md:text-2xl lg:text-4xl">Verse of the Day</span>
      </RouterLink>
      <RouterLink :class="callToActionItemClass" to="/devotionals">
        <Icon icon-name="notebook-edit" color="black" hoverColor="text-white" :class="[callToActionIconClass]" :size="56">
        </Icon>
        <span class="text-xl md:text-2xl lg:text-4xl">Devotionals</span>
      </RouterLink>
    </div>

    <!-- Page Divider -->
    <Divider class="w-1/2 mx-auto"></Divider>

    <!-- Latest Devotionals -->
    <div class="relative p-2 md:p-8 mb-16">
      <h2 class="font-bold font-title mb-8 md:mb-16 text-4xl">
        Recommended Devotionals
      </h2>
      <ContentCarousel :slides="devoList" base-url="devotionals"></ContentCarousel>
    </div>
  </AppLayout>
</template>

<style>
.verse-number {
  padding-right: 0.5em;
  font-weight: bold;
}
</style>

<script setup lang="ts">
import AppLayout from "../../components/templates/AppLayout.vue";
import AppInput from "../../components/atoms/form-controls/AppInput.vue";
import { ref, onMounted } from "vue";
import Divider from "../../components/atoms/Divider.vue";
import ContentCarousel from "../../components/molecules/ContentCarousel.vue";
import Icon from "../../components/atoms/Icon.vue";
import { useRouter } from "vue-router";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";
import { useBreakpoint } from '../../browser/ViewportService'
import { getSearch } from '../../search/services/SearchService'
import { isBibleReference } from "../../bible/services/BibleService";

let devoList = ref<any[]>([])

const { breakpoint } = useBreakpoint();

onMounted(async () => {
  const recentDevotionalsPromise = getSearch("devotionals", "", 1, 6, []);
  const [recentDevotionals] = await Promise.all([recentDevotionalsPromise]);

  devoList.value = recentDevotionals.items;
});

const searchModel = ref("");
const callToActionItemClass = [
  "cta-item border-slate-700",
  "md:w-2/6",
  "w-full",
  "h-48",
  "lg:h-64",
  "cursor-pointer",
  "bg-slate-200",
  "rounded-xl",
  "px-4",
  "py-8",
  "md:py-16",
  "flex",
  "flex-col",
  "items-center",
  "text-slate-900",
  "justify-center",
  "text-4xl",
  "font-bold",
  "font-title",
  "hover:bg-slate-800",
  "hover:text-white",
  "transition-all",
];

const callToActionIconClass = "cta-icon mb-2";

const router = useRouter();

const handleSearchSubmit = async (event: Event) => {
  event.preventDefault();
  if (searchModel.value && searchModel.value.length) {
    const result = await isBibleReference(searchModel.value);
    if (result) {
      return router.push(
        `/bible?c=${result.chapter}&b=${result.book_id}&vs=${result.verse_start}&ve=${result.verse_end}`
      );
    } else {
      return router.push(
        `/bible/search?q=${encodeURI(
          searchModel.value.substring(0, 255)
        )}`
      );
    }
  }
};
</script>

<style>
.cta-item .cta-icon {
  filter: invert(0);
  transition: filter 150ms ease;
}

.cta-item:hover .cta-icon {
  filter: invert(1);
}

.votdMenu-enter-active,
.votdMenu-leave-active {
  animation: bounce-in 0.7s ease;
  max-height: 100%;
}

.votdMenu-enter-from,
.votdMenu-leave-to {
  /* transform: scale(0); */
  opacity: 0;
  max-height: 0;
}

@keyframes bounce-in {
  0% {
    transform: translateY(-10em);
    opacity: 0;
  }

  50% {
    transform: translateY(-10em);
    opacity: 0;
  }

  100% {
    transform: translateY(0em);
    opacity: 1;
  }
}
</style>
