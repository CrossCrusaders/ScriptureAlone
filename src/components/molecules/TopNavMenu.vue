<template>
  <nav v-if="breakpoint === 'sm'">
    <span class="material-icons-outlined" @click="mobileMenuOpen = !mobileMenuOpen">menu</span>
    <div class="absolute bg-gray-800 text-white left-0 right-0" v-if="showMobileMenuOpen">
      Mobile Menu
    </div>
  </nav>
  <nav v-else>
    <ul class="flex flex-row gap-4 items-center">
      <li v-for="item in menuItems" :key="item.label" class="top-nav-menu-item">
        <a class="font-bold text-gray-700  p-2 flex flex-row gap-4 items-center" :href="item.link || '#'">
          <span class="underline">{{ item.label }}</span>
          <span v-if="item.children && item.children.length" class="material-icons-outlined">expand_more</span>
        </a>
        <ul class="top-nav-submenu p-4 bg-gray-800 text-white min-w-fit  shadow-lg rounded" v-if="item.children && item.children.length">
          <li v-for="child in item.children" :key="child.label">
            <a class="font-bold underline whitespace-nowrap text-center w-full" :href="child.link || '#'">{{ child.label }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>

</template>

<script setup lang="ts">

import { computed, reactive, ref, watch } from 'vue';
import { useBreakpoint } from '../../services/ViewportService'

const { breakpoint } = useBreakpoint()

const menuItems = [
  {
    label: 'Read the Scripture',
    link: '/bible/bible-search'
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
    label: 'Account',
    children: [
      {
        label: 'Log In',
        link: '/auth/log-in'
      }
    ]
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
  .top-nav-menu-item > ul {
    display: none;
    position: absolute;

  }
  .top-nav-menu-item:hover > ul{
    display: block;

  }
</style>