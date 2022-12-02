<template>
    <section>
        <button 
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
            active: {}
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
        }
    }
}
</script>

<style>
.active{
  background-color:red;
}
</style>