<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
  <div>
    <header>
      <h2>{{ user.firstName }}</h2>
    </header>
    <section class="info">
      <section>
        <i class="flatText">
          Last Active: {{ user.lastActive }}
        </i>
        <p>Class of {{ user.graduationYear }}</p>
        <p><b>Industry: {{ user.industry !== undefined ? user.industry : "None" }}</b></p>
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
      user: {
        firstName: "",
        lastName: "",
        lastActive: "",
        gradYear: "",
        industry: ""
      },
      timeBlocks: [],
      calendarDays: []
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

</style>
