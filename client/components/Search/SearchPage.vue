<!-- Default page -->

<template>
  <main>
    <section v-if="$store.state.user">
      <header>
        <h2>Viewing Users</h2>
      </header>
      <section
        class="filterBar">
        <section>
          <h1>Filter by Willing To Tags...</h1>
          <TagsFilterButton
            @filterUsers="filterTags"
            @unfilterUsers="unfilterTags">
          </TagsFilterButton>
        </section>
        <section class="industry-filter">
          <h1>Filter by Industry...</h1>
          <IndustryFilter
            @filterUsers="filterIndustry"
            @unfilterUsers="unfilterIndustry">
          </IndustryFilter>
        </section>
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
import IndustryFilter from '@/components/Industry/IndustryFilter.vue';

export default {
  name: 'SearchPage',
  components: {UserCardComponent, TagsFilterButton, IndustryFilter},
  data() {
    return {
      users: [],
      tagsFilteredUsers: new Set(),
      industryFilteredUsers: new Set(),
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
      this.tagsFilteredUsers = this.getIds();
      this.industryFilteredUsers = this.getIds();
    },
    filterTags(value) {
      this.tagsFilteredUsers = new Set(value);
      const filterIntersection = this.getIntersection(this.tagsFilteredUsers, this.industryFilteredUsers)
      this.displayedUsers = this.displayedUsers.filter(user => filterIntersection.has(user.id));
    },
    filterIndustry(value) {
      this.industryFilteredUsers = new Set(value);
      const filterIntersection = this.getIntersection(this.tagsFilteredUsers, this.industryFilteredUsers)
      this.displayedUsers = this.displayedUsers.filter(user => filterIntersection.has(user.id));
    },
    unfilterTags() {
      this.tagsFilteredUsers = this.getIds();
      this.displayedUsers = this.users;
      this.displayedUsers = this.displayedUsers.filter(user => this.industryFilteredUsers.has(user.id));
    },
    unfilterIndustry() {
      this.industryFilteredUsers = this.getIds();
      this.displayedUsers = this.users;
      this.displayedUsers = this.displayedUsers.filter(user => this.tagsFilteredUsers.has(user.id));
    },
    getIds() {
      return new Set(this.users.map(user => user.id));
    },
    getIntersection(setA, setB) {
      const intersection = new Set([...setA].filter(element => setB.has(element)));
      return intersection;
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

.industry-filter {
  margin-left: 40px;
}
</style>
