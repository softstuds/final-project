<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeMeetingLinkForm',
  mixins: [BlockForm],
  props: {
    originalValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: '/api/users/meetingLink',
      method: 'PATCH',
      hasBody: true,
      refreshUser: true,
      fields: [
        {id: 'meetingLink', label: 'Meeting Link', value: this.originalValue}
      ],
      title: 'Change Meeting Link',
      callback: () => {
        const message = 'Successfully changed meeting link!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>


