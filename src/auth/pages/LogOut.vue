<template>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logOut } from '../services/AuthService'

const router = useRouter()
onMounted(async () => {
  await logOut()
  router.replace('/')
})
</script>