<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
    name: 'FindUsersForm',
    mixins: [InlineForm],
    props: {
        refreshCount: {
            type: Number,
            required: true
        },
        initialValue: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            value: this.initialValue
        }
    },
    watch: {
        refreshCount: function(val) {
            this.value = "";
        }
    },
    methods: {
        async submit() {
            try {
                const url = this.value ? `/api/users/graduationYear/${this.value}` : '/api/users';
                const r = await fetch(url);
                const res = await r.json();
                if (!r.ok) {
                    throw new Error(res.error);
                }
                const filteredIds = res.map(user => user.id);
                this.$emit('filterUsers', filteredIds, this.value);
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>