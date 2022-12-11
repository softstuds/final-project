<template>
    <multiselect
        v-model="value"
        :options="options"
        :show-labels="true"
        select-label="Click to select"
        deselect-label="Click to unselect"
        @select="addFilter"
        @remove="removeFilter">
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    name: 'IndustryFilter',
    components: {Multiselect},
    props: {
        refreshCount: {
            type: Number,
            required: true
        }
    },
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
            value: '',
            filteredIds: []
        }
    },
    watch: {
        refreshCount: function(val) {
            this.value = "";
        }
    },
    methods: {
        addFilter(value) {
            this.getUsersInIndustry(value);
        },
        removeFilter(value) {
            this.$emit('unfilterUsers');
        },
        async getUsersInIndustry(value) {
            const r = await fetch(`api/industry/${value}`);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            this.filteredIds = res.map(user => user.userId);
            this.$emit('unfilterUsers');
            this.$emit('filterUsers', this.filteredIds);
        }
    }
}

</script>