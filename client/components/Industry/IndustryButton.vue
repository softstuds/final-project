<template>
    <multiselect
        v-model="value"
        :options="options"
        :show-labels="true"
        select-label="Click to select"
        deselectLabel="Click to unselect"
        @select="addIndustry"
        @remove="removeIndustry">
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    name: 'IndustryButton',
    components: {Multiselect},
    data() {
        return {
            options: [
                'Agriculture',
                'Arts',
                'Construction',
                'Consumer Goods',
                'Corporate Services',
                'Design',
                'Education',
                'Energy & Mining',
                'Entertainment',
                'Finance',
                'Hardware & Networking',
                'Healthcare',
                'Legal',
                'Manufacturing',
                'Media & Communications',
                'Non-Profit',
                'Public Administration',
                'Public Safety',
                'Real Estate',
                'Recreation & Travel',
                'Retail',
                'Software & IT Services',
                'Transportation & Logistics',
                'Wellness & Fitness'
            ],
            value: 'Unspecified'
        }
    },
    mounted() {
        this.getIndustry();
    },
    methods: {
        async getIndustry() {
            const r = await fetch(`/api/industry/users/${this.$store.state.user.id}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.value = res.industry.industryType;
        },
        addIndustry(value) {
            const options = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    newIndustry: value,
                }),
                credentials: 'same-origin' // Sends express-session credentials with request
            };
            this.request(options);
        },
        removeIndustry(value) {
            const options = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    newIndustry: 'Unspecified',
                }),
                credentials: 'same-origin' // Sends express-session credentials with request
            };
            this.request(options);
        },
        async request(options) {
            const r = await fetch('/api/industry', options);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.value = res.industry.industryType;
            
            const userR = await fetch(`/api/users/${this.$store.state.user.id}`);
            const userRes = await userR.json();
            if (!userR.ok) {
                throw new Error(userRes.error);
            }
            this.$store.commit('setUser', userRes.user);
        }
    }
}
</script>
<style src="vue-select/dist/vue-select.css">
</style>