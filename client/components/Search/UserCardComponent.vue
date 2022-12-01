<template>
  <section class="card">
    <router-link 
      :to="'/profile/'+ user._id"
    >
      <b class="name">{{ user.firstName }} {{ user.lastName }}</b>
    </router-link>
    <div class="otherInfo">
      <i>Class of {{ user.graduationYear }}</i>
      <p><b>Industry: {{ user.industry !== undefined ? user.industry : "None" }}</b></p>
      <p v-if="tagsDisplayed.length > 0">
        I am willing to: {{ tagsDisplayed.join(', ') }}</p>
        <p v-if="tagsDisplayed.length === 0">
        I am willing to: None selected</p>
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
    },
    data() {
      return {
        tags: {},
        frontEndTags: {
            'refer': 'Write referrals',
            'resumeReview': 'Review resumes',
            'mentor': 'Provide mentoring',
            'coffeeChat': 'Coffee Chat',
            'helpInterview': 'Help with Interview Preparation',
            'email': 'Email'
        },
        tagsDisplayed: []
      }
    },
    mounted() {
      this.getTags();
    },
    watch: {
      tags: function(val) {
            this.tagsDisplayed = [];
            for (let tag in this.tags) {
                if (this.tags[tag] === true) {
                  this.tagsDisplayed.push(this.frontEndTags[tag])
                }
            }
        }
    },
    methods: {
      async getTags() {
            const r = await fetch(`/api/tags/${this.user._id}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.tags = res.tags;
        },
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