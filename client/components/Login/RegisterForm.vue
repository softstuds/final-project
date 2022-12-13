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
      newUser: true,
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


<style scoped>
form {
  border: 0px solid #111;
  padding: 0.5rem;
  display: flex;
  width: 840px;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 80px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 4px;
}

textarea {
   font-family: inherit;
   font-size: inherit;
   padding: 10px 0px;
}

input {
  padding: 10px 8px;
  font-size: 16px;
  margin: 4px 12px 0px 0px;
}

.columnform {
  width: 20%;
  position: relative;
  top: 290px;
  right: 170px;
  margin: 4px 12px;
  height: 36px;
}

.columnform:hover {
  box-shadow: rgba(0, 0, 0, 0.2) 0 4px 12px;
  cursor: pointer;
}

.row {
  display: flex;
}

.column {
  flex: 2;
}

.columnform {
  flex: 0.4;
}
</style>

