<template>
  <section class="card">
    <router-link 
      :to="'/profile/'+ user._id"
    >
      <b class="name">{{ user.firstName }} {{ user.lastName }}</b>
    </router-link>
    <div class="otherInfo">
      <i><b>Class of {{ user.graduationYear }}</b></i>
      <p class="industry-info"><b>Industry: {{ user.industry !== undefined ? user.industry.industryType : "None" }}</b></p>
      <p 
        class="tags-info"
        v-if="tagsDisplayed.length > 0">
        I am willing to:
        <li class="tags-list"
        v-for="tag in tagsDisplayed">{{ tag }}</li>
      </p>
      <p 
        class="tags-info"
        v-if="tagsDisplayed.length === 0">
        I am willing to: Unspecified
      </p>
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
            const r = await fetch(`/api/tags/users/${this.user._id}`);
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
  border: 1px solid #111;
  border-radius: .30rem;
  fill-opacity: 10;
  padding: 20px;
  position: relative;
  margin:10px;
}

.name {
    font-size: larger
}
.otherInfo {
    font-size: medium;
    margin-top: 10px;
}

.tags-info {
  font-size: 14px;
  width: 40%;
  line-height: 2px;
}

.tags-list {
  font-size: 14px;
  margin-bottom: 0px;
}

.industry-info {
  position: absolute;
  top: 0px;
  right: 10px;
  font-size: 16px;
}
</style>