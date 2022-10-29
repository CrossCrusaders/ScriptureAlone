<template>

  <div class="lg:flex lg:flex-row gap-10">
    <!-- My Plans -->
    <div class="bg-slate-200 rounded-3xl w-full mb-4" v-if="!!user">
      <IconCallToAction class="w-full gap-2">
        <template v-slot:image>
          <Icon icon-name="clipboard-list" :size="16"></Icon>
        </template>

        <div>
          <h1 class="text-xl whitespace-nowrap font-title font-bold">My Favorites</h1>
          <p class="font-body font-lg leading-relaxed">See your favorited content!</p>
        </div>

        <template v-slot:action>
          <AppButton to="/dashboard">
            Show Me!
          </AppButton>
        </template>
      </IconCallToAction>
    </div>

    <div class="bg-slate-200 rounded-3xl w-full mb-4" v-else>
      <IconCallToAction class="w-full gap-2">
        <template v-slot:image>
          <Icon icon-name="clipboard-list" :size="16"></Icon>
        </template>

        <div>
          <h1 class="text-xl whitespace-nowrap font-title font-bold">Not Logged In!</h1>
          <p class="font-body font-lg leading-relaxed">Keep track of your favorites by creating an account.</p>
        </div>

        <template v-slot:action>
          <AppButton variant="secondary" to="/auth/register">
            Sign Up
          </AppButton>
        </template>
      </IconCallToAction>
    </div>

    <!-- Recommended Plans -->
    <div class="bg-slate-200 rounded-3xl w-full mb-4">
      <IconCallToAction class="w-full gap-2">
        <template v-slot:image>
          <Icon icon-name="thumb-up" :size="16"></Icon>
        </template>

        <div>
          <h1 class="text-xl whitespace-nowrap font-title font-bold">Verse Of The Day</h1>
          <p class="font-body font-sm leading-relaxed">Find encouragement from the Word of
            God.</p>
        </div>

        <template v-slot:action>

          <AppButton variant="primary-outline" to="/#votd">
            Go!
          </AppButton>
        </template>
      </IconCallToAction>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconCallToAction from "../molecules/IconCallToAction.vue"
import Icon from '../atoms/Icon.vue'
import AppButton from '../atoms/form-controls/AppButton.vue'
import { useAuth } from "../../auth/services/AuthService";

const { user } = useAuth()
</script>