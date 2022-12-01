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
    <section class="segment">
      <section class="segmentHeader">
        <h3><b>{{ user.firstName }}'s Statistics</b></h3>
      </section>
      <p><b>Hours accepted: </b>{{statistics.totalHoursAccepted}}</p>
      <p><b>Meeting success rate: </b>{{statistics.meetingSuccessRate}}</p>
    </section>
    <section class="segment">
      <section class="segmentHeader">
        <h3><b>Availability</b></h3>
        <button 
          v-if="user._id === $store.state.userId"
          class="editButton"
        >
          Edit My Availabilities
        </button>
      </section>
      <section class="calendar">
        <section
          v-for="(date, index) in availabilities"
          :key="index"
          class="day"
        >
          <section 
            v-for="block in date"
            :key="block.getHours()"
            class="timeBlock"
          >
            {{ block.getHours() == 12 ?
              12 + "pm" :
              block.getHours() == 0 ?
                12 + "am" :
                block.getHours() > 12 ?
                  block.getHours() - 12 + "pm" : 
                  block.getHours() + "am"
            }}
            <div>
              <button v-if="user._id !== $store.state.userId">
                Claim
              </button>
            </div>
          </section>    
        </section>
      </section>        
    </section>
    <CalendarComponent 
      :userId="userId"
    />
  </div>
</template>

<script>
import CalendarComponent from '@/components/Profile/CalendarComponent.vue';
import WillingTosSelect from '@/components/Tags/WillingTosSelect.vue';

export default {
  components: {CalendarComponent, WillingTosSelect},
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
    this.getStats();
    this.getAvailibilities();
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
    async getStats() {
      const r = await fetch(`api/timeblock/stats/${this.userId}`);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.statistics = res.statistics;
    },
    getAvailibilities() {
        const availabilities = [
            [new Date('24 Nov 2022 13:00')],
            [new Date('25 Nov 2022 15:00')],
            [new Date('26 Nov 2022 11:00'), new Date('26 Nov 2022 13:00')],
            [],
            [new Date('28 Nov 2022 9:00')],
            [new Date('29 Nov 2022 10:00')],
            [new Date('30 Nov 2022 14:00')]
        ];
        this.availabilities = availabilities;
    }
  }
};
</script>

<style scoped>
.flatText {
    color: gray
}
.segment {
    border-top: 1px solid black;
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
