<template>
  <!-- Outer parent-->
  <div class="bg-gray-800 p-8 py-10 md:py-16">
    <!-- inner-content container parent-->
    <div class="flex flex-col md:flex-row gap-2 justify-between text-white">
      <div class="mb-8 md:w-4/12">
        <p class="font-bold text-3xl mb-2">Scripture Alone</p>
        <p class="mb-2"><a href="/">Home</a> · <a href="#">Uptime Status</a>
          · <a href="#">Updates</a></p>
        <p class="text-xs">Scripture Alone © {{ (new Date).getFullYear() }}</p>
      </div>
      <div class="mb-8 md:w-4/12 flex flex-col items-center">
        <p class="flex flex-row w-full md:justify-center">
          <Icon icon-name="email" class="mr-2" color="white"></Icon>
          <a class="mt-1 mb-1" href="mailto:scripturealone@crosscrusaders.com">scripturealone@crosscrusaders.com</a>
        </p>
      </div>
      <div class="mb-8 md:w-4/12 md:pl-20 sm:pl-0">
        <div>
          <p class="font-bold mb-2">About Scripture Alone</p>
        </div>
        <div>
          <p>Scripture Alone is a Bible app created by <a class="link underline text-red-200"
              href="https://crosscrusaders.com/">Cross
              Crusaders</a> in order to combat the toleration of the false teachers in other apps and to bring forward
            suppressed Bible preachers with doctrinally sound content for the current time we are living in.</p>
        </div>

        <br>

        <div>
          <a to="https://facebook.com/shawn.henly707"><span 
            class="fa fa-facebook fa-xl pr-3 transition duration-150 ease-in-out hover:text-gray-400"
            aria-hidden="true"></span></a>
          <a href="https://twitter.com/ItsShawnH"><span
            class="fa fa-twitter fa-xl pr-3 transition duration-150 ease-in-out hover:text-gray-400"
            aria-hidden="true"></span></a>
          <a href="https://www.instagram.com/realcrosscrusaders"><span
            class="fa-brands fa-instagram fa-xl pr-3 transition duration-150 ease-in-out hover:text-gray-400"></span></a>
          <a href="https://www.youtube.com/crosscrusaders"><span
            class="fa-brands fa-youtube fa-xl pr-3 transition duration-150 ease-in-out hover:text-gray-400"></span></a>
          <a href="https://discord.gg/3BdrYPtE38" target="blank"><span
            class="fa-brands fa-discord fa-xl pr-3 transition duration-150 ease-in-out hover:text-gray-400"></span></a>
          <a href="https://github.com/ItsShawn/itsshawn.github.io/" target="blank"><span
            class="fa fa-github fa-xl pr-3 transition duration-150 ease-in-out hover:text-gray-400"
            aria-hidden="true"></span></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '../atoms/Icon.vue'
</script>

<style lang="css" scoped>

</style>