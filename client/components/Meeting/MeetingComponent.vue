<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
    <main>
    <section class="timeBlock">
      <p v-if="type=='outgoing'">Requested meeting with {{typeof owner.name == String ? owner.name : ' '}}</p>
      <p v-else-if="type=='incoming'">Incoming meeting invite from {{requester.name}}</p>
      <p v-if="(type=='upcoming' && this.user._id==meeting.owner)">Upcoming meeting with {{requester.name}}</p>
      <p v-if="(type=='upcoming' && this.user._id==meeting.requester)">Upcoming meeting with {{owner.name}}</p>
      <p v-if="(type=='past' && this.user._id==meeting.owner)">Past meeting with {{requester.name}}</p>
      <p v-if="(type=='past' && this.user._id==meeting.requester)">Past meeting with {{owner.name}}</p>
      <p class="time">{{this.day}} at {{hour}}:{{minute}} {{pm}}</p>

      
      <div v-if="type=='outgoing'" class="row">
        <p v-if="(meeting.accepted==true)" class="accepted column">accepted</p>
        <p v-else class="notAccepted column">not accepted</p>
        <button class="column" @click="cancelRequest">cancel</button>
      </div>
      <div v-else-if="type=='incoming'" class="row">
        <button @click="rejectRequest" class="column">Reject</button>
        <button @click="acceptRequest" class="column accept">Accept</button>
      </div>
      <div v-else-if="type=='upcoming'" class="row">
        <p>Meeting Link: {{this.link ?? 'nolink'}}</p>
      </div>
      <div v-else-if="(type=='past' && this.feedback==false)">
        <p>Did this meeting successfully occur?</p>
        <div class="row">
          <button @click="feedbackNotMet" class="column">No</button>
          <button @click="feedbackMet" class="column accept">Yes</button>
        </div>
      </div>
      <div v-else-if="(type=='past' && this.feedback==true)">
        <p v-if="(meeting.met==true)" class="met">You marked this meeting as met</p>
        <p v-else class="notAccepted">You marked this meeting as not met</p>
      </div>

    </section>
    </main>
</template>

<script>
export default {
  name: 'MeetingComponent',
  props: {
    meeting: {
      type: Object,
      required: true
    },
    type: String,
    button: String,
  },
  data () {
    return {
      user: this.$store.state.user,
      owner: {
        name: ' ',
        email: ' ',
      },
      requester: {
        name: ' ',
        email: ' ',
      },
      feedback: Boolean,
      link: String,
      day: String,
      hour: String,
      minute: String,
      pm: String,
    }
  },
  mounted () {
    this.getOwnerRequester();
    this.getDate();
    this.needFeedback();
  },
  methods: {
    async getOwnerRequester() {
      try {
        const r = await fetch(`/api/users/${this.meeting.owner}`, {
          method: 'GET', 
          headers: {'Content-Type': 'application/json'},
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.owner.name = res.user.firstName+res.user.lastName;
        this.owner.email = res.user.email;
        this.link = res.user.meetingLink;

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      try {
        const r = await fetch(`/api/users/${this.meeting.requester}`, {
          method: 'GET', 
          headers: {'Content-Type': 'application/json'},
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.requester.name = `${res.user.firstName} ${res.user.lastName}`;
        this.requester.email = res.user.email;

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      
    },
    async cancelRequest () {
      try {
        const r = await fetch(`/api/timeblock/request/${this.meeting._id}/unsend`, {
          method: 'PATCH', 
          headers: {'Content-Type': 'application/json'}
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      this.key = 'reset';
      this.$emit('refreshRequested');
    
    },
    async rejectRequest () {
      try {
        const r = await fetch(`/api/timeblock/accepted/${this.meeting._id}`, {
          method: 'PATCH', 
          headers: {'Content-Type': 'application/json'},
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.$emit('refreshRequest');
    },
    async acceptRequest () {
      try {
          const r = await fetch(`/api/timeblock/accepted/${this.meeting._id}`, {
          method: 'PATCH', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({input: 'true'})
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.$emit('refreshRequest');
    },
    getDate () {
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      const date = new Date(this.meeting.start);
      var hours = date.getHours();
      var minutes = date.getMinutes();


      if (hours > 12) {
        this.hour = hours % 12;
        this.pm = 'pm';
      } else {
        this.hour = hours;
        this.pm = 'am';
      }

      if (minutes < 10) {
        const strminutes = '0' + minutes.toString();
        this.minute = strminutes;
      } else {
        this.minute = minutes;
      }
      this.day = date.toLocaleDateString('en-us', options)

    },
    needFeedback() {
      if (this.meeting.met == null) {
        this.feedback = false;
      } else {
        this.feedback = true;
      }
    },
    async feedbackMet() {
      if (!this.meeting.met) {
        try {
        const r = await fetch(`/api/timeblock/met/${this.meeting._id}`, {
          method: 'PATCH', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({input: true})
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.needFeedback();
      this.$emit('reRender');
    }
      
    },
    async feedbackNotMet() {
      if (!this.meeting.met) {
        try {
        const r = await fetch(`/api/timeblock/met/${this.meeting._id}`, {
          method: 'PATCH', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({input: false})
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.feedback = true;
      this.needFeedback();
      this.$emit('reRender');

      }
      
    }


    }
};
</script>

<style scoped>

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

section, p {
  font-size: 10pt;
  padding: 0px;
}
.timeBlock {
    border: 0.5px solid black;
    padding: 5% 10%;
}

.time {
  font-size: 12pt;
  font-weight: 300;
  /* color:forestgreen; */
}

.notAccepted {
  color: indianred;
}

.met {
  color: forestgreen;
}

.accept {
  background-color: forestgreen;
  color: white;
  border: none;
}

.row {
  display: flex;
  /* align-items: center;
  justify-content: space-between; */
  /* padding: 24px 0px 0px 0px; */
}

.column {
  flex: 80%;
  padding: px;
}

button {
  padding: 0px;
  margin: 12px 24px 12px 0px;
  width: 4px;
  border: 0.5px solid black;
  background-color: white;
  border-radius: 4px;
  color: black;
  cursor: pointer;
}

</style>