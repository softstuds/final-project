<template>
    <label class="container">Has availability to meet
        <input 
            type="checkbox"
            id="checkbox"
            @change="checkChanged">
        <span class="checkmark"></span>
    </label>
</template>
<script>
export default {
    name: 'AvailabilityFilter',
    props: {
        refreshCount: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            filteredIds: [],
            checked: false
        }
    },
    watch: {
        refreshCount: function(val) {
            const checkBox = document.getElementById('checkbox');
            checkBox.checked = false;
            this.checked = false;
        }
    },
    methods: {
        checkChanged() {
            this.checked = !this.checked;
            if (this.checked) {
                this.getAvailabilityStatus();
            } else {
                this.$emit('unfilterUsers');
            }
        },
        async getAvailabilityStatus() {
            const r = await fetch(`/api/timeblock/availability/users`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.filteredIds = res.usersWithAvailability.map(user => user.id);
            this.$emit('filterUsers', this.filteredIds);
      }
    }
}
</script>
<style>

/** Styling from: https://www.w3schools.com/howto/howto_css_custom_checkbox.asp */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 17px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #729e85;;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

</style>