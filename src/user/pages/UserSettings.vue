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
        <div>
          <h2 class="text-xl font-bold mb-2 text-slate-700">Avatar:</h2>
          <div class="relative overflow-hidden inline-block">
            <button class="border-2 border-solid rounded border-slate-700 text-slate-700 bg-white pl-4 pr-4 pt-2 pb-2 text-lg font-bold">Upload Avatar</button>
            <input
              type="file"
              id="fileInput"
              class="text-lg absolute left-0 top-0 opacity-0"
              @change="setNeedsSaved(false)"
            />
          </div>
        </div>
      </div>
      <form class="flex justify-center mb-10">
        <div class="px-2 w-full md:w-1/2">
          <h2 class="text-xl font-bold mb-2 text-slate-700">Name:</h2>
          <AppInput
            :isNotSearch="true"
            id="name"
            type="input"
            placeholder="Username"
            :value="user?.profile.name"
            v-model="nameInput"
            @update:modelValue="setNeedsSaved(true, nameInput)"
          ></AppInput>
        </div>
      </form>

      <div class="flex flex-row gap-2 justify-center items-center mb-16">
        <AppButton variant="primary-outline" to="/auth/log-out"
          >Log Out</AppButton
        >
        <AppButton v-if="needsSaved" @click="updateProfile()" variant="primary-outline"
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
  updateUserProfile,
} from "../services/UserService";
import Badge from "../../components/molecules/Badge.vue";
import Divider from "../../components/atoms/Divider.vue";
import PocketBaseClient from "../../api/PocketBaseClient";
import { getBucketUrl } from '../../api/BucketStorageService.js'
import AppInput from "../../components/atoms/form-controls/AppInput.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";

const { user } = useAuth();
const userProfileImage = ref();

const router = useRouter();

const nameInput = ref();
const needsSaved = ref(false);

onMounted(async () => {
  nameInput.value = user.value?.profile.name;
  userProfileImage.value = getUserProfileImage(user.value);

  if (!user.value) return router.replace("/");
});

async function updateProfile() {
  var fileInput = document.getElementById("fileInput");
  if(fileInput?.files.length != 0){
    user.value = await updateUserProfile(
      nameInput.value,
      "Christian, Game Dev, Software Engineer, Web Designer.",
      fileInput?.files[0],
      user.value
    );
    userProfileImage.value = getUserProfileImage(user.value);
    needsSaved.value = false;
  }
  else{
    let pfpBlob = await fetch(getBucketUrl(user.value?.profile, user.value?.profile.avatar, {})).then(r => r.blob());
    user.value = await updateUserProfile(
      nameInput.value,
      "Christian, Game Dev, Software Engineer, Web Designer.",
      pfpBlob,
      user.value
    );
    userProfileImage.value = getUserProfileImage(user.value);
    needsSaved.value = false;
  }
}

function setNeedsSaved(isNameBar:boolean, value?:string){
  if(isNameBar){
    needsSaved.value = true;
    if(value == user.value?.profile.name){
      needsSaved.value = false;
    }
  }
  else{
    needsSaved.value = true;
  }
}
</script>

<style></style>