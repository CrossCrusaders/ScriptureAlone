<template>
  <AppLayout>
    <PageContent>
      <PageHero>
        <template v-slot:image>
          <img @click="" :src="userProfileImage" class="max-h-32 w-32 h-32 max-w-32 rounded-full" />
        </template>
        <h2 class="text-4xl font-bold mb-2 text-slate-900">
          Hello, {{ user?.profile.name }}!
        </h2>
        <p>
          {{ user?.profile.bio }}
        </p>
      </PageHero>
      <Divider></Divider>
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-bold mb-2 text-slate-700">{{ TabState }}:</h2>
        <div class="flex gap-1">
          <button v-if="TabState != TabStates.Profile" class="border-t-2 border-l-2 border-r-2 border-solid rounded-tl-lg rounded-tr-lg border-slate-400 p-1 hover:bg-slate-200 transition-all" @click="updateTabs(TabStates.Profile)">Profile</button>
          <button v-else class="bg-slate-400 border-t-2 border-l-2 border-r-2 border-solid rounded-tl-lg rounded-tr-lg border-slate-400 p-1">Profile</button>
          <button v-if="TabState != TabStates.Account" class="border-t-2 border-l-2 border-r-2 border-solid rounded-tl-lg rounded-tr-lg border-slate-400 p-1 hover:bg-slate-200 transition-all" @click="updateTabs(TabStates.Account)">Account</button>
          <button v-else class="bg-slate-400 border-t-2 border-l-2 border-r-2 border-solid rounded-tl-lg rounded-tr-lg border-slate-400 p-1">Account</button>
          <!--<button v-if="TabState != TabStates.Notifications" class="border-t-2 border-l-2 border-r-2 border-solid rounded-tl-lg rounded-tr-lg border-slate-400 p-1 hover:bg-slate-200 transition-all" @click="updateTabs(TabStates.Notifications)">Notifications</button>
          <button v-else class="bg-slate-400 border-t-2 border-l-2 border-r-2 border-solid rounded-tl-lg rounded-tr-lg border-slate-400 p-1">Notifications</button>-->
        </div>
      </div>
      <div class="w-full border-2 border-solid rounded-tr-lg rounded-br-lg rounded-bl-lg border-slate-400 mb-4 p-4">
        <!-- Profile Tab -->
        <div v-if="TabState == TabStates.Profile">
          <div class="flex justify-center mb-4 mt-4">
            <div>
              <h2 class="text-xl font-bold mb-2 text-slate-700">Avatar:</h2>
              <div class="flex flex-row gap-4 overflow-hidden inline-block">
                <div>
                  <img @click="" :src="tempUserProfileImage"
                    class="max-h-32 w-32 h-32 max-w-32 hover:brightness-75 transition-all rounded-full" />
                </div>
                <div class="flex flex-col gap-4 overflow-hidden inline-block">
                  <div class="relative overflow-hidden inline-block">
                    <button
                      class="border-2 border-solid rounded border-slate-700 text-slate-700 bg-white text-lg font-bold max-h-8 w-32 h-8 max-w-32 md:w-48 md:max-w-48">
                      Change
                    </button>
                    <input type="file" id="fileInput"
                      class="text-lg absolute left-0 top-0 opacity-0 max-h-8 w-48 h-8 max-w-48" ref="pfpInput"
                      @change="getTempPFP($event); setNeedsSaved(2, TabState, $event);" />
                  </div>
                  <div class="relative overflow-hidden inline-block">
                    <button
                      class="border-2 border-solid rounded border-slate-700 text-slate-700 bg-white text-lg font-bold max-h-8 w-32 h-8 max-w-32 md:w-48 md:max-w-48"
                      @click="resetTempPFP(); setNeedsSaved(1, TabState, null);">
                      Reset
                    </button>
                  </div>
                  <div class="relative overflow-hidden inline-block">
                    <button
                      class="border-2 border-solid rounded border-slate-700 text-slate-700 bg-white text-lg font-bold max-h-8 w-32 h-8 max-w-32 md:w-48 md:max-w-48"
                      @click="removeTempPFP(); setNeedsSaved(1, TabState, null);">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form class="flex justify-center mb-4">
            <div class="px-2 w-full md:w-1/2">
              <h2 class="text-xl font-bold mb-2 text-slate-700">Name:</h2>
              <AppInput :isNotSearch="true" id="name" type="input" placeholder="Username" v-model="nameInput"
                @update:modelValue="setNeedsSaved(0, TabState, nameInput)"></AppInput>
            </div>
          </form>
        </div>
        <!-- Account Tab -->
        <div v-else-if="TabState == TabStates.Account">
          <div class="flex justify-center mb-4 mt-2">
            <AppButton to="/auth/change-email">Change Email</AppButton>
          </div>
          <div class="flex justify-center mb-4">
            <AppButton to="/auth/change-password">Change Password</AppButton>
          </div>
          <div class="flex justify-center mb-4">
            <AppButton to="/auth/delete-account" variant="secondary">Delete Account</AppButton>
          </div>
        </div>
        <!-- Notifications Tab -->
        <div v-else-if="TabState == TabStates.Notifications">
          <div class="flex justify-center">
            <div>
              <h2 class="text-xl font-bold mb-4 mt-4 text-slate-700">Push Notifications:</h2>
              <div class="flex justify-center overflow-hidden inline-block">
                <input v-model="pushNotifications" @change="setNeedsSaved(6, TabState, pushNotifications)" type="checkbox" class="w-6 h-6" value="true" />
              </div>
            </div>
          </div>
          <div class="flex justify-center mb-4">
            <div>
              <h2 class="text-xl font-bold mb-2 text-slate-700">Email Notifications:</h2>
              <div class="flex justify-center inline-block">
                <input v-model="emailNotifications" @change="setNeedsSaved(7, TabState, emailNotifications)" type="checkbox" class="w-6 h-6" value="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-2 justify-center items-center mb-2">
        <AppButton variant="primary-outline" to="/auth/log-out">Log Out</AppButton>
        <AppButton v-if="needsSaved" @click="updateProfile(TabState)" variant="primary-outline">Save</AppButton>
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
import { getUserProfileImage, updateUserProfile, refreshUser } from "../services/UserService";
import Badge from "../../components/molecules/Badge.vue";
import Divider from "../../components/atoms/Divider.vue";
import PocketBaseClient from "../../api/PocketBaseClient";
import { getBucketUrl } from "../../api/BucketStorageService.js";
import AppInput from "../../components/atoms/form-controls/AppInput.vue";
import AppButton from "../../components/atoms/form-controls/AppButton.vue";
import Icon from "../../components/atoms/Icon.vue";
import { hasChanged } from "@vue/shared";
import { change, is } from "dom7";

const { user } = useAuth();
const userProfileImage = ref();
const tempUserProfileImage = ref();
const canSaveAgain = ref(true);

const router = useRouter();

const nameInput = ref();
const pfpInput = ref();
const pushNotifications = ref();
const emailNotifications = ref();

const TabStates = {
  Profile: "Profile",
  Account: "Account",
  Notifications: "Notifications"
};
const TabState = ref(TabStates.Profile);

const needsSaved = ref(false);

onMounted(async () => {
  if (!user.value) return router.replace("/");

  nameInput.value = user.value?.profile.name;
  userProfileImage.value = getUserProfileImage(user.value);
  tempUserProfileImage.value = getUserProfileImage(user.value);
  pushNotifications.value = user.value.profile.pushNotifications;
  emailNotifications.value = user.value.profile.emailNotifications;
});

async function updateProfile(Tab: string) {
  if(canSaveAgain.value != true)
    return;

  var isNull = false;
  var image:any;
  if(tempUserProfileImage.value == "/logo-bible.png"){
    isNull = true;
  }
  if(isNull){
    image = null;
  }

  canSaveAgain.value = false;
  if(Tab == TabStates.Profile){
    var fileInput: any = document.getElementById("fileInput");
    
    if (fileInput?.files.length != 0) {
      if(!isNull){
        image = fileInput?.files[0];
      }
    } else {
      if(!isNull){
        image = await fetch(getBucketUrl(user.value?.profile, user.value?.profile.avatar, {})).then((r) => r.blob());
      }
    }
  }
  else if(Tab == TabStates.Account){

  }
  else if(Tab == TabStates.Notifications){
    if(!isNull){
      image =  await fetch(getBucketUrl(user.value?.profile, user.value?.profile.avatar, {})).then((r) => r.blob());
    }
  }

  user.value = await updateUserProfile(
    nameInput.value,
    "",
    image,
    user.value,
    pushNotifications.value,
    emailNotifications.value
  );
  userProfileImage.value = getUserProfileImage(user.value);
  needsSaved.value = false;
  canSaveAgain.value = true;
}

async function setNeedsSaved(Element: number, Tab: string | null |any, value?: any, addValue?: any) {
  /*
    Element Values:
    0 = nameInput
    1 = removeBtn
    2 = changeBtn
    3 = emailInput
    4 = passwordInput
    5 = confirmPasswordInput
    6 = pushNotifications
    7 = emailNotifications
  */
  if(Tab == TabStates.Profile){
    if (Element == 0) {
      needsSaved.value = true;
      if (value == user.value?.profile.name) {
        needsSaved.value = false;
      }
    }
    else {
      needsSaved.value = true;
      if (Element == 1) {
        if(tempUserProfileImage.value == userProfileImage.value){
          needsSaved.value = false;
        }
      }
      else if (Element == 2) {
        var tempPFP:any = await getTempPFP(value);
        if (tempPFP == userProfileImage.value || tempPFP == "/logo-bible.png") {
          needsSaved.value = false;
        }
      }
    }
  }
  else if(Tab == TabStates.Account){
    
  }
  else if(Tab == TabStates.Notifications){
    needsSaved.value = true;
    if(Element == 6){
      if(value == user.value?.profile.pushNotifications){
        needsSaved.value = false;
      }
    }
    else if(Element == 7){
      if(value == user.value?.profile.emailNotifications){
        needsSaved.value = false;
      }
    }
  }
}

async function getTempPFP(event: any) {
  var srcElement = event.srcElement;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    tempUserProfileImage.value = uploaded_image;
    return tempUserProfileImage.value;
  });
  reader.readAsDataURL(srcElement.files[0]);
}
async function resetTempPFP() {
  tempUserProfileImage.value = userProfileImage.value;
  var fileInput: any = document.getElementById("fileInput");
  fileInput.value = null;
}
async function removeTempPFP() {
  tempUserProfileImage.value = "/logo-bible.png"
  var fileInput: any = document.getElementById("fileInput");
  fileInput.value = null;
}

async function updateTabs(Tab: string){
  tempUserProfileImage.value = userProfileImage.value;
  nameInput.value = user.value?.profile.name;
  pushNotifications.value = user.value?.profile.pushNotifications;
  emailNotifications.value = user.value?.profile.emailNotifications;

  TabState.value = Tab;
  needsSaved.value = false;
}
</script>

<style>

</style>
