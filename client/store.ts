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
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    gradYear: null, // Graduation year of the logged in user
    name: null, // Name of the logged in user
    lastActive: null, // Last active time of logged in user
    industry: null, // Industry of the logged in user
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
    setName(state, name) {
      /**
       * Update the stored name to the specified one.
       * @param name - new name to set
       */
      state.name = name;
    },
    setGradYear(state, gradYear) {
      /**
       * Update the stored graduation year to the specified one.
       * @param gradYear - new grad year to set
       */
      state.gradYear = gradYear;
    },
    setLastActive(state, lastActive) {
      /**
       * Update the stored last active time to the specified one.
       * @param lastActive - new last active time to set
       */
      state.lastActive = lastActive;
    },
    setIndustry(state, industry) {
      /**
       * Update the stored industry to the specified one.
       * @param industry - new industry to set
       */
      state.industry = industry;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
