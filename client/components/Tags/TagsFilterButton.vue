<template>
    <section>
        <button 
            v-for="tagName in frontEndTags"
            @click="filterByTag">
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
        }
    },
    mounted() {
        this.backEndTags = this.inverse(this.frontEndTags);
    },
    methods: {
        filterByTag() {

        },
        inverse (tagsDict) {
            var retobj = {};
            for(var key in tagsDict){
                retobj[tagsDict[key]] = key;
            }
            return retobj;
        }
    }
}
</script>