import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    user: null, // logged in user
    userId: null, // User ID of logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUserId(state, userId) {
      /**
       * Update the stored userId to the specified one.
       * @param userId - new userId to set
       */
      state.userId = userId;
    },
    setUser(state, user) {
      /**
       * Update the stored userId to the specified one.
       * @param userId - new userId to set
       */
      state.user = user;
    },
    async refreshUser(state) {
      const r = await fetch("api/users/" + state.userId);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      state.user = res.user;
    },
    async updateLastActive(state) {
      const r = await fetch("api/users/lastActive", {method: "PATCH"});
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      state.user = res.user;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
