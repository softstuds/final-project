<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="$store.state.user">
      <header>
        <h2>Account settings for {{ $store.state.user.firstName + ' ' + $store.state.user.lastName }}</h2>
      </header>
      <ChangeMeetingLinkForm :originalValue="$store.state.user.meetingLink ?? ''"/>
      <ChangeEmailForm :originalValue="$store.state.user.email"/>
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeMeetingLinkForm from '@/components/Account/ChangeMeetingLinkForm.vue';
import ChangeEmailForm from '@/components/Account/ChangeEmailForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeMeetingLinkForm,
    ChangeEmailForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>


<style scoped>

h2 {
  font-weight: 180;
  font-size: 36px;
}

</style>