<template >
  <div id="app">
    <header>
      <NavBar class="nav" />
    </header>
    <router-view class="body2" />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';

export default {
  name: 'App',
  components: {NavBar},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUser', user ? user : null);
      this.$store.commit('setUserId', user ? user._id : null);
      this.$store.commit('getUsers');
      if (user) {
        this.$store.commit('updateAccess');
        this.$store.commit('updateLastActive');
      }
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  align-content: center;
  display: flex;
  padding: 0 20;
  font-size: 1.2em;
  font-family: "Segoe UI", "Helvetica Neue", "Arial";
}

main {
  padding: 40px;
  padding-top: 20px;
}

.nav {
  margin: 0px !important;
  width: 100% !important;
  margin: auto;
  box-sizing: border-box;
  position: absolute; 
}

.body2 {
  margin: auto !important;
  width: 1280px;
}

.alerts {
    position: absolute;
    z-index: 99;
    bottom: 0;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 10%);
    width: 100%;
    text-align: center;
}

.alerts article {
    border-radius: 5px;
    padding: 10px 20px;
    color: #fff;
}

.alerts p {
    margin: 0;
}

.alerts .error {
    background-color: rgb(166, 23, 33);
}

.alerts .success {
    background-color: rgb(45, 135, 87);
}

/* montserrat-regular - latin */
@font-face {
  font-family: 'Montserrat';
  src: url('/public/montserrat-v25-latin-regular.woff'); /* IE9 Compat Modes */
}
</style>
