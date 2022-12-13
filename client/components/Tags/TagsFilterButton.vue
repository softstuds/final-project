<template>
    <section class="flex-buttons">
        <button 
            class="filter-button"
            v-for="tagName in frontEndTags"
            @click="toggleActive(backEndTags[tagName])"
            :class="{active: active[backEndTags[tagName]]}">
            {{ tagName }}
        </button>
    </section>
</template>
<script>
export default {
    name: 'TagsFilterButton',
    props: {
        refreshCount: {
            type: Number,
            required: true
        },
        initialValue: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            frontEndTags: {
                'refer': 'Write referrals',
                'resumeReview': 'Review resumes',
                'mentor': 'Provide mentoring',
                'coffeeChat': 'Coffee Chat',
                'helpInterview': 'Help with Interview Preparation',
                'email': 'Email'
            },
            backEndTags: {},
            active: {},
            filteredIds: [],
        }
    },
    mounted() {
        this.backEndTags = this.inverse(this.frontEndTags);
        this.active = this.initializeActive(this.frontEndTags);
        if (this.initialValue.length > 0) {
            this.active[this.initialValue] = true;
        }
    },
    watch: {
        refreshCount: function(val) {
            this.active = this.initializeActive(this.active);
        }
    },
    methods: {
        toggleActive(value) {
            const currentlyActive = this.active[value];
            this.active = this.initializeActive(this.active);
            if (!currentlyActive) {
                this.active[value] = true;
                this.request(value);
            } else {
                this.$emit('unfilterUsers');
            }
        },
        inverse (tagsDict) {
            var retobj = {};
            for(var key in tagsDict){
                retobj[tagsDict[key]] = key;
            }
            return retobj;
        },
        initializeActive (tagsDict) {
            var retobj = {};
            for(var key in tagsDict){
                retobj[key] = false;
            }
            return retobj;
        },
        async request(value) {
            const r = await fetch(`api/tags/${value}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.filteredIds = res.map(tag => tag.userId);
            this.$emit('unfilterUsers');
            this.$emit('filterUsers', this.filteredIds, value);
        }
    }
}
</script>

<style scoped>
.active{
  background-color: rgb(113,158,133) !important;
  color: white !important;
  border: 0px !important;
}

.filter-button {
  padding: 0px 18px;
  margin: 12px 8px 12px 0px;
  font-size: 16px;
  height: 28px;
  border: 0.5px solid black;
  background-color: white;
  border-radius: 4px;
  color: black;
  cursor: pointer;
}

.flex-buttons {
    display: flex;
    flex-direction: row;
    float: left;
    width: 100%;
    height: 100%;
}
</style>