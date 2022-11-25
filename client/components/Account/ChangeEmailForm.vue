<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeEmailForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/email',
      method: 'PATCH',
      hasBody: true,
      setUser: true,
      fields: [
        {id: 'email', label: 'Email', value: ''}
      ],
      title: 'Change email',
      callback: () => {
        const message = 'Successfully changed email!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
