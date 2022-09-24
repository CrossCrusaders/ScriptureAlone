<template>
  <!-- Outer parent-->
  <div class="bg-gray-800 p-8 py-10 md:py-16">
    <!-- inner-content container parent-->
    <div class="flex flex-col md:flex-row gap-2 justify-between text-white">
      <div class="footerSection">
        <p class="font-bold text-3xl mb-2">Scripture Alone</p>
        <p class="mb-2"><a href="/index.html">Home</a> · <a href="/about.html">About</a> · <a href="#">Uptime Status</a>
          · <a href="/updates.html">Updates</a> · <a href="/contact.html">Contact</a></p>
        <p class="text-xs">Scripture Alone © 2022</p>
      </div>
      <div class="footerSection lg:pl-40">
        <p><i class="material-icons-outlined pr-1">mail</i>
          <a class="mb-2 absolute" href="mailto:support@crosscrusaders.com">support@crosscrusaders.com</a>
        </p>
      </div>
      <div class="footerSection md:pl-20">
        <div>
          <p class="font-bold mb-2">About Scripture Alone</p>
        </div>
        <div>
          <p>Scripture Alone is a Bible app created by <a class="link" href="https://crosscrusaders.com/">Cross
              Crusaders</a> in order to combat the toleration of the false teachers in other apps and to bring forward
            suppressed Bible preachers with doctrinally sound content for the current time we are living in.</p>
        </div>

        <br>

        <div>
          <a href="#"><span class="fa fa-facebook fa-xl pr-3" aria-hidden="true"></span></a>
          <a href="#"><span class="fa fa-twitter fa-xl pr-3" aria-hidden="true"></span></a>
          <a href="#"><span class="fa-brands fa-instagram fa-xl pr-3"></span></a>
          <a href="#"><span class="fa-brands fa-youtube fa-xl pr-3"></span></a>
          <a href="https://discord.gg/3YEd7KdJkz" target="blank"><span
              class="fa-brands fa-discord fa-xl pr-3"></span></a>
          <a href="https://github.com/ItsShawn/itsshawn.github.io/" target="blank"><span class="fa fa-github fa-xl pr-3"
              aria-hidden="true"></span></a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.footerSection {
  width: 33.35%;
  margin-right: 2em;
}

@media screen and (max-width: 900px) {
  .footerSection {
    width: 95%;
    margin-bottom: 2em;
    display: absolute;
  }
}
</style>