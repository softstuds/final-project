<template>
    <label class="availability-checkbox">Has availability to meet
        <input type="checkbox">
        <span class="checkmark"></span>
    </label>
</template>
<script>
export default {
    name: 'AvailabilityFilter',
    data() {
        return {
            usersWithAvailability: []
        }
    }
}
</script>