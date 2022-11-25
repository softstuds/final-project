<template>
  <section class="card">
    <b class="name">{{ user.firstName }} {{ user.lastName }}</b>
    <div class="otherInfo">
      <i>Class of {{ user.graduationYear }}</i>
      <p><b>Industry: {{ user.industry !== undefined ? user.industry : "None" }}</b></p>
    </div>
  </section>
</template>

<script>
export default {
    name: "UserCardComponent",
    props: {
        user: {
            type: Object,
            required: true
        }
    }
}
</script>
<style scoped>
.card {
    border-top: 1px solid black;
    padding: 10px;
    padding-top: 20px;
    margin: 5px;
}

.name {
    font-size: larger
}

.otherInfo {
    font-size: medium;
    margin-top: 10px;
}
</style>