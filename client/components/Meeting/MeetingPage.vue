<!-- Page for meeting information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section class="main">
        <h1>Your Meetings</h1>
        <div 
        v-if="pastMeetings.bool || upcomingMeetings.bool || incomingRequests.bool || outgoingRequests.bool"
        class="row">
            <div class="column">
                <h2>Past Meetings</h2>
                <section
                v-if="pastMeetings.bool"
                class="meeting"
                >
                <MeetingComponent
                v-for="block in pastMeetings.timeBlocks"
                :key="block.id"
                :meeting="block"
                :type="'past'"
                @refreshMeetings="getAllMeetings"
                 />
                </section>
                <section class="noMeetings" v-else>
                  You have no past meetings. Start searching for 
                  users!
                  <button  onclick="window.location.href='/#/search'">
                      Search for users!
                  </button>
                </section>
            </div>
            <div class="column">
                <h2>Upcoming Meetings</h2>
                <section
                v-if="upcomingMeetings.bool"
                class="meeting"
                >
                <MeetingComponent
                v-for="block in upcomingMeetings.timeBlocks"
                :key="block.id"
                :meeting="block"
                :type="'upcoming'"
                @refreshMeetings="getAllMeetings"
                 />
                </section>
                <section class="noMeetings" v-else>
                  You have no upcoming meetings. Start searching for 
                  users!
                  <button onclick="window.location.href='/#/search'">
                      Search for users!
                  </button>
                </section>
            </div>
            <div class="column">
                <h2>Incoming Requests</h2>
                <section 
                class="meeting"
                v-if="incomingRequests.bool"
                >
                <MeetingComponent
                v-for="block in incomingRequests.timeBlocks"
                :key="block.id"
                :meeting="block"
                :type="'incoming'"
                @refreshMeetings="getAllMeetings"
                 />
                </section>
                <section class="noMeetings" v-else>
                  You have no incoming requests. Start searching for 
                  users!
                  <button onclick="window.location.href='/#/search'">
                      Search for users!
                  </button>
                </section>
            </div>
            <div class="column">
                <h2>Outgoing Requests</h2>
                <section
                class="meeting"
                v-if="outgoingRequests.bool"
                >
                <MeetingComponent
                v-for="block in outgoingRequests.timeBlocks"
                :key="block.id"
                :meeting="block"
                :type="'outgoing'"
                @refreshMeetings="getAllMeetings"
                 />
                </section>
                <section class="noMeetings" v-else>
                  You have no outgoing requests. Start searching for 
                  users!
                  <button onclick="window.location.href='/#/search'">
                      Search for users!
                  </button>
                </section>
            </div>
        </div>
        <div v-else>
          <div class="row">
          <div class="column">
                <h2>Past Meetings</h2>
                <section class="noMeetings">
                  You have no past meetings. Start searching for 
                  users!
                </section>
          </div>
          <div class="column">
                <h2>Upcoming Meetings</h2>
                <section class="noMeetings">
                  You have no upcoming meetings. Start searching for 
                  users!
                </section>
          </div>
          <div class="column">
                <h2>Incoming Requests</h2>
                <section class="noMeetings">
                  You have no incoming requests. Start searching for 
                  users!
                </section>
          </div>
          <div class="column">
                <h2>Outgoing Requests</h2>
                <section class="noMeetings">
                  You have no outgoing requests. Start searching for 
                  users!
                </section>
          </div>
        </div>
          <section>
            <button class="large" onclick="window.location.href='/#/search'">Search for users!</button>
          </section>
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
            pastMeetings: {
              timeBlocks: [],
              bool: Boolean
            },
            upcomingMeetings: {
              timeBlocks: [],
              bool: Boolean
            },
            incomingRequests: {
              timeBlocks: [],
              bool: Boolean
            },
            outgoingRequests: {
              timeBlocks: [],
              bool: Boolean
            },
            user: this.$store.state.user,
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
        console.log('called');
        const paramsUpcoming = {method: 'GET', url: '/api/timeblock/upcoming'}
        this.request(paramsUpcoming).then(function(result) {
          if (Object.values(result).length != 0) {
            that.upcomingMeetings.timeBlocks = Object.values(result);
            that.upcomingMeetings.bool = true;
          } else {
            that.upcomingMeetings.bool = false;
          }
        });

        const paramsPast = {method: 'GET', url: '/api/timeblock/met'}
        this.request(paramsPast).then(function(result) {
          console.log('hello')
          if (Object.values(result).length != 0) {
            that.pastMeetings.timeBlocks = Object.values(result);
            that.pastMeetings.bool = true;
          } else {
            that.pastMeetings.bool = false;
          }
          console.log('mariah', that.pastMeetings.timeBlocks)

        });

        const paramsOutgoing = {method: 'GET', url: '/api/timeblock/requests/sent'}
        this.request(paramsOutgoing).then(function(result) {
          if (Object.values(result).length != 0) {
            that.outgoingRequests.timeBlocks = Object.values(result);
            that.outgoingRequests.bool = true;
          } else {
            that.outgoingRequests.bool = false;
          }
        });
        
        const paramsIncoming = {method: 'GET', url: '/api/timeblock/requests/received'}
        this.request(paramsIncoming).then(function(result) {
          if (Object.values(result).length != 0) {
            that.incomingRequests.timeBlocks = Object.values(result);
            that.incomingRequests.bool = true;
          } else {
            that.incomingRequests.bool = false;
          }
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

h2, h2 > * {
    text-align: center;
    justify-content: center;
    font-weight: 300;
    
}

h3 {
  font-size: 12px;
}

.main > h1 {
  margin-top: 48px;
  font-weight: 300;
}

h1 {
  font-size: 48px;
}

.row {
  display: flex;
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

.noMeetings {
  padding-top: 12px;
  margin: 24px;
  text-align: center;
  font-size: 16px;
}

button {
  width: 60%;
  margin: 24px auto;
  height: 36px;
  background-color: #729e85;
  border-radius:6px;
  border: 0px;
  color: white;
}

button:hover {
  box-shadow: rgba(0, 0, 0, 0.2) 0 4px 12px;
  cursor: pointer;
}

.large {
  width: 30%;
  height: 48px;
  margin-top: 48px;
  font-size: 24px;
  cursor: pointer;
}

</style>