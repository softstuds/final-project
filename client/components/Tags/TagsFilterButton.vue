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
            filteredIds: []
        }
    },
    mounted() {
        this.backEndTags = this.inverse(this.frontEndTags);
        this.active = this.initializeActive(this.frontEndTags);
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
            this.$emit('filterUsers', this.filteredIds);
        }
    }
}
</script>

<style scoped>
.active{
  background-color:green;
}

.filter-button {
    margin: 3px;
    border-radius: 12px;
    width: 100px;
    float: left;
}

.flex-buttons {
    display: flex;
    flex-direction: row;
    float: left;
    width: 100%;
}
</style>