<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
  <div
    v-if="user !== null"
  >
    <header>
      <h2>{{ user.firstName }}</h2>
    </header>
    <section class="info">
      <section>
        <i class="flatText">
          Last Active: {{ user.lastActive }}
        </i>
        <section class="editInfo">
          <button v-if="editingInfo" @click="(editingInfo=false)">Stop Editing</button>
          <button v-else @click="(editingInfo=true)">Edit Info</button>
        </section>
        <section class="fieldInput">
          <b class="field">Class of</b>
          <textarea v-if="editingInfo">{{ user.graduationYear }}</textarea>
          <b v-else>{{ user.graduationYear }}</b>
        </section>
        <section class="fieldInput">
          <b class="field">Industry:</b>
          <textarea v-if="editingInfo">{{ user.industry }}</textarea>
          <b v-else>{{ user.industry }}</b>
        </section>
        <section class="fieldInput">
          <b class="field">Bio:</b>
          <textarea v-if="editingInfo">{{ user.bio }}</textarea>
          <b v-else>{{ user.bio }}</b>
        </section>
        <WillingTosSelect v-if="user._id === $store.state.userId"
          :userId="userId"
        />
      </section>
    </section>
    <CalendarComponent 
      :userId="userId"
    />
  </div>
</template>

<script>
import CalendarComponent from '@/components/Profile/CalendarComponent.vue';

export default {
  name: 'PersonalInfoComponent',
  components: {CalendarComponent},
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: null,
      statistics: {},
      availabilities: [],
      editingInfo: false
    }
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const r = await fetch("api/users/" + this.userId);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.user = res.user;
    },
  }
};
</script>

<style scoped>
.flatText {
    color: gray
}

.segmentHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.editButton {
  height: 25px
}
.calendar {
    display: flex;
}

.day {
    width: 100%;
    border: 1px solid black;
    padding: 1%
}

.timeBlock {
    border: 1px solid black;
    padding: 10%
}

.fieldInput {
  display: flex;
  justify-content: start;
  max-width: 750px;
  align-items: center;
  margin: 10px;
}

.field {
  width: 15%
}

.editInfo {
  display: flex;
  justify-content: flex-end;
}
</style>
