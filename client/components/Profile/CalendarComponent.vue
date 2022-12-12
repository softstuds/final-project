<!-- Component for viewing a person's availability -->

<template>
  <div>
    <section class="availability">
      <section class="availabilityHeader">
        <div>
          <h3><b>Availability</b></h3>
          <i v-if="hasRequestable">Times where {{ userName }} is available to meet.</i>
          <i v-else>{{ userName }} has no availabilities right now.</i>
        </div>
        <div 
          v-if="(userId !== $store.state.userId && hasRequestable && $store.state.hasAccess !== true)"
          class="tooltip"
        >
          <p class="tooltipEmphasized">Why can't I request availabilities?</p>
          <span class="tooltiptext">
            You need to have availabilities on your own profile 
            in order to request others' availabilities.
          </span>
        </div>
      </section>
      <section v-if="(hasRequestable || editing)">
        <div class="borderedBox">
          <section
            v-for="day in daysOfWeek"
            class="borderedBox">
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
              :class="getClass(i, index)"
              @click="updateSelection(i, index)"
            >
              <section class="borderedBox">
                {{ calendarDays[i][index].day.getMonth() + 1 }}/{{ calendarDays[i][index].day.getDate() }}
              </section>
              <section 
                v-for="block in date"
                :key="block._id"
                class="timeBlock"
              >
                {{ block.start.getHours() % 12 == 0 ?
                  12 :
                  block.start.getHours() % 12
                }}:{{ block.start.getMinutes() == 0 ? '00' : block.start.getMinutes() }}
                {{ block.start.getHours() < 12 ? 'am' : 'pm' }}
                <div class="row">
                  <section class="column" v-if="userId !== $store.state.userId">
                    <button 
                      v-if="$store.state.hasAccess === true"
                      class="activeButton"
                      @click="requestTimeBlock(block._id)"
                    >
                      Request
                    </button>
                    <button 
                      v-else
                      class="disabledButton"
                    >
                      Request
                    </button>
                  </section>

                    <button
                    v-if="editing"
                    class="deleteButton column"
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
            @click="startEditing"
          >
            Edit My Availabilities
          </button>
          <button 
            v-else
            class="editButton"
            @click="hideTimeSelector"
          >
            Stop Editing
          </button>
        </section>
      </section>
      <section id="selectTime" class="dateSelectorFooter">
        <section class="timeSelector">
          <section class="selector">
            <div>
              Selected Day: {{ selectedDateString }}
            </div>
          </section>
          <section class="selector" @change="updateEndTime">
            <div><small>Start Time: </small></div>
            <select id="startTime">
              <option
                v-for="(time, i) in times"
                :key="i"
                :value="i"
              >
                {{ time }}
              </option>
            </select>
          </section>
          <section class="selector">
            <div><small>End Time: </small></div>
            <select id="endTime">
              <option
                v-for="(time, i) in times"
                :key="i"
                :value="i"
              >
                {{ time }}
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
        <section class="bottomTooltip">
          <div 
            class="tooltip"
          >
            <small>Having trouble entering availabilities?</small>
            <span class="tooltiptext">
              You can only enter times between now and the end of the calendar shown (4 weeks).
            </span>
          </div>
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
        },
        userName: {
          type: String,
          required: true
        }
    },
    data() {
        return {
            today: new Date(),
            editing: false,
            hasRequestable: false,
            timeBlocks: [],
            calendarDays: [],
            daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            times: [
              '12:00am', '12:30am', '1:00am', '1:30am', '2:00am', '2:30am', '3:00am', '3:30am', '4:00am', '4:30am', '5:00am', '5:30am', 
              '6:00am', '6:30am', '7:00am', '7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
              '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm', '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '5:30pm',
              '6:00pm', '6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm', '9:00pm', '9:30pm', '10:00pm', '10:30pm', '11:00pm', '11:30pm',
            ],
            selectedWeek: 0,
            defaultDay: 0,
            selectedDay: 0,
            selectedDateString: '',
            alerts: {}
        }
    },
    watch: {
      userId: function() {
        this.editing = false;
        this.hasRequestable = false;
        this.getAvailibilities();
        this.hideTimeSelector();
      }
    },
    mounted() {
        this.getAvailibilities();
        this.hideTimeSelector();
    },
    methods: {
        startEditing() { // can only be done on $store.state.user
          if (!this.$store.state.user.meetingLink) {
            const e = "Please add a meeting link in your account settings before adding availabilities.";
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
          } else {
            this.showTimeSelector();
          }
          this.updateSelection(0, this.defaultDay);
        },
        updateSelection(i, index) {
          if (this.editing && i > 0 || index >= this.defaultDay) {
            this.selectedWeek = i;
            this.selectedDay = index;
          }
          const selectedDate = this.calendarDays[i][index].day;
          this.selectedDateString = selectedDate.getMonth() + 1 + "/" + selectedDate.getDate();
        },
        getClass(i, index) {
          const unselected = this.calendarDays[i][index].status;
          if (!this.editing || this.userId !== this.$store.state.userId) {
            return unselected;
          }
          if (this.selectedWeek != i || this.selectedDay != index) {
            return unselected;
          }
          return 'day selected';
        },
        async getAvailibilities() {
            const r = await fetch("api/timeblock/unclaimed/" + this.userId);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(today);
            start.setDate(start.getDate() - start.getDay());

            const nextFourWeeks = []
            for (var i = 0; i < 29; i++) {
              const nextDay = new Date(start);
              nextDay.setDate(start.getDate() + i);
              var status;
              if (nextDay.getMonth() < today.getMonth() || nextDay.getDate() < today.getDate()) {
                status = 'day pastDay';
              } else {
                if (nextDay.getMonth() == today.getMonth() && nextDay.getDate() == today.getDate()) {
                  this.defaultDay = i % 7;
                }
                status = 'day';
              }
              nextFourWeeks.push({day: nextDay, status});
            }
            
            const timeBlocks = [];
            for (var j = 0; j < 28; j++) {
              timeBlocks.push([]);
            }
            
            const now = Date.now();
            var foundBlock = false;
            for (var block of res) {
                block.start = new Date(block.start);
                if (block.start < now) {
                  continue;
                }
                for (var k = 0; k < 28; k++) {
                  if (block.start >= nextFourWeeks[k].day && block.start < nextFourWeeks[k + 1].day) {
                    timeBlocks[k].push(block);
                    foundBlock = true;
                    break;
                  }
                }
            }

            this.timeBlocks = [];
            this.calendarDays = [];
            for (var l = 0; l < 4; l++) {
              const rangeStart = l * 7;
              const rangeEnd = (l + 1) * 7;
              this.calendarDays.push(nextFourWeeks.slice(rangeStart, rangeEnd));
              this.timeBlocks.push(timeBlocks.slice(rangeStart, rangeEnd));
            }

            if (foundBlock) {
              this.hasRequestable = true;
            }
        },
        showTimeSelector() {
            this.editing = true;
            const timeSelector = document.getElementById('selectTime');
            timeSelector.style.display = "flex";

            const today = new Date();

            const startTime = document.getElementById('startTime');
            startTime.selectedIndex = 18;
            const endTime = document.getElementById('endTime');
            endTime.selectedIndex = 19;
        },
        hideTimeSelector() {
            this.editing = false;
            const timeSelector = document.getElementById('selectTime');
            timeSelector.style.display = "none";
        },
        updateEndTime() {
          const startTime = document.getElementById('startTime');
          const endTime = document.getElementById('endTime');
          endTime.selectedIndex = startTime.selectedIndex + 1;
        },
        async addTimeBlock() {
            const startTime = new Date(this.calendarDays[this.selectedWeek][this.selectedDay].day);
            const endTime = new Date(startTime);

            const startElement = document.getElementById('startTime');
            const endElement = document.getElementById('endTime');
            startTime.setHours(Math.floor(startElement.value / 2), (startElement.value % 2 * 30), 0, 0);
            endTime.setHours(Math.floor(endElement.value / 2), (endElement.value % 2 * 30), 0, 0);

            const today = new Date();
            if (startTime < today) {
              startTime.setFullYear(today.getFullYear() + 1); // ensure that date is always in future
              endTime.setFullYear(today.getFullYear() + 1);
            }

            const options = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify({start: startTime.toString(), end: endTime.toString()})
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

            if (!this.$store.state.hasAccess) {
              this.$store.commit('updateAccess');
            }
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
                const message = 'View requested meeting in Meetings tab!';
                this.$set(this.alerts, message, 'success');
                setTimeout(() => this.$delete(this.alerts, message), 3000);
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

            if (this.$store.state.hasAccess) {
              this.$store.commit('updateAccess');
            }
        }
    }
};
</script>

<style scoped>

.activeButton {
  background-color:cornflowerblue
}

.disabledButton {
  color:lightgray
}

.deleteButton {
  width: 100%;
  margin: 4px 0px;
  height: 24px;
  background-color: #c46345;
  border-radius:6px;
  border: 0px;
  color: white;
}

.editButton {
  height: 25px
}
.availability {
    border-top: 1px solid black;
}

.availabilityHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.editFooter {
    display: flex;
    justify-content: end;
    margin-top: 10px;
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

.pastDay {
  background-color:lightgray;
}

.day {
  width: 100%;
  border: 1px solid black;
  min-height: 100px;
  padding-bottom: 30px;
  /* height: 100px;
  overflow-y: scroll; */
}

.selected {
  background-color:yellow;
}

.borderedBox {
  border-bottom: 1px solid black;
  display: flex;
  justify-content: center;
  width: 100%;
}

.timeBlock {
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
}

.timeSelector {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dateSelectorFooter {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selector {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 10px;
}

.bottomTooltip {
  margin-top: 50px;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  color: gray;
  font-style: italic;
}

.tooltipEmphasized {
  background-color: yellow;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 400px;
  bottom: 100%;
  left: 50%;
  margin-left: -200px;
  background-color: black;
  color: #fff;
  font-style: normal;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  font-size: medium;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

.row {
  display: flex;
}

.column {
  flex: 2;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.alerts {
    position: relative;
    z-index: 99;
    text-align: center;
}

</style>
