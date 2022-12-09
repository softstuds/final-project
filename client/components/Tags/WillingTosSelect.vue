<template>
    <section>
        <multiselect 
            v-model="value" 
            label="name" 
            track-by="name" 
            placeholder="Select options"
            :options="options" 
            :multiple="true" 
            :hideSelected="true"
            :show-labels="false" 
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
            backEndTags: {},
            value: []
        };
    },
    mounted() {
        this.getTags();
        this.backEndTags = this.inverse(this.frontEndTags);
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
        async addWillingTos(value) {
            const options = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    tagName: this.backEndTags[value.name],
                    newValue: true
                }),
                credentials: 'same-origin' // Sends express-session credentials with request
            };
            const r = await fetch('/api/tags', options);
            const res = await r.json();
            this.tags = res.tags;
        },
        async removeWillingTos(value) {
            const options = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    tagName: this.backEndTags[value.name],
                    newValue: false
                }),
                credentials: 'same-origin' // Sends express-session credentials with request
            };
            const r = await fetch('/api/tags', options);
            const res = await r.json();
            this.tags = res.tags;
        },
        async getTags() {
            const r = await fetch(`/api/tags/users/${this.userId}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.tags = res.tags;
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>