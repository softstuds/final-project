<!-- Default page -->

<template>
  <main>
    <section v-if="$store.state.user">
      <header>
        <h2>Viewing Users</h2>
      </header>
      <section
        class="filterBar">
        <TagsFilterButton
          @filterUsers="filterUsers"
          @unfilterUsers="unfilterUsers">
        </TagsFilterButton>
      </section>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Alumni Connector!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to access Alumni Connector.
        </h3>
      </article>
    </section>
    <section v-if="$store.state.user">
      <section
        v-if="(displayedUsers.length > 0)"
      >
        <UserCardComponent
          v-if="(displayedUsers.length > 0)"
          v-for="user in displayedUsers"
          :key="user.id"
          :user="user"
        />
      </section>
      <article
        v-else
      >
        <h3>No users found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import UserCardComponent from '@/components/Search/UserCardComponent.vue';
import TagsFilterButton from '@/components/Tags/TagsFilterButton.vue';

export default {
  name: 'SearchPage',
  components: {UserCardComponent, TagsFilterButton},
  data() {
    return {
      users: [],
      displayedUsers: []
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const r = await fetch("api/users");
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.users = res;
      this.displayedUsers = res;
    },
    filterUsers(value) {
      this.displayedUsers = this.displayedUsers.filter(user => value.includes(user.id));
    },
    unfilterUsers() {
      this.displayedUsers = this.users;
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.filterBar {
  display: flex;
  flex-direction: row;
}
</style>
