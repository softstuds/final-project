<!-- Page for profile information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <PersonalInfoComponent 
          :userId="$route.params.userId"
        />
      </section>
    </main>
  </template>
  
  <script>
  import PersonalInfoComponent from '@/components/Profile/PersonalInfoComponent.vue';
  
  export default {
    name: 'AccountPage',
    components: {PersonalInfoComponent}
  };
  </script>
  