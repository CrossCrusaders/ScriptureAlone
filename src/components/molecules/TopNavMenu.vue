<template>
  <nav v-if="breakpoint === 'sm'" class="mt-4">
    <Icon icon-name="menu" @click="mobileMenuOpen = true"></Icon>
    <Transition>
      <div class="top-nav-menu__mobile-menu-panel transition-all bg-gray-800 z-50 text-white px-4 py-2"
        v-if="showMobileMenuOpen">
        <LogoAndName variant="dark" class="mt-4"></LogoAndName>
        <div class="mb-4"></div>
        <Icon icon-name="close" color="white" class="w-6 h-6 absolute right-4 top-6 mt-4" @click="mobileMenuOpen = false"></Icon>
        <div :class="mobileLinkClass" v-for="item in menuItems" :key="item.label">
          <RouterLink :to="item.link ? item.link : '#'" :textContent="item.label"></RouterLink>
          <div v-if="item.children && item.children.length">
            <hr>
            <div :class="[mobileLinkClass]" v-for="child in item.children" :key="child.label">
              <RouterLink :to="child.link || '#'">{{ child.label }}</RouterLink>
            </div>
          </div>
        </div>
        <div v-if="!user">
          <div :class="mobileLinkClass">
            <RouterLink to="/auth/log-in">Log In</RouterLink>
          </div>
          <div :class="mobileLinkClass">
            <RouterLink to="/auth/register">Register</RouterLink>
          </div>
        </div>
        <div v-else>
          <RouterLink to="/dashboard">
            <UserProfileBadge></UserProfileBadge>
          </RouterLink>
          <RouterLink :class="mobileLinkClass" to="/auth/log-out">Log Out</RouterLink>
        </div>
        <!--<div :class="mobileLinkClass">
          <a href="#">Donate</a>
        </div>-->
      </div>
    </Transition>
  </nav>
  <nav class="w-full flex flex-row justify-between items-center" v-else>
    <ul class="flex flex-row gap-4 items-center">
      <li v-for="item in menuItems" :key="item.label" class="top-nav-menu-item mt-2">
        <RouterLink v-if="item.link != null" class="font-bold text-gray-700  p-2 flex flex-row gap-4 items-center" :to="item.link">
          <span class="underline">{{ item.label }}</span>
        </RouterLink>
        <span v-else class="font-bold text-gray-700 p-2 flex flex-row items-center">
          <span class="underline">{{ item.label }}</span>
          <Icon v-if="item.children && item.children.length" icon-name="chevron-down" class="mb-3"></Icon>
        </span>
        <ul class="top-nav-submenu p-4 bg-gray-800 text-white min-w-fit shadow-lg rounded z-40"
          v-if="item.children && item.children.length">
          <p v-for="child in item.children" :key="child.label">
            <RouterLink class="font-bold underline whitespace-nowrap text-center w-full" :to="child.link || '#'">{{
            child.label
            }}</RouterLink>
          </p>
        </ul>
      </li>
    </ul>
    <!--<div>
      <DonateButton></DonateButton>
    </div>-->
    <div v-if="!user">
      <AppButton href="/auth/log-in" variant="primary-minimal">Log In</AppButton>
      <AppButton href="/auth/register" variant="primary">Sign Up</AppButton>
    </div>
    <div v-else>
      <RouterLink to="/dashboard">
        <UserProfileBadge></UserProfileBadge>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">

import { computed, ref, onMounted } from 'vue';
import { useBreakpoint } from '../../browser/ViewportService'
import { useAuth } from '../../auth/services/AuthService'
import { refreshUser } from '../../user/services/UserService'
import AppButton from '../atoms/form-controls/AppButton.vue'
import LogoAndName from './LogoAndName.vue'
import Icon from '../atoms/Icon.vue'
import UserProfileBadge from '../organisms/UserProfileBadge.vue';
import DonateButton from './DonateButton.vue';

const { breakpoint } = useBreakpoint()
const { user } = useAuth()

onMounted(async() => {
  if(user.value != null)
    var Refresher = await refreshUser();
})

const mobileLinkClass = "block px-3 py-3"

const menuItems = [
  {
    label: 'Home',
    link: '/'
  },
  {
    label: 'Read the Scripture',
    link: '/bible'
  },
  {
    label: 'Study Tools',
    children: [
      {
        label: 'Devotionals',
        link: '/devotionals'
      },
      {
        label: 'Truth Resources',
        link: "/truth-resources"
      }
    ]
  },
  {
    label: 'App Version History',
    link: '/versions'
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