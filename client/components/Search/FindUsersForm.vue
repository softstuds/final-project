<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
    name: 'FindUsersForm',
    mixins: [InlineForm],
    data() {
        return {
            value:""
        }
    },
    methods: {
        async submit() {
            const url = this.value ? `/api/users/graduationYear/${this.value}` : '/api/users';
            try {
                const r = await fetch(url);
                console.log(r);
                const res = await r.json();
                console.log(res);
                if (!r.ok) {
                    throw new Error(res.error);
                }

                console.log(res);
            } catch (e) {
                if (this.value === this.$store.state.filter) {
                // This section triggers if you filter to a user but they
                // change their username when you refresh
                this.$store.commit('updateFilter', null);
                this.value = ''; // Clear filter to show all users' freets
                this.$store.commit('refreshFreets');
                } else {
                // Otherwise reset to previous fitler
                this.value = this.$store.state.filter;
                }

                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>