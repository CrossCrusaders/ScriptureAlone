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
      <div
        class="w-full border-2 border-solid rounded border-slate-400 mb-4 p-4"
      >
        <div class="flex justify-center mb-4 mt-2">
          <div>
            <h2 class="text-xl font-bold mb-2 text-slate-700">Avatar:</h2>
            <div class="flex flex-row gap-4 overflow-hidden inline-block">
              <div>
                <img
                  @click=""
                  :src="tempUserProfileImage"
                  class="max-h-32 w-32 h-32 max-w-32 hover:brightness-75 transition-all rounded-full"
                />
              </div>
              <div class="flex flex-col gap-4 overflow-hidden inline-block">
                <div class="relative overflow-hidden inline-block">
                  <button
                    class="border-2 border-solid rounded border-slate-700 text-slate-700 bg-white text-lg font-bold max-h-16 w-48 h-16 max-w-48"
                  >
                    Change Profile Picture
                  </button>
                  <input
                    type="file"
                    id="fileInput"
                    class="text-lg absolute left-0 top-0 opacity-0 max-h-16 w-48 h-16 max-w-48"
                    ref="pfpInput"
                    @change="getTempPFP($event); setNeedsSaved(false, $event, false, true);"
                  />
                </div>
                <div class="relative overflow-hidden inline-block">
                  <button
                    class="border-2 border-solid rounded border-slate-700 text-slate-700 bg-white text-lg font-bold max-h-8 w-48 h-8 max-w-48"
                    @click="tempUserProfileImage = userProfileImage; pfpInput.value = null; setNeedsSaved(false, null, true);"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form class="flex justify-center mb-4">
          <div class="px-2 w-full md:w-1/2">
            <h2 class="text-xl font-bold mb-2 text-slate-700">Name:</h2>
            <AppInput
              :isNotSearch="true"
              id="name"
              type="input"
              placeholder="Username"
              v-model="nameInput"
              @update:modelValue="setNeedsSaved(true, nameInput)"
            ></AppInput>
          </div>
        </form>
        <div class="flex justify-center mb-4">
          <div>
            <h2 class="text-xl font-bold mb-2 text-slate-700">Push Notifications:</h2>
            <div class="flex justify-center overflow-hidden inline-block">
              <input type="checkbox" class="w-6 h-6" value="true" />
            </div>
          </div>
        </div>
        <div class="flex justify-center mb-4">
          <div>
            <h2 class="text-xl font-bold mb-2 text-slate-700">Email Notifications:</h2>
            <div class="flex justify-center inline-block">
              <input type="checkbox" class="w-6 h-6" value="true" />
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-2 justify-center items-center mb-2">
          <AppButton variant="primary-outline" to="/auth/log-out">Log Out</AppButton>
          <AppButton v-if="needsSaved" @click="updateProfile()" variant="primary-outline"
            >Save</AppButton
          >
        </div>
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
import { getUserProfileImage, updateUserProfile } from "../services/UserService";
import Badge from "../../components/molecules/Badge.vue";
import Divider from "../../components/atoms/Divider.vue";
import PocketBaseClient from "../../api/PocketBaseClient";
import { getBucketUrl } from "../../api/BucketStorageService.js";
import AppInput from "../../components/atoms/form-controls/AppInput.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";
import Icon from "../../components/atoms/Icon.vue";
import { hasChanged } from "@vue/shared";
import { change } from "dom7";

const { user } = useAuth();
const userProfileImage = ref();
const tempUserProfileImage = ref();

const router = useRouter();

const nameInput = ref();
const pfpInput = ref();

const needsSaved = ref(false);

onMounted(async () => {
  nameInput.value = user.value?.profile.name;
  userProfileImage.value = getUserProfileImage(user.value);
  tempUserProfileImage.value = getUserProfileImage(user.value);

  if (!user.value) return router.replace("/");
});

async function updateProfile() {
  var fileInput = document.getElementById("fileInput");
  if (fileInput?.files.length != 0) {
    user.value = await updateUserProfile(
      nameInput.value,
      "Christian, Game Dev, Software Engineer, Web Designer.",
      fileInput?.files[0],
      user.value
    );
    userProfileImage.value = getUserProfileImage(user.value);
    needsSaved.value = false;
  } else {
    let pfpBlob = await fetch(
      getBucketUrl(user.value?.profile, user.value?.profile.avatar, {})
    ).then((r) => r.blob());
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

async function setNeedsSaved(isNameBar: boolean, value?: any, isRemove?: boolean, isChange?: boolean) {
  if (isNameBar) {
    needsSaved.value = true;
    if (value == user.value?.profile.name) {
      needsSaved.value = false;
    }
  }
  else{
    needsSaved.value = true;
    if(isRemove){
      tempUserProfileImage.value = userProfileImage.value;
      needsSaved.value = false;
    }
    else if(isChange){
      var tempPFP = await getTempPFP(value);
      if(tempPFP == userProfileImage.value){
        needsSaved.value = false;
      }
    }
  }
}

async function getTempPFP(event:any){
  var srcElement = event.srcElement;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    tempUserProfileImage.value = uploaded_image;
    return tempUserProfileImage;
  });
  reader.readAsDataURL(srcElement.files[0]);
}
</script>

<style></style>
