<template>
  <section class="card">
    <router-link 
      :to="'/profile/'+ user._id"
    >
      <b class="name">{{ user.firstName }} {{ user.lastName }}</b>
    </router-link>
    <div class="otherInfo">
      <i>Class of {{ user.graduationYear }}</i>
      <p><b>Industry: {{ user.industry !== undefined ? user.industry : "None" }}</b></p>
      <section class="box">
        <h3>Statistics</h3>
        <p><b>Hours accepted: </b>{{statistics.totalHoursAccepted}}</p>
        <p><b>Meeting success rate: </b>{{statistics.meetingSuccessRate}}</p>
      </section>
    </div>
  </section>
</template>

<script>
export default {
    name: "UserCardComponent",
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
      return {
        statistics: {},
      }
    },
    mounted() {
      console.log(this.user);
      this.getStats();
    },
    methods: {
      async getStats() {
        const r = await fetch(`api/timeblock/stats/${this.user._id}`);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.statistics = res.statistics;
      }
    }
}
</script>
<style scoped>
.card {
    border-top: 1px solid black;
    padding: 10px;
    padding-top: 20px;
    margin: 5px;
}

.box {
  border: 1px solid gray;
  padding: 2%;
}

.name {
    font-size: larger
}

.otherInfo {
    font-size: medium;
    margin-top: 10px;
}
</style>