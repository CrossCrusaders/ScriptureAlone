<template>
    <AppLayout>
        <div class="flex flex-col items-center mt-4">
            <img class="transition-all hover:rotate-12 hover:scale-105 object-contain max-h-40 md:max-h-32 block mb-4"
                src="/logo-bible.png" />
            <div class="flex flex-col items-center">
                <h1 class="font-bold font-title text-3xl md:text-5xl lg:text-6xl mb-2 bg-gradient-to-r from-[#1e293b]
        to-[#57687f] text-transparent bg-clip-text">
                    Scripture Alone
                </h1>
            </div>
            <div class="mt-4" style="text-align:center;">
                <p class="text-5xl font-bold">404</p>
                <p>I guess that page doesn't exist? Try going <RouterLink to="/home" class="text-blue-500">here
                    </RouterLink> instead.</p>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
</script>