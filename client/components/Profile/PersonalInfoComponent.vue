<!-- Component for viewing a person's information (name, username, graduation year, last active, industry -->

<template>
    <main>
        <h3>Information about {{ this.$store.state.name }}</h3>
        <article>
            <section>
                <h4>Email: </h4>
                <p>{{ this.$store.state.username }}</p>
                
                <h4>Graduation Year: </h4>
                <p>Class of {{ this.$store.state.gradYear }}</p>
                
                <h4>Last Active on: </h4>
                <p>{{ this.$store.state.lastActive }}</p>

                <h4>Industry: </h4>
                <p>{{ this.$store.state.industry }}</p>
            </section>
        </article>
    </main>
</template>

<script>
export default {
  name: 'PersonalInfoComponent',
};
</script>