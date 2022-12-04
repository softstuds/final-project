<template>
    <multiselect
        v-model="value"
        :options="options"
        :show-labels="false"
        @select="addFilter"
        @remove="removeFilter">
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    name: 'IndustryFilter',
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
    methods: {
        addFilter() {

        },
        removeFilter() {
            
        }
    }
}

</script>