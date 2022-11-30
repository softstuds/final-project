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
                :meeting="block"
                 />
                </section>
            </div>
            <div class="column">
                <h2>Incoming Requests</h2>

            </div>
            <div class="column">
                <h2>Outgoing Requests</h2>
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
            user: {
                firstName: '',
            },
        }
    },
    mounted() {
        // this.getUser();
        this.getPastMeetings();
        this.getUpcomingMeetings();
        // this.getIncomingRequests();
        // this.getOutgoingRequests();
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
            const upcomingMeetings = [
                    [new Date('24 Nov 2022 13:00')],
                    [new Date('25 Nov 2022 15:00')]
                ];
            const params = {
                method: 'GET',
                url: '/api/timeblock/checkoccurred',
            }
            
            this.upcomingMeetings = this.request(params);

        },
        getUpcomingMeetings()  {
                // const upcomingMeetings = [
                //     [new Date('24 Nov 2022 13:00')],
                //     [new Date('25 Nov 2022 15:00')]
                // ];
                // const params = {
                //     method: 'GET',
                //     url: '/api/timeblock/checkoccurred',
                //     callback: () => {
                //         this.$set(this.alerts, params.message, 'success');
                //         setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                //     }
                // }
                
                // this.upcomingMeetings = this.request(params);
        },
    // async getIncomingRequests() {

    // },
    // async getOutgoingRequests() {

    // },
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
        var r;
        r = await fetch(`${params.url}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        return res;

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


.row {
  display: flex;
  /* align-items: center;
  justify-content: space-between; */
  padding: 24px 0px 0px 0px;
}
.timeBlock {
    border: 0.5px solid black;
    padding: 10%;
    margin: 5% 0% 5%;
}

.column {
  flex: 80%;
}

.column .meeting {
    padding: 0%;
}

</style>