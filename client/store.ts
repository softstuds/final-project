import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null,
    timeblocks: [], // All freets created in the app
    user: null, // logged in user
    userId: null, // User ID of logged in user
    users: [], // All users
    hasAccess: null,
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
    updateTimeblocks(state, timeblocks) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.timeblocks = timeblocks;
    },
    async refreshTimeblocks(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter=='Past Meetings' ? `/api/timeblock/met/check` : '/api/timeblock';
      const res = await fetch(url).then(async r => r.json());
      state.timeblocks = res;
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
    },
    async updateAccess(state) {
      const r = await fetch("api/timeblock/access/");
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      state.hasAccess = res.hasAccess;
    },
    async getUsers(state) {
      const r = await fetch("api/users");
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      state.users = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
