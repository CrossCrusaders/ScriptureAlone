<template>
  <RouterLink :to="props.to" v-bind="$attrs"
    class="hover:underline rounded-full bg-slate-800 text-white pl-2 pr-4 py-2 flex flex-row gap-2 items-center">
    <div class="rounded-full w-8 h-8 min-w-8 min-h-8 overflow-hidden">
      <img class="object-cover w-full h-full" :src="profileImage" />
    </div>
    <span>{{ user?.profile.name }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '../../auth/services/AuthService';

const { user } = useAuth()

const profileImage = computed(() => "https://loremflickr.com/320/240?lock=1")

const props = defineProps(['to'])

</script>