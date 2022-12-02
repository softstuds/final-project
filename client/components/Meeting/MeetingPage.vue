<!-- Page for meeting information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <div class="row">
            <div class="column">
                <h2>Past Meetings</h2>
                <section
                v-for="block in this.pastMeetings"
                class="meeting"
                >
                <MeetingComponent
                :meeting="block"
                 />
                </section>
            </div>
            <div class="column">
                <h2>Upcoming Meetings</h2>
                <section
                v-for="block in this.upcomingMeetings"
                class="meeting"
                >
                <MeetingComponent
                :key="block.id"
                :meeting="block"
                :type="'upcoming'"
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
            upcomingMeetings: [],
            incomingRequests: [],
            outgoingRequests: [],
            user: '',
        }
    },
    mounted() {
        this.getUser();
        this.getPastMeetings();
        this.getUpcomingMeetings();
        this.getIncomingRequests();
        this.getOutgoingRequests();
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
    async getPastMeetings() {
          try {
            const r = await fetch('/api/timeblock/checkoccurred', {
              method: 'GET', 
              headers: {'Content-Type': 'application/json'}
            });

            const res = await r.json();
            if (!r.ok) {
              throw new Error(res.error);
            }

            var arrayOfBlocks = [];
            for (var block of res){
              arrayOfBlocks.push(block);
            }
            
            this.pastMeetings = arrayOfBlocks;

          } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          }   

        },
    async getUpcomingMeetings()  {
      try {
          const r = await fetch('/api/timeblock/upcoming', {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'}
          });

          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }

          var arrayOfBlocks = [];
          for (var block of res){
            arrayOfBlocks.push(block);
          }

          this.upcomingMeetings = arrayOfBlocks;

        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }   
        },
    async getIncomingRequests() {
        try {
          const r = await fetch('/api/timeblock/requests/received', {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'}
          });

          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }

          var arrayOfBlocks = [];
          for (var block of res){
            arrayOfBlocks.push(block);
          }
          console.log(arrayOfBlocks, 'HELLO');
          this.incomingRequests = arrayOfBlocks;

        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }

        },
    async getOutgoingRequests() {
        try {
        const r = await fetch('/api/timeblock/requests/sent', {
          method: 'GET', 
          headers: {'Content-Type': 'application/json'}
        });

        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        var arrayOfBlocks = [];
        for (var block of res){
           arrayOfBlocks.push(block);
        }
        this.outgoingRequests = arrayOfBlocks;

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

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
          // console.log("yuou", block.owner);
          arrayOfBlocks.push(block);
        }
        return arrayOfBlocks;
        // this.outgoingRequests = arrayOfBlocks;

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
    paddiong: 0;
}

h2, h2 > * {
    text-align: center;
    justify-content: center;
}

h3 {
  font-size: 12px;
}

.row {
  display: flex;
  /* align-items: center;
  justify-content: space-between; */
  padding: 24px 0px 0px 0px;
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