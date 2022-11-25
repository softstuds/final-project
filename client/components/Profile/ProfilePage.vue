<!-- Page for profile information -->
<!-- User should be authenticated in order to see this page -->

<template>
    <main>
      <section>
        <PersonalInfoComponent 
          :userId="userId"
        />
      </section>
    </main>
  </template>
  
  <script>
  import PersonalInfoComponent from '@/components/Profile/PersonalInfoComponent.vue';
  
  export default {
    name: 'AccountPage',
    components: {PersonalInfoComponent},
    data() {
      return {
        userId: this.$route.params.userId
      }
    }
  };
  </script>
  