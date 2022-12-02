<template>
    <v-select
        :options="options">
    </v-select>
</template>

<script>
import vSelect from "vue-select";

export default {
    name: 'IndustryButton',
    components: {vSelect},
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
            ]
        }
    },
    methods: {

    }
}
</script>
<style src="vue-select/dist/vue-select.css"></style>