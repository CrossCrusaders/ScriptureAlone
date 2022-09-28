<template>
  <nav v-if="breakpoint === 'sm'">
    <Icon icon-name="menu" @click="mobileMenuOpen = true"></Icon>
    <Transition>
      <div class="top-nav-menu__mobile-menu-panel transition-all bg-gray-800 z-50 text-white px-4 py-2"
        v-if="showMobileMenuOpen">
        <LogoAndName variant="dark"></LogoAndName>
        <div class="mb-4"></div>
        <Icon icon-name="close" class="w-6 h-6 invert absolute right-4 top-6" @click="mobileMenuOpen = false"></Icon>
        <div :class="mobileLinkClass" v-for="item in menuItems" :key="item.label">
          <a :href="item.link ? item.link : '#'" :textContent="item.label"></a>
          <div v-if="item.children && item.children.length">
            <hr>
            <div :class="[mobileLinkClass]" v-for="child in item.children" :key="child.label">
              <a :href="child.link || '#'">{{ child.label }}</a>
            </div>
          </div>
        </div>
        <div v-if="!user">
          <div :class="mobileLinkClass">
            <a href="/auth/log-in">Log In</a>
          </div>
          <div :class="mobileLinkClass">
            <a href="/auth/register">Register</a>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
  <nav class="w-full flex flex-row justify-between items-center" v-else>
    <ul class="flex flex-row gap-4 items-center">
      <li v-for="item in menuItems" :key="item.label" class="top-nav-menu-item">
        <a class="font-bold text-gray-700  p-2 flex flex-row gap-4 items-center" :href="item.link || '#'">
          <span class="underline">{{ item.label }}</span>
          <Icon v-if="item.children && item.children.length" icon-name="chevron-down"></Icon>
        </a>
        <ul class="top-nav-submenu p-4 bg-gray-800 text-white min-w-fit  shadow-lg rounded z-40"
          v-if="item.children && item.children.length">
          <li v-for="child in item.children" :key="child.label">
            <a class="font-bold underline whitespace-nowrap text-center w-full" :href="child.link || '#'">{{ child.label
            }}</a>
          </li>
        </ul>
      </li>
    </ul>
    <div v-if="!user">
      <!-- If Not Logged In: -->

      <AppButton href="/auth/log-in" variant="primary-minimal">Log In</AppButton>
      <AppButton href="/auth/register" variant="primary">Sign Up</AppButton>

    </div>
  </nav>

</template>

<script setup lang="ts">

import { computed, reactive, ref, watch } from 'vue';
import { useBreakpoint } from '../../browser/ViewportService'
import { useAuth } from '../../auth/services/AuthService'
import AppButton from '../atoms/form-controls/AppButton.vue'
import LogoAndName from './LogoAndName.vue';
import Icon from '../atoms/Icon.vue';

const { breakpoint } = useBreakpoint()
const { user } = useAuth()

const mobileLinkClass = "px-3 py-3"

const menuItems = [
  {
    label: 'Home',
    link: '../'
  },
  {
    label: 'Read the Scripture',
    link: '/bible'
  },
  {
    label: 'Study Tools',
    children: [
      {
        label: 'Commentaries',
        link: '/study-tools/commentaries'
      }
    ]
  },
  {
    label: 'Sermons',
    link: '/sermons'
  }
]

const mobileMenuOpen = ref(false)

const showMobileMenuOpen = computed(() => {
  return mobileMenuOpen.value && breakpoint.value === 'sm'
})


</script>

<style lang="css" scoped>
.top-nav-menu-item {
  position: relative;
}

.top-nav-menu-item>ul {
  display: none;
  position: absolute;

}

.top-nav-menu-item:hover>ul {
  display: block;
}

.top-nav-menu__mobile-menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 1;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>