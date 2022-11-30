<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeInfoForm',
  mixins: [BlockForm],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url: '/api/users/info',
      method: 'PATCH',
      hasBody: true,
      refreshUser: true,
      clearFields: false,
      fields: [
        {id: 'industry', label: 'Industry', value: this.user.industry},
        {id: 'graduationYear', label: 'Graduation Year', value: this.user.graduationYear},
        {id: 'bio', label: 'Bio', value: this.user.bio},
        {id: 'zoomLink', label: 'Zoom Link', value: this.user.zoomLink}
      ],
      title: 'Change Profile Info',
      callback: () => {
        const message = 'Successfully updated profile!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
