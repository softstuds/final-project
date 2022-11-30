<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
    <main>
    <section class="timeBlock">{{meeting}}</section>
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
    meeting: "",
  },
  data () {
    
  },
  mounted() {
    // this.getUser();
    this.getPastMeetings();
    this.getUpcomingMeetings();
    this.getIncomingRequests();
    this.getOutgoingRequests();
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
    getPastMeetings() {
        const pastMeetings = [
            [new Date('24 Nov 2022 13:00')],
            [new Date('25 Nov 2022 15:00')]
        ];
        const url = '/api/timeblock/checkoccurred';
        // try {
        //     const r = await fetch(url);
        //     const res = await r.json();
        //     if (!r.ok) {
        //     throw new Error(res.error);
        //     }
        //     this.pastMeetings = res;
        // } catch (e) {
        //     console.log('error');
        // }
        this.pastMeetings = pastMeetings;
    },
    async getUpcomingMeetings()  {
        const pastMeetings = [
            [new Date('24 Nov 2022 13:00')],
            [new Date('25 Nov 2022 15:00')]
        ];
        const url = '/api/timeblock/checkoccurred';
        // try {
        //     const r = await fetch(url);
        //     const res = await r.json();
        //     if (!r.ok) {
        //     throw new Error(res.error);
        //     }
        //     this.pastMeetings = res;
        // } catch (e) {
        //     console.log('error');
        // }
        this.pastMeetings = pastMeetings;
    },
    async getIncomingRequests() {

    },
    async getOutgoingRequests() {

    },

    }
};
</script>

<style scoped>

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.timeBlock {
    border: 0.5px solid black;
    padding: 10%;
}

</style>