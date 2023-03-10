<template>
  <AppLayout>
    <PageContent>
      <PageHero>
        <template v-slot:image>
          <img :src="userProfileImage" class="object-cover max-h-32 w-32 h-32 max-w-32 rounded-full" />
        </template>

        <h2 class="text-4xl font-bold mb-2 text-slate-900">
          Hello, {{ user?.profile.name }}!
        </h2>
        <p class="text-slate-600">
          We're glad you are here, remember to read the Verse of The Day!
        </p>
        <template v-slot:actions>
          <AppButton class="text-center" to="/dashboard/settings">Settings</AppButton>
        </template>
      </PageHero>

      <div class="hidden md:flex flex-row justify-between items-center mb-12">
        <Badge v-for="(category, index) in categories" @click="goToPage(category.link)" :icon-name="category.badge"
          :label="category.name" :key="index" class="cursor-pointer">
        </Badge>
      </div>

      <Divider></Divider>

      <!-- Highlighted Verses -->
      <PageHero>
        <div class="flex justify-center">
          <h1
            class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b] to-[#57687f] text-transparent bg-clip-text pb-2">
            Highlighted Verses
          </h1>
        </div>
        <Divider></Divider>
        <div v-if="versesData.length" class="max-h-96 overflow-y-scroll">
          <div v-for="verse in versesData" @click="
            router.push(
              `bible?b=${verse.book_id}&c=${verse.chapter}&vs=${verse.verse_start}&ve=${verse.verse_end}`
            )
          " :class="`rounded verse-${verse.color} transition-all hover:bg-slate-300 cursor-pointer m-2 p-2`">
            <p class="font-bold">
              {{ `${verse.book_name} ${verse.chapter}:${verse.verse_start}` }}
            </p>
            <p v-html="verse.text"></p>
          </div>
        </div>
        <div v-else class="flex flex-col gap-3 items-center py-4">
          <p class="text-xl mb-2">You haven't hightlighted any verses yet!</p>
          <div>
            <AppButton to="/bible" variant="primary">Read The Bible</AppButton>
          </div>
        </div>
      </PageHero>

      <Divider></Divider>

      <!-- Favorite Sermons -->
      <PageHero>
        <div class="flex justify-center">
          <h1
            class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#57687f] to-[#1e293b] text-transparent bg-clip-text">
            Favorited Sermons
          </h1>
        </div>
        <Divider></Divider>
        <ContentPreviewGrid v-if="favoriteSermons?.length" @click:author="router.push(`/authors/${$event.id}`)"
          :content="favoriteSermons" @click:button="router.push(`/sermons/${$event.id}`)">
        </ContentPreviewGrid>

        <div v-else class="flex flex-col gap-3 items-center py-4">
          <p class="text-xl mb-2">You haven't favorited any sermons yet!</p>
          <div>
            <AppButton to="/sermons" variant="primary">Browse Sermons</AppButton>
          </div>
        </div>
      </PageHero>

      <!-- Favorite Devotionals -->
      <PageHero>
        <div class="flex justify-center">
          <h1
            class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b] to-[#57687f] text-transparent bg-clip-text">
            Favorited Devotionals
          </h1>
        </div>
        <Divider></Divider>

        <ContentPreviewGrid v-if="favoriteDevotionals?.length" @click:author="router.push(`/authors/${$event.id}`)"
          :content="favoriteDevotionals" @click:button="router.push(`/devotionals/${$event.id}`)">
        </ContentPreviewGrid>
        <div v-else class="flex flex-col gap-3 items-center py-4">
          <p class="text-xl mb-2">You haven't favorited any devotionals yet!</p>
          <div>
            <AppButton to="/devotionals" variant="primary">Browse Devotionals</AppButton>
          </div>
        </div>
      </PageHero>

      <br />

      <div class="flex flex-row justify-center items-center mb-16">
        <AppButton variant="primary-outline" to="/auth/log-out">Log Out</AppButton>
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "../../components/templates/AppLayout.vue";
import PageContent from "../../components/templates/PageContent.vue";
import PageHero from "../../components/molecules/PageHero.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";
import { useAuth } from "../../auth/services/AuthService";
import { getUserProfileImage, useUserFavorites } from "../services/UserService";
import Badge from "../../components/molecules/Badge.vue";
import ContentPreviewGrid from "../../components/molecules/ContentPreviewGrid.vue";
import { getUserFavoriteDevotionals } from "../../devotionals/services/DevotionalService";
import { getUserFavoriteSermons } from "../../sermons/services/SermonService";
import { getUserHighlightedVerses, getVerses } from "../../bible/services/BibleService";
import Divider from "../../components/atoms/Divider.vue";

const categories = ref<any>([
  { name: "Read VOTD", link: "/?votd=t", badge: "book-heart" },
  { name: "Are you failing?", link: "", badge: "hands-pray" },
  {
    name: "Are you truly saved?",
    link: "https://independentbaptist.church/salvation",
    badge: "cross",
  },
  {
    name: "Join a Bible-based church.",
    link: "https://independentbaptist.church/",
    badge: "church",
  },
]);

const chapters = ref<any>([]);
const versesData = ref<any>([]);

const { user } = useAuth();
const { loadFavorites } = useUserFavorites();
const userProfileImage = getUserProfileImage(user.value);

const router = useRouter();

const favoriteDevotionals = ref<any>([]);
const favoriteSermons = ref<any>([]);

onMounted(async () => {
  if (!user.value) return router.replace("/");

  const devotionalSearch = await getUserFavoriteDevotionals(user.value.id, 1, 8);
  const sermonSearch = await getUserFavoriteSermons(user.value.id, 1, 8);

  favoriteDevotionals.value = devotionalSearch.items;
  favoriteSermons.value = sermonSearch.items;

  await loadFavorites();
  chapters.value = await getUserHighlightedVerses();
  chapters.value.forEach(async (verse: any) => {
    var verseData = await (
      await getVerses(
        verse.book_id,
        parseInt(verse.chapter),
        parseInt(verse.verse.verse),
        parseInt(verse.verse.verse)
      )
    ).verses[0];
    versesData.value.push({
      book_name: verseData.book_name,
      book_id: verseData.book_id,
      chapter: verseData.chapter,
      verse_start: verseData.verse_start,
      text: verseData.text
        .replaceAll('"JESUS_START" ', '<span class="text-red-500">')
        .replaceAll(' "JESUS_END"', "</span>"),
      color: verse.verse.color,
    });
  });
});

async function goToPage(link: string) {
  if (link.startsWith("https://")) {
    window.location.href = link;
  } else {
    await router.push(link);
  }
}
</script>

<style>
.verse-green {
  background-color: rgba(0, 255, 0, 0.2);
}

.verse-blue {
  background-color: rgba(0, 0, 255, 0.2);
}

.verse-red {
  background-color: rgba(255, 0, 0, 0.2);
}

.verse-pink {
  background-color: rgba(255, 0, 170, 0.2);
}

.verse-yellow {
  background-color: rgba(217, 255, 0, 0.2);
}
</style>
