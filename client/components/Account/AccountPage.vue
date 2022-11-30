<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for {{ $store.state.name }}</h2>
      </header>
      <ChangeIndustryForm />
      <ChangeGradYearForm />
      <ChangeEmailForm />
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
import ChangeEmailForm from '@/components/Account/ChangeEmailForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import ChangeIndustryForm from '@/components/Account/ChangeIndustryForm.vue';
import ChangeGradYearForm from '@/components/Account/ChangeGradYearForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeEmailForm,
    ChangePasswordForm,
    ChangeIndustryForm,
    ChangeGradYearForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>
