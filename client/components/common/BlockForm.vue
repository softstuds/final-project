<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <div class="row">
      <div class="column">
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <label :for="field.id">{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-if="field.id === 'graduationYear'"
          :name="field.id"
          :value="field.value"
          type="number"
          :min="1920"
          :step="1"
          @input="field.value = $event.target.value"
        />
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
  </div>
    <button class="columnform"
      type="submit"
    >
      {{ title }}
    </button>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUser: false, // Whether or not stored username should be updated after form submission
      newUser: false, // if a new user is being created
      refreshUser: false, // Whether or not to refresh user info
      deleteUser: false, // If the user info has been deleted
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            if (field == 'graduationYear') {
              const {id, value} = field;
              return [id, parseInt(value, 10)];
            } else {
              const {id, value} = field;
              return [id, value];
            }
            field.value = '';
            
          })
        ));
      }

      try {
        if (this.deleteUser) {
          // delete tags when a user is deleted
          const options = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin' // Sends express-session credentials with request
          };
          const tags = await fetch('/api/tags', options);
          const tagsRes = await tags.json();

          // delete industry when a user is deleted
          const industryOptions = {
              method: 'DELETE',
              headers: {'Content-Type': 'application/json'},
              credentials: 'same-origin' // Sends express-session credentials with request
          };
          const industry = await fetch('/api/industry', options);
          const industryRes = await industry.json();
        }

        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUser) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUser', res.user ? res.user : null);
          this.$store.commit('setUserId', res.user ? res.user._id.toString() : null);
          this.$store.commit('updateAccess');
          this.$store.commit('getUsers');

          if (this.newUser && res.user) {
            // create tags when a new user is created
              const options = {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'same-origin' // Sends express-session credentials with request
              };
              const tags = await fetch('/api/tags', options);
              const tagsRes = await tags.json();

              // create an industry object when a new user is created
              const industryOptions = {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'same-origin' // Sends express-session credentials with request
              };
              const industry = await fetch('/api/industry', options);
              const industryRes = await industry.json();
          }
        }


        if (this.refreshUser) {
          this.$store.commit('refreshUser');
          this.$store.commit('updateAccess');
          this.$store.commit('getUsers');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.$store.commit('updateLastActive');
    }
  }
};
</script>

<style scoped>
form {
  border: 0px solid #111;
  padding: 0.5rem;
  display: flex;
  width: 840px;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 4px;
}

textarea {
   font-family: inherit;
   font-size: inherit;
   padding: 10px 0px;
}

input {
  padding: 10px 8px;
  font-size: 16px;
  margin: 4px 12px 0px 0px;
}

.columnform {
  width: 20%;
  position: relative;
  top: 26px;
  margin: 4px 12px;
  height: 36px;
}

.columnform:hover {
  box-shadow: rgba(0, 0, 0, 0.2) 0 4px 12px;
  cursor: pointer;
}

.row {
  display: flex;
}

.column {
  flex: 2;
}

.columnform {
  flex: 0.4;
}
</style>
