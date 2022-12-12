<!-- Page for information about Alumni Connector-->
<!-- User does not have to be authenticated to see this page -->
<template>
    <main>
        <section class="column">
            <header>
                <h1>About Alumni Connector</h1>
            </header>
                <h2>Our Mission...</h2>
                <p>
                    Alumni connector was created to faciliate more genuine connections between 
                    students and alumni. Alumni are one of the most effective resources for students 
                    in terms of career networking. Sometimes alumni’s purposes for joining the network
                    are not transparent. Students and other alumni can't tell whether others are 
                    actually looking to help others or if they signed up ten years ago and
                    never checked the alumni website again. In Alumni Connector, our users' 
                    intentions for joining are more clear, making the networking process more efficient and enjoyable.
                </p>

                <h2>How We're Different from Other Networking Sites...</h2>
                <p>
                    To help make networking easier and more enjoyable, we offer a variety of features that increase
                    the transparency between users. One of these is the ability to list availabilities for coffee chats
                    right on your profile. This lessens the back-and-forth needed to find a time that works for both parties and 
                    makes the scheduling process more reliable and efficient. We believe in quid pro quo, so each user must enter
                    their availabilities for other users to schedule meetings with them if they want to schedule time to meet with other users. 
                    Each user also selects from a list of pre-made tags to identify what services they are 
                    willing to offer to other students and alumni from their school. Lastly, we clearly display the last logged
                    in time for every user on the platform. With this, users are able to manage their expectations about whether 
                    or not a user will be responsive to their meeting requests.
                </p>
        </section>
    </main>
</template>
<script>

export default {
    name: 'AboutPage'
}
</script>
<style scoped>
section {
  display: flex;
  flex-direction: column;
}

main {
    padding: 10px 24px 10px;
    margin: 0;
}

h2, h2 > * {
    text-align: center;
    justify-content: center;
    font-weight: 300;
}

p {
    font-weight: 300;
    text-align: center;
    justify-content: center;
}


h1 {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #729e85;
  font-size: 48px;
}

.row {
  display: flex;
  flex-direction: row;
  padding: 24px 0px 0px 0px;
  align-items: flex-end;
}

.column {
    flex: 80%;
}
</style>