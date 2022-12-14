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
                    Alumni Connector was created to faciliate more genuine connections between 
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
                    Users cannot directly email each other and instead must meet order to connect 
                    because we want to facilitate face-to-face interactions in order to develop
                    and hone users' interpersonal skills, which are critical in the workforce.
                    Each user also selects from a list of pre-made tags to identify what services they are 
                    willing to offer to other students and alumni from their school. Lastly, we clearly display the last logged
                    in time for every user on the platform. With this, users are able to manage their expectations about whether 
                    or not a user will be responsive to their meeting requests.
                </p>
                <h2>Watch our Demo...</h2>
                <iframe src="https://drive.google.com/file/d/17lBrbSISNXW8OERa5a2j6WGI3V52qw2u/preview" width="640" height="480" allow="autoplay">
                </iframe>
        </section>
    </main>
</template>
<script>

export default {
    name: 'AboutPage'
}
</script>
<style scoped>

iframe {
    align-self: center;
}

section {
  display: flex;
  flex-direction: column;
}

main {
    padding: 24px 10px 10px 108px !important;
    margin: auto !important;
    width: 900px;
}

h2, h2 > * {
    text-align: center;
    justify-content: center;
    font-weight: 500;
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
  text-align: center;
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