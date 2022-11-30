<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
    <main>
        <span>{{this.$store.state.timeblocks}}</span>
    </main>
</template>

<script>
export default {
  name: 'MeetingComponent',
};
</script>

<style scoped>

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>