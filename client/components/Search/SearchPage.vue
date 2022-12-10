<!-- Default page -->

<template>
  <main>
    <section v-if="$store.state.user">
      <header>
        <h2>Welcome to Alumni Connector!</h2>
      </header>
      <section>
        <button class="filter-button"
          v-if="!filtering"
          @click="changeFiltering">
          Access Filters
        </button>
        <section 
          v-if="filtering"
          class="tags-filter">
          <h1>Filter by Willing To Tags...</h1>
          <TagsFilterButton
            @filterUsers="filterTags"
            @unfilterUsers="unfilterTags">
          </TagsFilterButton>
        <section
          v-if="filtering">
          <h1>Filter by Industry...</h1>
          <IndustryFilter
            class="industry-filter-bar"
            @filterUsers="filterIndustry"
            @unfilterUsers="unfilterIndustry">
          </IndustryFilter>
        </section>
        <button class="filter-button"
          v-if="filtering"
          @click="changeFiltering">
          Done Filtering
        </button>
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
      displayedUsers: [],
      filtering: false
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
    changeFiltering() {
      this.filtering = !this.filtering;

      if (!this.filtering) {
        this.unfilterTags();
        this.unfilterIndustry();
      }
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

h1 {
  font-size: larger;
  font-weight: 400;
  text-decoration: none;
  color: #212529;
  margin: 8 0px;
}


h3 {
  margin: 4px 0px;
  font-size: 36px;
  font-weight: 180;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

h2 {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #729e85;
  font-size: 48px;
}

.filterBar {
  display: flex;
  flex-direction: column;
  margin: 20px 0px;
}

.industry-filter-bar {
  width: 300px;
  margin: 20px 0px;
}

.filter-button {
  width: 15em;
  margin-left: 10px;
}
</style>
