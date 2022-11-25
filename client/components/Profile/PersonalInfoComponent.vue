<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
  <div>
    <section class="info">
      <section>
        <i class="flatText">
          Last Active: {{ $store.state.lastActive }}
        </i>
        <p>Class of {{ $store.state.gradYear }}</p>
        <p><b>Industry: </b>{{ $store.state.industry }}</p>
      </section>
    </section>
    <section class="availability">
      <h3>Availability</h3>
      <section class="calendar">
        <section
          v-for="(date, index) in availabilities"
          :key="index"
          class="day"
        >
          <section 
            v-for="block in date"
            :key="block.getHours()"
            class="timeBlock"
          >
            {{ block.getHours() == 12 ?
              12 + "pm" :
              block.getHours() == 0 ?
                12 + "am" :
                block.getHours() > 12 ?
                  block.getHours() - 12 + "pm" : 
                  block.getHours() + "am"
            }}
            <div>
              <button>Claim</button>
            </div>
          </section>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfoComponent',
  data() {
    return {
        availabilities: []
    }
  },
  mounted() {
    this.getAvailibilities();
  },
  methods: {
    getAvailibilities() {
        const availabilities = [
            [new Date('24 Nov 2022 13:00')],
            [new Date('25 Nov 2022 15:00')],
            [new Date('26 Nov 2022 11:00'), new Date('26 Nov 2022 13:00')],
            [],
            [new Date('28 Nov 2022 9:00')],
            [new Date('29 Nov 2022 10:00')],
            [new Date('30 Nov 2022 14:00')]
        ];
        this.availabilities = availabilities;
    }
  }
};
</script>

<style scoped>
.flatText {
    color: gray
}
.availability {
    border-top: 1px solid black;
}
.calendar {
    display: flex;
}

.day {
    width: 100%;
    border: 1px solid black;
    padding: 1%
}

.timeBlock {
    border: 1px solid black;
    padding: 10%
}
</style>
