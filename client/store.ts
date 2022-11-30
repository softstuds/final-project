import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    timeblocks: [], // All freets created in the app
    username: null, // Username of the logged in user
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
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUserId(state, userId) {
      /**
       * Update the stored userId to the specified one.
       * @param userId - new userId to set
       */
      state.userId = userId;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
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
      const url = state.filter=='Past Meetings' ? `/api/timeblock/checkoccurred` : '/api/timeblock';
      const res = await fetch(url).then(async r => r.json());
      state.timeblocks = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
