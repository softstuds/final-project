<!-- Default page -->

<template>
  <main>
    <section v-if="$store.state.user">
      <header>
        <h2>Search for Users</h2>
      </header>
      <SearchUsersForm 
          class="users-search-form"
          placeholder="🔍 Search for users"
          button="🔄 Search Users"
          @filterUsers="searchUsers">
      </SearchUsersForm >
      <button class="filter-button"
          v-if="!filtering"
          @click="changeFiltering">
          Show Filters
      </button>
      <section
        v-if="filtering"
        class="filter-section">
        <section 
          class="tags-filter">
          <h1>Filter by Willing To Tags...</h1>
          <TagsFilterButton
            @filterUsers="filterTags"
            @unfilterUsers="unfilterTags"
            :refreshCount="refreshCount"
            :initialValue="initialTags">
          </TagsFilterButton>
        </section>
        <section class="industry-filter">
          <h1>Filter by Industry...</h1>
          <IndustryFilter
            class="industry-filter-bar"
            @filterUsers="filterIndustry"
            @unfilterUsers="unfilterIndustry"
            :refreshCount="refreshCount"
            :initialValue="initialIndustry">
          </IndustryFilter>
        </section>
        <section class="grad-year-filter">
          <h1>Filter by Graduation Year...</h1>
          <FindUsersForm 
              placeholder="🔍 Filter by graduation year"
              button="🔄 Get Users"
              @filterUsers="filterGradYear"
              :refreshCount="refreshCount"
              :initialValue="initialGradYear">
          </FindUsersForm>
        </section>
        <section class="availability-filter">
          <h1>Filter by User Availability...</h1>
          <AvailabilityFilter
            @filterUsers="filterAvailable"
            @unfilterUsers="unfilterAvailable"
            :refreshCount="refreshCount"
            :initialValue="initialAvailable">
          </AvailabilityFilter>
        </section>
      </section>
      <button class="clear-filter-button"
          v-if="filtering"
          @click="clearFiltering">
          Clear all Filters
      </button>
      <button class="filter-button"
          v-if="filtering"
          @click="changeFiltering">
          Hide Filters
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
import SearchUsersForm from '@/components/Search/SearchUsersForm.vue';
import AvailabilityFilter from '@/components/Availability/AvailabilityFilter.vue';

export default {
  name: 'SearchPage',
  components: {UserCardComponent, TagsFilterButton, IndustryFilter, FindUsersForm, SearchUsersForm, AvailabilityFilter},
  data() {
    return {
      users: [],
      tagsFilteredUsers: new Set(),
      industryFilteredUsers: new Set(),
      gradYearFilteredUsers: new Set(),
      searchFilteredUsers: new Set(),
      availableFilteredUsers: new Set(),
      initialTags: '',
      initialIndustry: '',
      initialGradYear: '',
      initialAvailable: false,
      displayedUsers: [],
      filtering: false,
      refreshCount: 0
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
      this.searchFilteredUsers = this.getIds();
      this.availableFilteredUsers = this.getIds();
    },
    changeFiltering() {
      this.filtering = !this.filtering;
    },
    clearFiltering() {
      this.refreshCount += 1;
      this.clearInitials();
      this.tagsFilteredUsers = this.getIds();
      this.industryFilteredUsers = this.getIds();
      this.gradYearFilteredUsers = this.getIds();
      this.availableFilteredUsers = this.getIds();
      this.getDisplayedUsers();
    },
    filterTags(value, tagsSelected) {
      this.initialTags = tagsSelected;
      this.tagsFilteredUsers = new Set(value);
      this.getDisplayedUsers();
    },
    searchUsers(value) {
      this.searchFilteredUsers = new Set(value);
      this.getDisplayedUsers();
    },
    filterIndustry(value, industrySelected) {
      this.initialIndustry = industrySelected;
      this.industryFilteredUsers = new Set(value);
      this.getDisplayedUsers();
    },
    filterGradYear(value, gradYearSelected) {
      this.gradYearFilteredUsers = new Set(value);
      this.initialGradYear = gradYearSelected;
      this.getDisplayedUsers();
    },
    filterAvailable(value) {
      this.availableFilteredUsers = new Set(value);
      this.initialAvailable = true;
      this.getDisplayedUsers();
    },
    unfilterAvailable() {
      this.availableFilteredUsers = this.getIds();
      this.initialAvailable = false;
      this.getDisplayedUsers();
    },
    unfilterTags() {
      this.tagsFilteredUsers = this.getIds();
      this.initialTags = '';
      this.getDisplayedUsers();
    },
    unfilterIndustry() {
      this.industryFilteredUsers = this.getIds();
      this.initialIndustry = '';
      this.getDisplayedUsers();
    },
    getIds() {
      return new Set(this.users.map(user => user.id));
    },
    getDisplayedUsers() {
      const allFilters = [this.tagsFilteredUsers, 
                          this.industryFilteredUsers, 
                          this.gradYearFilteredUsers, 
                          this.searchFilteredUsers,
                          this.availableFilteredUsers];
      const filterIntersection = allFilters.reduce((a, b) => new Set([...a].filter(x => b.has(x))));
      this.displayedUsers = this.users;
      this.displayedUsers = this.displayedUsers.filter(user => filterIntersection.has(user.id));
    },
    clearInitials() {
      this.initialIndustry = '';
      this.initialTags = '';
      this.initialGradYear = '';
      this.initialAvailable = false;
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
    margin-left: 10px;
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
  font-weight: 300;
  font-size: 48px;
}

.industry-filter-bar {
  width: 300px;
  margin: 20px 0px;
}

.filter-button {
  width: 15em;
  padding: 0px;
  margin: 12px 24px 12px 12px;
  height: 28px;
  border: 0.5px solid black;
  background-color: white;
  border-radius: 4px;
  color: black;
  cursor: pointer;
}

.clear-filter-button {
  width: 15em;
  padding: 0px;
  margin: 12px 24px 12px 12px;
  height: 28px;
  border: 0.5px solid black;
  background-color: #c46345;
  border-radius: 4px;
  color: black;
  cursor: pointer;
}

.filter-section {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 12px 24px 12px 12px;
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

.users-search-form {
  margin: 12px 24px 12px 12px;
}

.availability-filter {
  margin-left: 3em;
}
</style>
