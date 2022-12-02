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
        <section class="editInfo"
          v-if="user._id === $store.state.userId">
          <button v-if="editingInfo" @click="updateInfo">Save Changes</button>
          <button v-else @click="(editingInfo=true)">Edit Info</button>
        </section>
        <section 
          v-for="field in fields"
          class="fieldInput" 
          :key="field.name">
          <b class="field">{{ field.display }}</b>
          <section v-if="editingInfo">
            <input
              v-if="field.name === 'graduationYear'"
              :value="(user.graduationYear ?? (new Date()).getFullYear())"
              type="number"
              min="1920"
              step="1"
              @input="user.graduationYear = $event.target.value"
            />
            <textarea 
              v-else
              @input="user[field.name] = $event.target.value"
            >{{ user[field.name] }}</textarea>
          </section>
          
          <section v-else>{{ user[field.name] }}</section>
        </section>
        <section class="fieldInput">
          <b class="field">Willing To:</b>
          <WillingTosSelect 
            v-if="user._id === $store.state.userId"
            :userId="userId"
          />
        </section>
      </section>
    </section>
    <section class="segment">
      <section class="segmentHeader">
        <h3><b>{{ user.firstName }}'s Statistics</b></h3>
      </section>
      <p><b>Hours accepted: </b>{{statistics.totalHoursAccepted}}</p>
      <p><b>Meeting success rate: </b>{{statistics.meetingSuccessRate}}</p>
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
      editingInfo: false,
      fields: [
        {'name': 'graduationYear', 'display': 'Class of: '}, 
        {'name': 'industry', 'display':  'Industry: '},
        {'name': 'bio', 'display':  'Bio: '},
      ],
    }
  },
  watch: {
    userId: function() {
      this.getUser();
      this.getStats();
    }
  },
  mounted() {
    this.getUser();
    this.getStats();
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
    async updateInfo() {
      this.editingInfo = false;
      const {graduationYear, industry, bio} = this.user;

      const options = {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin',
          body: JSON.stringify({graduationYear: parseInt(graduationYear, 10), industry, bio})
      };
      
      const r = await fetch("api/users/info", options);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.user = res.user;
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
