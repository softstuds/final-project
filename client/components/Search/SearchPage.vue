<!-- Default page -->

<template>
  <main>
    <section v-if="$store.state.user">
      <header>
        <h2>Viewing Users</h2>
      </header>
      <button class="filter-button"
          v-if="!filtering"
          @click="changeFiltering">
          Access Filters
      </button>
      <section
        v-if="filtering"
        class="filter-section">
        <section 
          class="tags-filter">
          <h1>Filter by Willing To Tags...</h1>
          <TagsFilterButton
            @filterUsers="filterTags"
            @unfilterUsers="unfilterTags">
          </TagsFilterButton>
        </section>
        <section class="industry-filter">
          <h1>Filter by Industry...</h1>
          <IndustryFilter
            class="industry-filter-bar"
            @filterUsers="filterIndustry"
            @unfilterUsers="unfilterIndustry">
          </IndustryFilter>
        </section>
        <section class="grad-year-filter">
          <h1>Filter by Graduation Year...</h1>
          <FindUsersForm 
              placeholder="🔍 Filter by graduation year"
              button="🔄 Get Users"
              @filterUsers="filterGradYear">
          </FindUsersForm>
        </section>
      </section>
      <button class="filter-button"
          v-if="filtering"
          @click="changeFiltering">
          Done Filtering
      </button>
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
import FindUsersForm from '@/components/Search/FindUsersForm.vue';

export default {
  name: 'SearchPage',
  components: {UserCardComponent, TagsFilterButton, IndustryFilter, FindUsersForm},
  data() {
    return {
      users: [],
      tagsFilteredUsers: new Set(),
      industryFilteredUsers: new Set(),
      gradYearFilteredUsers: new Set(),
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
      this.gradYearFilteredUsers = this.getIds();
    },
    changeFiltering() {
      this.filtering = !this.filtering;

      if (!this.filtering) {
        this.displayedUsers = this.users;
      }
    },
    filterTags(value) {
      this.tagsFilteredUsers = new Set(value);
      this.getDisplayedUsers();
    },
    filterIndustry(value) {
      this.industryFilteredUsers = new Set(value);
      this.getDisplayedUsers();
    },
    filterGradYear(value) {
      this.gradYearFilteredUsers = new Set(value);
      this.getDisplayedUsers();
    },
    unfilterTags() {
      this.tagsFilteredUsers = this.getIds();
      this.getDisplayedUsers();
    },
    unfilterIndustry() {
      this.industryFilteredUsers = this.getIds();
      this.getDisplayedUsers();
    },
    getIds() {
      return new Set(this.users.map(user => user.id));
    },
    getDisplayedUsers() {
      const allFilters = [this.tagsFilteredUsers, this.industryFilteredUsers, this.gradYearFilteredUsers];
      const filterIntersection = allFilters.reduce((a, b) => new Set([...a].filter(x => b.has(x))));
      this.displayedUsers = this.users;
      this.displayedUsers = this.displayedUsers.filter(user => filterIntersection.has(user.id));
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
  flex-direction: column;
}

.industry-filter-bar {
  width: 300px;
  margin-bottom: 20px;
}

.filter-button {
  width: 15em;
  margin-left: 10px;
}

.filter-section {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.grad-year-filter {
  width:fit-content;
  height:fit-content;
  margin-left: 3em;
}

.industry-filter {
  width:fit-content;
  height:fit-content;
}
</style>
