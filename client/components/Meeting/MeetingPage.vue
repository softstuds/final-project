<!-- Page for meeting information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <!-- <h1>{{ $store.state.name }}'s Meetings</h1> -->
        <div class="row">
            <div class="column">
                <h2>Past Meetings</h2>
                <MeetingComponent />
            </div>
            <div class="column">
                <h2>Upcoming Meetings</h2>
            </div>
            <div class="column">
                <h2>Meeting Requests</h2>
            </div>
        </div>
        <MeetingComponent />
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
    methods: {

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
    padding: 48px 48px 48px;
}

h2, h2 > * {
    text-align: center;
    justify-content: center;
}

/* header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
} */

.row {
  display: flex;
  /* align-items: center;
  justify-content: space-between; */
  padding: 24px 0px 0px 0px;
}

.column {
  flex: 80%;
}


</style>