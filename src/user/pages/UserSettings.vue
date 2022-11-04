<template>
  <AppLayout>
    <PageContent>
      <PageHero>
        <template v-slot:image>
          <img
            @click=""
            :src="userProfileImage"
            class="max-h-32 w-32 h-32 max-w-32 rounded-full"
          />
        </template>
        <h2 class="text-4xl font-bold mb-2 text-slate-900">
          Hello {{ user?.profile.name }}
        </h2>
      </PageHero>
      <div class="flex justify-center mb-10">
        <div class="relative overflow-hidden inline-block">
          <h2 class="text-xl font-bold mb-2 text-slate-700">Avatar:</h2>
          <button
            class="border-2 border-solid rounded border-slate-700 text-slate-700 bg-white pl-2 pr-2 pt-4 pb-4 text-lg font-bold"
          >
            Upload
          </button>
          <input
            type="file"
            id="fileInput"
            class="absolute left-0 top-0 opacity-0 text-xl"
          />
          <p id="ImageName"></p>
        </div>
      </div>
      <form class="flex justify-center mb-10">
        <div class="px-2 w-full md:w-1/2">
          <h2 class="text-xl font-bold mb-2 text-slate-700">Name:</h2>
          <AppInput
            id="name"
            type="input"
            placeholder="Username"
            v-model="nameInput"
          ></AppInput>
        </div>
      </form>

      <div class="flex flex-row gap-2 justify-center items-center mb-16">
        <AppButton variant="primary-outline" to="/auth/log-out"
          >Log Out</AppButton
        >
        <AppButton @click="updateProfile()" variant="primary-outline"
          >Save</AppButton
        >
      </div>
    </PageContent>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppLayout from "../../components/templates/AppLayout.vue";
import PageContent from "../../components/templates/PageContent.vue";
import PageHero from "../../components/molecules/PageHero.vue";
import { useAuth } from "../../auth/services/AuthService";
import {
  getUserProfileImage,
  useUserFavorites,
  updateUserProfile,
} from "../services/UserService";
import Badge from "../../components/molecules/Badge.vue";
import ContentPreviewGrid from "../../components/molecules/ContentPreviewGrid.vue";
import {
  getRecentDevotionals,
  getUserFavoriteDevotionals,
} from "../../devotionals/services/DevotionalService";
import {
  getRecentSermons,
  getUserFavoriteSermons,
} from "../../sermons/services/SermonService";
import Divider from "../../components/atoms/Divider.vue";
import IconPhoto from "../../components/atoms/IconPhoto.vue";
import PocketBaseClient from "../../api/PocketBaseClient";
import AppInput from "../../components/atoms/form-controls/AppInput.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";

const categories = ref<any>([
  { name: "Read VOTD", link: "/#VOTD", badge: "book-heart" },
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

const { user } = useAuth();
const { loadFavorites } = useUserFavorites();
const userProfileImage = ref();

const router = useRouter();

const nameInput = ref("");

const favoriteDevotionals = ref<any>([]);
const favoriteSermons = ref<any>([]);

onMounted(async () => {
  userProfileImage.value = getUserProfileImage(user.value);

  if (!user.value) return router.replace("/");

  const devotionalSearch = await getUserFavoriteDevotionals(
    user.value.id,
    1,
    8
  );
  const sermonSearch = await getUserFavoriteSermons(user.value.id, 1, 8);

  favoriteDevotionals.value = devotionalSearch.items;
  favoriteSermons.value = sermonSearch.items;

  await loadFavorites();
});

async function goToPage(link: string) {
  if (link.startsWith("https://")) {
    window.location.href = link;
  } else {
    await router.replace(link);
  }
}
const fileInput = document.getElementById("fileInput");
async function updateProfile() {
  user.value = await updateUserProfile(
    nameInput.value,
    "This Might Be A Bio",
    fileInput?.files[0],
    user.value
  );
  userProfileImage.value = getUserProfileImage(user.value);
}
</script>

<style></style>
