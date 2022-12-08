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
            const r = await fetch(url);
            const res = await r.json();
            if (!r.ok) {
                throw new Error(res.error);
            }
            const filteredIds = res.map(user => user.id);
            this.$emit('filterUsers', filteredIds);

        }
    }
}
</script>