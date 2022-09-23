<template>
  <!-- Outer parent-->
  <div class="bg-gray-800 p-8">
    <!-- inner-content container parent-->
    <div class="flex flex-col md:flex-row gap-2 justify-between text-white">
      <div class="footerSection">
        <p class="font-bold text-4xl">Scripture Alone</p>
		<p><a href="/index.html">Home</a> · <a href="/about.html">About</a> · <a href="#">Uptime Status</a> · <a href="/updates.html">Updates</a> · <a href="/contact.html">Contact</a></p>
		<p class="text-xs">Scripture Alone © 2022</p>
      </div>
      <div class="footerSection">
	    <p><i class="material-icons-outlined pr-1" @click="mobileMenuOpen = true">mail</i>
        <a class="mb-2 absolute" href="mailto:support@crosscrusaders.com">support@crosscrusaders.com</a></p>
	  </div>
      <div class="footerSection">
	    <div>
          <p class="font-bold">About Scripture Alone</p>
		</div>
		<div>
          <p>Scripture Alone is a Bible app created by <a class="link" href="https://crosscrusaders.com/">Cross Crusaders</a> in order to combat the toleration of the false teachers in other apps and to bring forward suppressed Bible preachers with doctrinally sound content for the current time we are living in.</p>
        </div>
		
        <!--<div class="footer-icons">
        
          <a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a>
          <a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a>
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
          <a href="#"><i class="fa-brands fa-youtube"></i></a>
          <a href="https://discord.gg/3YEd7KdJkz" target="blank"><i class="fa-brands fa-discord"></i></a>
          <a href="https://github.com/ItsShawn/itsshawn.github.io/" target="blank"><i class="fa fa-github" aria-hidden="true"></i></a>
        </div>-->
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .footerSection{
    width: 33.35%;
	margin: 2em;
  }
  @media screen and (max-width: 900px) {
    .footerSection{
	  width: 200%;
	  margin-bottom: 2em;
	  display: absolute;
	}
  }
</style>