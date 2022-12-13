<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/favicon.png">
      <h1 class="title">
        AC
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link
        v-if="$store.state.userId"
        to="/search"
      >
        Search
      </router-link>
      <router-link
        v-if="$store.state.userId"
        to="/meeting"
      >
        Meetings
      </router-link>
      <router-link
        v-if="$store.state.userId"
        :to="('/profile/' + $store.state.userId)"
      >
        My Profile
      </router-link>
      <router-link
        v-if="$store.state.userId"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 24px 42px 0px 24px;
    margin: 24px 0px;
    background-color: white;
    gap: 70px;
    align-items: left;
    width: 120%;
    text-decoration: none;
    font-weight:300;
    color: black !important;
    list-style-type: none;
    height: 100%; /* Full height */
}

a:hover { text-decoration: none; color:#729e85; }
a:visited { text-decoration: underline; color:black; }
a:focus { 
  text-decoration: underline;
  color:#729e85;
  font-weight: 500;
}
a:active { text-decoration: underline; color:#729e85; }

.title {
    font-size: 32px;
    margin: 0 5px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
  margin-bottom: 24px;
}

.right {
    font-size: 20px;
    /* display: grid; */
    display: flex;
    margin-top: 50px;
    flex-direction: column;
    gap: 40px;
    align-items: left;
}

.right a {
    margin-left: 5px;
    text-decoration: none;
}

.alerts {
    width: 25%;
}
</style>
