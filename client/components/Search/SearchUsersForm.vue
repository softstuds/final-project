<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
    name: 'SearchUsersForm',
    mixins: [InlineForm],
    data() {
        return {
            value:""
        }
    },
    methods: {
        async submit() {
            try {
                const names = this.value.split(' ');
                console.log(names);
                let url = '/api/users';
                if (names.length > 2) {
                    const message = 'You have entered more than a first and last name'
                    this.$set(this.alerts, message, 'error');
                    setTimeout(() => this.$delete(this.alerts, e), 3000);
                    return;
                }

                if (names.length === 2) {
                    url = `/api/users/search/${names[0]}-${names[1]}`;
                } else if (names.length === 1) {
                    url = `/api/users/search/${names[0]}`;
                }
                console.log(url);
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                console.log(res);
                // const filteredIds = res.map(user => user.id);
                // this.$emit('filterUsers', filteredIds);
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>