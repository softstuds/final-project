<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeEmailForm',
  mixins: [BlockForm],
  props: {
    originalValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: '/api/users/email',
      method: 'PATCH',
      hasBody: true,
      refreshUser: true,
      fields: [
        {id: 'email', label: 'Email', value: this.originalValue}
      ],
      title: 'Change Email',
      callback: () => {
        const message = 'Successfully changed email!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
