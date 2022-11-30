<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeGradYearForm',
  mixins: [BlockForm],
  props: {
    originalValue: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      url: '/api/users/graduationYear',
      method: 'PATCH',
      refreshUser: true,
      hasBody: true,
      fields: [
        {id: 'graduationYear', label: 'Graduation Year', value: this.originalValue}
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
