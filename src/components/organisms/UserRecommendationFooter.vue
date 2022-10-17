<template>

  <div class="lg:flex lg:flex-row gap-10">
    <!-- My Plans -->
    <div class="bg-slate-200 rounded-3xl w-full mb-4">
      <IconCallToAction class="w-full gap-2">
        <template v-slot:image>
          <Icon icon-name="clipboard-list" :size="16"></Icon>
        </template>

        <div>
          <h1 class="text-xl whitespace-nowrap font-title font-bold">My Plans</h1>
          <p class="font-body font-lg leading-relaxed">This is the body</p>
        </div>

        <template v-slot:action>
          <AppButton>
            Click Me!
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
          <h1 class="text-xl whitespace-nowrap font-title font-bold">Recommended Plans</h1>
          <p class="font-body font-sm leading-relaxed">This is the body</p>
        </div>

        <template v-slot:action>
          <AppButton>
            Click Me!
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
</script>