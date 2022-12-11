<!-- Form for deleting account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteAccountForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'DELETE',
      setUser: true,
      deleteUser: true,
      title: 'Delete account',
      fields: [],
      content: 'Deleting your account is permanent and irreversible. Proceed only if you understand these consequences.',
      callback: () => {
        this.$router.push({name: 'Home'}); // Goes to Home page after deleting account
        this.$store.commit('alert', {
          message: 'Your account has been deleted!', status: 'success'
        });
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
  margin-bottom: 14px;
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

button {
  width: 20%;
  position: relative;
  top: 26px;
  margin: 4px 12px;
  height: 36px;
  background-color: #c46345;
  border-radius:6px;
  border: 0px;
  color: white;
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
