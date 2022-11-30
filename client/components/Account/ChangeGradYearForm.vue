<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeGradYearForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/graduationYear',
      method: 'PATCH',
      setUser: true,
      hasBody: true,
      fields: [
        {id: 'graduationYear', label: 'Graduation Year', value: ''}
      ],
      title: 'Change Graduation Year',
      callback: () => {
        const message = 'Successfully changed graduation year!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
