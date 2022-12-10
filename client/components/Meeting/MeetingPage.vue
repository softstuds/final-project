<!-- Page for meeting information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <h1>Your Meetings</h1>
        <div class="row">
            <div class="column">
                <h2>Past Meetings</h2>
                <section
                v-for="block in this.pastMeetings"
                class="meeting"
                >
                <MeetingComponent
                :key="block.id"
                :meeting="block"
                :type="'past'"
                @reRender="reRender"
                 />
                </section>
            </div>
            <div class="column">
                <h2>Upcoming Meetings</h2>
                <section
                class="meeting"
                >
                <MeetingComponent
                v-for="block in this.upcomingMeetings"
                :key="block.id"
                :meeting="block"
                :type="'upcoming'"
                @refreshMeetings="getAllMeetings"
                 />
                </section>
            </div>
            <div class="column">
                <h2>Incoming Requests</h2>
                <section
                class="meeting"
                >
                <MeetingComponent
                v-for="block in this.incomingRequests"
                :key="block.id"
                :meeting="block"
                :type="'incoming'"
                @refreshMeetings="getAllMeetings"
                 />
                </section>
            </div>
            <div class="column">
                <h2>Outgoing Requests</h2>
                <section
                class="meeting"
                >
                <MeetingComponent
                v-for="block in this.outgoingRequests"
                :key="block.id"
                :meeting="block"
                :type="'outgoing'"
                @refreshMeetings="getAllMeetings"
                 />
                </section>
            </div>
        </div>
      </section>
    </main>
  </template>
  
  <script>
  import MeetingComponent from '@/components/Meeting/MeetingComponent.vue';
  
  export default {
    name: 'MeetingPage',
    components: {
      MeetingComponent,
    },
    data () {
        return {
            pastMeetings: [],
            meetingsWithoutFeedback: [],
            upcomingMeetings: [],
            incomingRequests: [],
            outgoingRequests: [],
            user: null,
            renderkey: 0,
        }
    },
    mounted() {
        this.getAllMeetings();

    },
    methods: {
        reRender() {
            this.renderkey += 1;
        },
    async getAllMeetings()  {

        let that = this;

        const paramsUpcoming = {method: 'GET', url: '/api/timeblock/upcoming'}
        this.request(paramsUpcoming).then(function(result) {
            that.upcomingMeetings = Object.values(result);
        });

        const paramsPast = {method: 'GET', url: '/api/timeblock/checkoccurred'}
        this.request(paramsPast).then(function(result) {
            that.pastMeetings = Object.values(result);
        });

        const paramsPastNoFeedback = {method: 'GET', url: '/api/timeblock/check'}
        this.request(paramsPastNoFeedback).then(function(result) {
            that.meetingsWithoutFeedback = Object.values(result);
        });

        const paramsOutgoing = {method: 'GET', url: '/api/timeblock/requests/sent'}
        this.request(paramsOutgoing).then(function(result) {
            that.outgoingRequests = Object.values(result);
        });
        
        const paramsIncoming = {method: 'GET', url: '/api/timeblock/requests/received'}
        this.request(paramsIncoming).then(function(result) {
            that.incomingRequests = Object.values(result);
        });

        },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, 
        headers: {'Content-Type': 'application/json'}
      };
    
      try {
        const r = await fetch(`${params.url}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }


        var arrayOfBlocks = [];
        for (var block of res){
          arrayOfBlocks.push(block);
        }
        
        return arrayOfBlocks;

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
    }
  };
  </script>

  <style scoped>

section {
  display: flex;
  flex-direction: column;
  /* background-color: #abd6be; */
  /* font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; */
}

main{
    /* padding: 48px 48px 48px; */
    padding: 10px 24px 10px;
    margin: 0;
}

main .column {
    padding: 0;
}

h1 {
  font-size: 36px;
  font-weight: 180;
  margin-top: 12px
}

h2, h2 > * {
    text-align: center;
    justify-content: center;
    font-weight: 400;
}

h3 {
  font-size: 12px;
}

.row {
  display: flex;
  /* align-items: center;
  justify-content: space-between; */
}
.timeBlock {
    border: 0.5px solid black;
    padding: 10%;
    margin: 5% 10% 5%;
}
.notAccepted {
  color: indianred;
}

.column {
  flex: 80%;
}

.column .meeting {
    padding: 0%;
}

</style>