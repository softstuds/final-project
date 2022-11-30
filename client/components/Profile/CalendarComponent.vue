<!-- Component for viewing a person's availability -->

<template>
  <div>
    <section class="availability">
      <h3><b>Availability</b></h3>
      <section class="calendar">
        <section
          v-for="(date, index) in timeBlocks"
          :key="index"
          class="day"
        >
          <section class="dayHeader">
            {{ calendarDays[index].getMonth() + 1 }}/{{ calendarDays[index].getDate() }}
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
              <button v-if="userId !== $store.state.userId">
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
            calendarDays: []
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

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextSeven = [];
            for (var i = 0; i < 8; i++) {
                const nextDay = new Date(today);
                nextDay.setDate(today.getDate() + i);
                nextSeven.push(nextDay);
            }
            this.calendarDays = nextSeven;
            
            const timeBlocks = []
            for (var k = 0; k < 7; k++) {
                timeBlocks.push([]);
            }
            
            for (var block of res) {
                block.start = new Date(block.start);
                if (block.start < nextSeven[0] || block.start > nextSeven[-1]) {
                continue;
                }
                for (var j = 0; j < 7; j++) {
                if (block.start < nextSeven[j + 1]) {
                    timeBlocks[j].push(block);
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
        },
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
