<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
  <div class="main"
    v-if="user !== null"
  >
    <section>
      <p class="name">{{ user.firstName }} {{ user.lastName }}</p>
    </section>
    <i class="flatText">
      <h2>Last Active: {{ user.lastActive }}</h2>
    </i>
    <section v-if="(user._id === $store.state.userId)" class="accessStatus">
      You 
      <b v-if="($store.state.hasAccess === true)" class="greenText">can</b> 
      <b v-else class="redText">cannot</b> 
      request meetings with others
    </section>
    <section class="info">
      <section class="infoBox bioInfo">
        <section class="infoHeader">
          <h3>General Information</h3>
          <section
            v-if="user._id === $store.state.userId">
            <button v-if="editingInfo" class="padding" @click="updateInfo">Save Changes</button>
            <button v-else class="padding" @click="(editingInfo=true)">Edit Info</button>
          </section>
        </section>
        <section>
          <section 
            v-for="field in fields"
            class="row" 
            :key="field.name">
            <b class="label">{{ field.display }}</b>
            <section v-if="editingInfo" class="wideBox">
              <input
                v-if="field.name === 'graduationYear'"
                :value="(user.graduationYear ?? (new Date()).getFullYear())"
                type="number"
                min="1920"
                step="1"
                @input="user.graduationYear = $event.target.value"
              />
              <section v-else class="wideBox">
                <textarea
                  @input="user[field.name] = $event.target.value"
                >{{ user[field.name] }}</textarea>
              </section>
            </section>
            <section v-else>{{ user[field.name] }}</section>
          </section>
          <section class="row">
            <b class="label">Industry:</b>
            <IndustryButton v-if="editingInfo"></IndustryButton>
            <section v-else>{{ user.industry ? user.industry.industryType : 'Unspecified' }}</section>
          </section>
          <section class="row">
            <b class="label">Willing To:</b>
            <WillingTosSelect 
              v-if="editingInfo"
              :userId="userId"
            />
            <section v-else>{{ this.tags.length > 0 ? tags.map(tag => frontEndTags[tag]).join(', ') : 'None Selected'}}</section>
          </section>
        </section>
      </section>
      <section class="infoBox statistics">
        <section class="infoHeader"><h3>Statistics</h3></section>
        <section>
          <section 
            v-for="stat in statistics"
            class="row statRow"
          >
            <b class="field">{{ stat.label }}: </b>
            <section class="value">{{ stat.value }}</section>
          </section>
        </section>
      </section>
    </section>
    <CalendarComponent 
      :userId="userId"
      :userName="user.firstName + ' ' + user.lastName"
    />
  </div>
</template>

<script>
import CalendarComponent from '@/components/Profile/CalendarComponent.vue';
import WillingTosSelect from '@/components/Tags/WillingTosSelect.vue';
import IndustryButton from '@/components/Industry/IndustryButton.vue';

export default {
  components: {CalendarComponent, WillingTosSelect, IndustryButton},
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: null,
      tags: [],
      statistics: {},
      editingInfo: false,
      fields: [
        {'name': 'graduationYear', 'display': 'Class of: '}, 
        {'name': 'bio', 'display':  'Bio: '},
      ],
      frontEndTags: {
        'refer': 'Write referrals',
        'resumeReview': 'Review resumes',
        'mentor': 'Provide mentoring',
        'coffeeChat': 'Coffee Chat',
        'helpInterview': 'Help with Interview Preparation',
        'email': 'Email'
      },
    }
  },
  watch: {
    userId: function() {
      this.getUser();
      this.getStats();
      this.getTags();
    }
  },
  mounted() {
    this.getUser();
    this.getStats();
    this.getTags();
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
    async getTags() {
      const r = await fetch(`/api/tags/users/${this.userId}`);
      const res = await r.json();
      if (!r.ok) {
          throw new Error(res.error);
      }
      const newTags = [];
      for (const tag in res.tags) {
        if (res.tags[tag] == true) {
          newTags.push(tag);
        }
      }
      this.tags = newTags;
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
      
      const r = await fetch("api/users/profile", options);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.user = res.user;
      this.getTags();
      this.$store.commit('updateLastActive');
    }
  }
};
</script>

<style scoped>

button:hover {
  box-shadow: rgba(0, 0, 0, 0.2) 0 4px 12px;
  cursor: pointer;
}

textarea {
  resize: none;
  width: 100%;
  min-height: 80px;
}

.padding {
  padding: 5px;
}

.wideBox {
  width: 100%;
}

.info {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.infoBox {
  border: 0.5px solid black;
  margin-top: 16px;
  margin-bottom: 16px;
  padding-left: 20px;
  padding-right: 20px;
}

.infoHeader {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}

.bioInfo {
  width: 65%;
  margin-right: 10px;
}

.statistics {
  width: 35%;
}

.row {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
}

.statRow {
  justify-content: space-between;
}

.field {
  font-weight: 400;
}

.value {
  font-weight: 300;
}

.label {
  min-width: 120px;
  font-weight: 500;
}


.name {
  font-weight: 300;
  font-size: 48px;
  margin-bottom: 0px;
}

.flatText {
  color: gray;
  box-sizing: border-box;
}

h2 {
  padding: 0px 0px;
  font-size: 16px;
  font-weight: 300;
}

.accessStatus {
  margin-top: 10px;
}

.redText {
  color: red
}

.greenText {
  color: green
}

p b {
  font-weight: 400;
}


p {
  font-weight: 300;
  margin-top: 48px;
}

section .main {
  margin-top: 48px;
}

</style>
