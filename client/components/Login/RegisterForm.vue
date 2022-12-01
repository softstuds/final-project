<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setUser: true,
      fields: [
        {id: 'email', label: 'Email', value: ''},
        {id: 'password', label: 'Password', value: ''},
        {id: 'name', label: 'Name', value: ''},
        {id: 'graduationYear', label: 'Graduation Year (YYYY)', value: (new Date()).getFullYear()},
      ],
      title: 'Create account',
      callback: () => {
        const message = 'Successfully created an account!';
        this.$router.push({name: 'Home'});
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
