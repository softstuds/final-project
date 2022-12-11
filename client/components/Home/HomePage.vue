<!-- Page for meeting information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
    <section class="row">
        <div class="column">
            <header>
            <h1>Welcome to Alumni Connector!</h1>
            </header>
        </div>
        <div class="column"> 
            <button
                v-if="$store.state.userId"
                onclick="window.location.href=`${window.location.href}search`"
            >
                Search for users!
            </button>
        </div>
    </section>
    
      <section>
        <div class="row">
            <div class="columnMeeting">
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
            <div class="columnMeeting">
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
            <div class="columnBox">
                <h2>Your Statistics</h2>
                <section class="stats">
                    <p v-for="stat in statistics">
                    <b>{{ stat.label }}:</b>
                    {{ stat.value }}
                    </p>
                </section>
                
            </div>
        </div>
      </section>
    </main>
  </template>
  
  <script>
  import MeetingComponent from '@/components/Meeting/MeetingComponent.vue';
  
  export default {
    name: 'HomePage',
    components: {
      MeetingComponent,
    },
    data () {
        return {
            upcomingMeetings: [],
            incomingRequests: [],
            statistics: {},
            user: null,
            renderkey: 0,
        }
    },
    mounted() {
        this.getAllMeetings();
        this.getStats();
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
        
        const paramsIncoming = {method: 'GET', url: '/api/timeblock/requests/received'}
        this.request(paramsIncoming).then(function(result) {
            that.incomingRequests = Object.values(result);
        });

        },
    async getStats() {
      const r = await fetch(`api/timeblock/stats/${this.$store.state.user._id}`);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }

      this.statistics = res.statistics;
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

h1 {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #729e85;
  font-size: 48px;
}

h3 {
  font-size: 12px;
}

button {
  width: 20%;
  margin: 4px 12px;
  height: 36px;
  background-color: #729e85;
  border-radius:6px;
  border: 0px;
  color: white;
}

.row {
  display: flex;
  /* align-items: center;
  justify-content: space-between; */
  padding: 24px 0px 0px 0px;
}

.column {
    flex: 80%;
}
.timeBlock {
    border: 0.5px solid black;
    padding: 10%;
    margin: 5% 10% 5%;
}

.stats {
    border: 0.5px solid black;
    border-radius: 8px;
    padding: 32px 32px;
}

p {
    margin: 12px;
    font-weight: 300;
}

b {
    font-weight: 400;
}

.columnMeeting {
  flex: 1;
}

.columnBox {
    flex: 1.6;
    padding: 0px 0px 0px 24px;
    margin: 0px 0px 0px 24px;
}

.column .meeting {
    padding: 0%;
}

</style>