<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeIndustryForm',
  mixins: [BlockForm],
  props: {
    originalValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: '/api/users/industry',
      method: 'PATCH',
      refreshUser: true,
      hasBody: true,
      fields: [
        {id: 'industry', label: 'Industry', value: this.originalValue}
      ],
      title: 'Change Industry',
      callback: () => {
        const message = 'Successfully changed industry!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
