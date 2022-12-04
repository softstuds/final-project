<!-- Component for viewing a person's availability -->

<template>
  <div>
    <section class="availability">
      <h3><b>Availability</b></h3>
      <section>
        <div class="daysOfWeek">
          <section
            v-for="day in daysOfWeek"
            class="dayOfWeek">
              {{ day }}
          </section>
        </div>

        <section class="calendar">
          <div
            v-for="(week, i) in timeBlocks"
            :key="i"
            class="week"
          >
            <section
              v-for="(date, index) in week"
              :key="index"
              class="day"
            >
              <section class="dayHeader">
                {{ calendarDays[i][index].getMonth() + 1 }}/{{ calendarDays[i][index].getDate() }}
              </section>
              <section 
                v-for="block in date"
                :key="block.start.getHours()"
                class="timeBlock"
              >
                {{ block.start.getHours() == 12 ?
                  12 + "pm" :
                  block.start.getHours() == 0 ?
                    12 + "am" :
                    block.start.getHours() > 12 ?
                      block.start.getHours() - 12 + "pm" : 
                      block.start.getHours() + "am"
                }}
                <div>
                  <button 
                    v-if="userId !== $store.state.userId"
                    @click="requestTimeBlock(block._id)"
                  >
                    Request
                  </button>
                  <button 
                    v-if="editing"
                    @click="deleteTimeBlock(block._id)"
                  >
                    Delete
                  </button>
                </div>
              </section>
            </section>
          </div>
        </section>
      </section>
      <section class="editFooter">
        <section
          v-if="userId === $store.state.userId"
        >
          <button 
            v-if="!editing"
            class="editButton"
            @click="showDatePicker"
          >
            Edit My Availabilities
          </button>
          <button 
            v-else
            class="editButton"
            @click="hideDatePicker"
          >
            Stop Editing
          </button>
        </section>
      </section>
      <section 
        id="selectDate"
        class="dateSelector"
      >
        <section class="selector">
          <div><small>Month</small></div>
          <select id="dateMonth">
            <option 
              v-for="i in 12"
              :key="i"
              :value="i"
            >
              {{ i }}
            </option>
          </select>
        </section>
        <section class="selector">
          <div><small>Day</small></div>
          <select id="dateDay">
            <option 
              v-for="j in 31"
              :key="j"
              :value="j"
            >
              {{ j }}
            </option>
          </select>
        </section>
        <section class="selector">
          <div><small>Time</small></div>
          <select id="dateTime">
            <option :value="0">
              12 am
            </option>
            <option 
              v-for="k in 11"
              :key="k"
              :value="k"
            >
              {{ k }} am
            </option>
            <option :value="12">
              12 pm
            </option>
            <option 
              v-for="k in 11"
              :key="k + 12"
              :value="k + 12"
            >
              {{ k }} pm
            </option>
          </select>
        </section>
        <section class="selector">
          <button
            @click="addTimeBlock"
          >
            Add Availability
          </button>
        </section>
      </section>
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
    name: 'CalendarComponent',
    props: {
        userId: {
        type: String,
        required: true
        }
    },
    data() {
        return {
            editing: false,
            timeBlocks: [],
            calendarDays: [],
            daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            alerts: {}
        }
    },
    mounted() {
        this.getAvailibilities();
        this.hideDatePicker();
    },
    methods: {
        async getAvailibilities() {
            const r = await fetch("api/timeblock/unclaimed/" + this.userId);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }

            const start = new Date();
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - start.getDay());

            const nextFourWeeks = []
            for (var x = 0; x < 4; x++) {
              const nextSeven = [];
              for (var i = 0; i < 7; i++) {
                const nextDay = new Date(start);
                nextDay.setDate(start.getDate() + x * 7 + i);
                nextSeven.push(nextDay);
              }
              nextFourWeeks.push(nextSeven);
            }
            this.calendarDays = nextFourWeeks;
            
            const timeBlocks = []
            for (var x = 0; x < 4; x++) {
              const week = [];
              for (var i = 0; i < 7; i++) {
                week.push([]);
              }
              timeBlocks.push(week);
            }

            for (var block of res) {
                block.start = new Date(block.start);
                for (var j = 0; j < 28; j++) {
                  const row = Math.floor(j / 7);
                  const col = j % 7;
                  const sameMonth = block.start.getMonth() == nextFourWeeks[row][col].getMonth();
                  const sameDay = block.start.getDate() == nextFourWeeks[row][col].getDate();
                  if (sameMonth && sameDay) {
                    timeBlocks[row][col].push(block);
                    break;
                  }
                }
            }

            this.timeBlocks = timeBlocks;
        },
        showDatePicker() {
            this.editing = true;
            const dateSelector = document.getElementById('selectDate');
            dateSelector.style.display = "flex";

            const today = new Date();

            const monthSelector = document.getElementById('dateMonth');
            monthSelector.selectedIndex = today.getMonth(); // already zero indexed

            const daySelector = document.getElementById('dateDay');
            daySelector.selectedIndex = today.getDate() - 1;  // not zero indexed

            const timeSelector = document.getElementById('dateTime');
            timeSelector.selectedIndex = 9;
        },
        hideDatePicker() {
            this.editing = false;
            const dateSelector = document.getElementById('selectDate');
            dateSelector.style.display = "none";
        },
        async addTimeBlock() {
            const date = new Date();

            const monthSelector = document.getElementById('dateMonth');
            date.setMonth(monthSelector.value - 1); // zero index

            const daySelector = document.getElementById('dateDay');
            date.setDate(daySelector.value);

            const timeSelector = document.getElementById('dateTime');
            date.setHours(timeSelector.value, 0, 0, 0);

            const today = new Date();
            if (date < today) {
              date.setFullYear(today.getFullYear() + 1); // ensure that date is always in future
            }

            const options = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify({
                start: date.toString(),
                })
            };

            try {
                const r = await fetch('api/timeblock', options);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
            this.getAvailibilities();
        },
        async requestTimeBlock(blockId) {            
            const options = {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify({userId: this.$store.state.userId})
            };

            try {
                const r = await fetch('api/timeblock/request/' + blockId, options);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
            this.getAvailibilities();
        },
        async deleteTimeBlock(blockId) {            
            const options = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
            };

            try {
                const r = await fetch('api/timeblock/' + blockId, options);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
            this.getAvailibilities();
        }
    }
};
</script>

<style scoped>
.availability {
    border-top: 1px solid black;
}

.editFooter {
    display: flex;
    justify-content: end;
    margin-top: 10px;
}

.editButton {
  height: 25px
}
.calendar {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.week {
  display: flex;
  width: 100%;
}

.day {
  width: 100%;
  border: 1px solid black;
  min-height: 100px;
}
.dayHeader {
  border-bottom: 1px solid black;
  display: flex;
  justify-content: center;
  width: 100%;
}

.daysOfWeek {
  border: 1px solid black;
  display: flex;
  justify-content: center;
  width: 100%;
}
.dayOfWeek {
  border: 1px solid black;
  display: flex;
  justify-content: center;
  width: 100%;
}

.timeBlock {
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
}

.dateSelector {
  display: flex;
  justify-content: center;
}

.selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    margin: 10px
}

</style>
