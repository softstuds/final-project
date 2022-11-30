<template>
    <section>
        <multiselect 
            v-model="value" 
            label="name" 
            track-by="name" 
            :options="options" 
            :multiple="true" 
            :hideSelected="true" 
            @select="addWillingTos" 
            @remove="removeWillingTos">
        </multiselect>
    </section>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    name: "WillingTosSelect",
    components: {Multiselect},
    props: {
        // freet being added
        userId: {
            type: String,
            required: true
        }
    },
    created() {
        // set options based on user's categories
        // for (let category of this.$store.state.categories) {
        //     const tag = {name: category.name};
        //     this.options.push(tag);
        // }
        
        // // pre-set values of categories already selected for a freet
        // for (let category of this.freet.categories) {
        //     const tag = {name: category.name};
        //     this.value.push(tag);
        // }
    },
    data() {
        return {
            alerts: {},
            options: [],
            tags: {},
            frontEndTags: {
                'refer': 'Write referrals',
                'resumeReview': 'Review resumes',
                'mentor': 'Provide mentoring',
                'coffeeChat': 'Coffee Chat',
                'helpInterview': 'Help with Interview Preparation',
                'email': 'Email'
            },
            backEndTags: {
                'Write referrals': 'refer',
                'Review resumes': 'resumeReview',
                'Provide mentoring': 'mentor',
                'Coffee Chat': 'coffeeChat',
                'Help with Interview Preparation': 'helpInterview',
                'Email': 'email'
            },
            value: []
        };
    },
    mounted() {
        this.getTags();
    },
    watch: {
        tags: function(val) {
            this.options = [];
            this.value = [];
            for (let tag in this.tags) {
                if (this.tags[tag] === true) {
                    const selectTag = {name: this.frontEndTags[tag]};
                    this.value.push(selectTag);
                } else if (this.tags[tag] === false) {
                    const selectTag = {name: this.frontEndTags[tag]};
                    this.options.push(selectTag);
                }
            }
        }
    },
    methods: {
        addWillingTos() {
            console.log('added');
        },
        removeWillingTos() {
            console.log('removed');
        },
        async getTags() {
            const r = await fetch(`/api/tags/${this.userId}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.tags = res.tags;
        }
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>