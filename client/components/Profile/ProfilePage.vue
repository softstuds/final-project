<!-- Page for profile information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <header>
          <h2>{{ $store.state.name }}</h2>
        </header>
        <PersonalInfoComponent />
      </section>
    </main>
  </template>
  
  <script>
  import PersonalInfoComponent from '@/components/Profile/PersonalInfoComponent.vue';
  
  export default {
    name: 'AccountPage',
    components: {
      PersonalInfoComponent,
    }
  };
  </script>
  