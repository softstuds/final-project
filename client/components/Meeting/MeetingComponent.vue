<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
    <main>
    <section class="timeBlock">
      <p v-if="type=='outgoing'">Requested meeting with {{meeting.owner}}</p>
      <p v-else-if="type=='incoming'">Incoming meeting invite from {{meeting.requester}}</p>
      <p v-if="(type=='upcoming' && this.user==meeting.owner)">Upcoming meeting with {{meeting.requester}}</p>
      <p v-if="(type=='upcoming' && this.user==meeting.requester)">Upcoming meeting with {{meeting.owner}}</p>
      <p class="time">{{this.day}} at {{this.hour}}:{{this.minute}} {{this.pm}}</p>
      
      <div v-if="type=='outgoing'" class="row">
        <p v-if="(meeting.accepted==true)" class="accepted column">accepted</p>
        <p v-else class="notAccepted column">not accepted</p>
        <button class="column" @click="cancelRequest">cancel</button>
      </div>
      <div v-else-if="type=='incoming'" class="row">
        <button @click="rejectRequest" class="column">Reject</button>
        <button @click="acceptRequest" class="column accept">Accept</button>
      </div>

    </section>
    <!-- <section
    v-for="block in this.pastMeetings"
    class="timeBlock"
    >
    <span>{{block}}</span>
    </section> -->
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
    type: '',
    button: '',
  },
  data () {
    return {
      user: '', // Potentially-new content for this freet
      day: '',
      hour: '',
      minute: '',
      pm: '',
    }
  },
  mounted () {
    this.getDate();
    this.getUser();
  },
  methods: {
    async getUser() {
      const r = await fetch("api/users/" + this.$route.params.userId);
      const res = await r.json();
      if (!r.ok) {
          throw new Error(res.error);
      }
      
      this.user = res.user.email;
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

        console.log('BARDI', res);

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      this.key = 'reset';

    
    },
    async rejectRequest () {
      try {
        console.log('harry', this.meeting._id);
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
    },
    async acceptRequest () {
      try {
        console.log('harry', this.meeting._id);
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

      console.log(date);
    },
    async getOwner() {
      console.log('Heylo', this.user);
      // console.log('cardi', typeof this.owner)
      // try {
      //   const r = await fetch(`/api/users/email/${this.owner}`, {
      //     method: 'GET', 
      //     headers: {'Content-Type': 'application/json'}
      //   });

      //   const res = await r.json();
      //   if (!r.ok) {
      //     throw new Error(res.error);
      //   }

      //   console.log('BARDI', res);
      //   this.outgoingRequests = arrayOfBlocks;

      // } catch (e) {
      //   this.$set(this.alerts, e, 'error');
      //   setTimeout(() => this.$delete(this.alerts, e), 3000);
      // }
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
  margin: 12px;
  width: 4px;
  border: 0.5px solid black;
  background-color: white;
  border-radius: 4px;
  color: black;
  cursor: pointer;
}

</style>