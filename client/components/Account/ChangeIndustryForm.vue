<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeIndustryForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/industry',
      method: 'PATCH',
      setUser: true,
      hasBody: true,
      fields: [
        {id: 'industry', label: 'Industry', value: ''}
      ],
      title: 'Change industry',
      callback: () => {
        const message = 'Successfully changed industry!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
