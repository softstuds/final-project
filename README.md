# Alumni Connector

## Structure

This code implements users, timeblocks, tags, and statistics with no styling. The backend code is contained in the `server` folder. The frontend code is in the `client` folder and is implemented using the [Vue](https://v2.vuejs.org/) framework.

The project is structured as follows:

- `api/index.ts` sets up the backend database connection and Express server. This should actually be in the `server` folder, but it must be here due to a Vercel limitation.
- `server/` contains the backend starter code from A5 (with some changes)
  - `tags/` contains files related to the Tags concept
  - `timeblock/` contains files related to the Time Block concept
  - `user/` contains files related to the User concept
- `client/` contains the frontend starter code
  - `App.vue` is the root component of your application
  - `main.ts` is the entry point of your application, which initializes Vue
  - `components/` contains the components of the frontend
    - `Account/` contains the account settings page and the related forms
    - `Profile/` contains the profiles and components related to Users' information
    - `Login/` contains the login/register page and the related forms
    - `Search/` contains the default page shown and how to search for other Users
    - `common/` contains general form components that can be reused across different concepts
  - `public/` contains base HTML files and static assets (like the default Alumni Connector logo)
  - `router.ts` contains the Vue router
  - `store.ts` contains the Vuex store, which stores application state and persistent data

## API Routes

The following api routes have been implemented (**Make sure to document all the routes that you have added.**):

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

#### `GET /api/timeblock` - Get all the time blocks for a user

**Returns**

- A list of all the time blocks for the user sorted in descending order by start

**Throws**

- `404` if user is not logged in

#### `GET /api/timeblock/checkoccurred` - Get all the time blocks that a user needs to mark as occurred/not

**Returns**

- A list of all the time blocks for the user to mark as occurred, sorted in descending order by start

**Throws**

- `404` if user is not logged in

#### `GET /api/timeblock/unclaimed/:userId` - Get all the time blocks that a given user has unclaimed

**Returns**

- A list of all the time blocks for the user to mark as occurred, sorted in descending order by start

**Throws**

- `404` if user is not logged in or the userId is not a valid one

#### `PUT /api/timeblock` - Create a new time block.

**Body**

- `start` _{string}_ - The start time of the time block

**Returns**

- The created time block

**Throws**

- `403` if the user is not logged in
- `409` If the user already has a time block with the given start time

#### `DELETE /api/timeblock/:timeBlockId` - Delete a time block

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in or user is not block owner
- `404` If the time block with given ID does not exist

#### `PATCH /api/timeblock/request/:timeBlockId` - Modify a time block by sending a request to meet

**Body**

- `userId` _{string}_ - The userId of the requester

**Returns**

- the updated time block

**Throws**

- `400` if the user is not given
- `403` if the user is not logged in or is already the owner of the time block
- `404` if either the time block or the user with given ID does not exist
- `409` if the time block has already passed

#### `PATCH /api/timeblock/accepted/:timeBlockId` - Modify a time block by accepting or rejecting it

**Body**

- `input` _{boolean}_ - The response of the owner

**Returns**

- the updated time block

**Throws**

- `403` if the user is not logged in or is not the owner of the time block
- `404` if either the time block with given ID does not exist or the input is not valid

#### `PATCH /api/timeblock/occurred/:timeBlockId` - Modify a time block by marking a meeting as occurred or not

**Body**

- `input` _{boolean}_ - The response of the owner or requester

**Returns**

- the updated time block

**Throws**

- `403` if the user is not logged in or user is not owner or requested
- `404` if either the time block with given ID does not exist or the input is not valid
- `409` if the time block start has not passed yet or is not an accepted meeting


## Installation

Run `npm install` in your terminal to install local dependencies. Create a `.env` file from the project folder in the root directory of your repo. Make sure you can run the starter code locally before proceeding.

## Running locally

Running locally requires a few extra npm scripts from `package.json`.
1. Run `npm run serve`, which compiles the frontend for hot-reloading with webpack and serves it at port `8080`.
2. Open a new terminal (with the original one still open) and run `npm run dev` to start the backend at port `3000`.
3. To view your website, **connect to [localhost:8080](http://localhost:8080)** (instead of port 3000) since the backend will no longer serve any HTML files.

Vue proxies any URL it can't resolve on the client side (at port 8080) to the server (to port 3030), which is why we can call API routes using relative URLs (such as `fetch('/api/user/session')`). See `client/vue.config.js` and associated [Vue CLI docs](https://cli.vuejs.org/config/#vue-config-js) for more details.

## Deployment to Vercel

We will be using Vercel to host a publicly accessible deployment of your application.

1. Log in to Vercel and go to the [project creation page](https://vercel.com/new) and select `Continue with GitHub`.

2. Find your frontend repository you just created and click `Import`. For the `Framework Preset`, choose `Vue.js`. In the `Build and Output Settings` section, toggle the override switch for `Output Directory` and set it to `client/dist`. In the `Environment Variables` section, add an entry where `NAME` is `MONGO_SRV` and `VALUE` is your [MongoDB secret](https://github.com/61040-fa22/fritter-backend#mongodb-atlas-setup).

3. Click `Deploy` and you will get a link like `https://fritter-starter-abcd.vercel.app/` where you can access your site.

Vercel will automatically deploy the latest version of your code whenever a push is made to the `main` branch.

## Using Vue
Working in Vue means working with Vue components. The starter code organizes components by the resultant tree structure of how the components are composed together.

### Template
Every component takes advantage of an [HTML-based template syntax](https://v2.vuejs.org/v2/guide/syntax.html), which is HTML code that binds the rendered DOM to the component data. Inside the template is where we can display specific form components like `<CreateFreetForm />`. We also take advantage of [conditional rendering](https://v2.vuejs.org/v2/guide/conditional.html) here to display different things to different users (such as signed in vs. signed out). For example, in `client/components/Freet/Freets.vue` in lines 5-23, we have:
```
<section v-if="$store.state.userId">
  <header>
    <h2>Welcome @{{ $store.state.user.firstName }}</h2>
  </header>
  <CreateFreetForm />
</section>
<section v-else>
  <header>
    <h2>Welcome to Alumni Connector!</h2>
  </header>
  <article>
    <h3>
      <router-link to="/login">
        Sign in
      </router-link>
      to access Alumni Connector.
    </h3>
  </article>
</section>
```
Here, if `store.state.userId` exists, we say `Welcome user.firstName`. Otherwise, we say `Welcome to Fritter!` and give them a link to the login page. This is just one example of conditional rendering.

### Components
Each `.vue` file also has script tag, which is where you can export the actual component.

The "top level" components displayed when you navigating to certain URLs (like `/login` or `/account`) are shown in `client/router.ts`. Within each of these components, we have:
- `name` name of the component
- `components` components that are used in this top level component, usually forms like `LoginForm`

The "lower level" components are the general form components that we have provided. These consist of:
- `name` name of the component
- `mixins` (sometimes) used to have reusable logic between components. In this case, mixins have components in `client/components/common/` like `BlockForm`.
- `props` (sometimes) properties that are passed from a parent component to child components as needed
- `data()` stores data associated with this Vue instance
- `methods` methods associated with the current component that can be used in it

### Routing
Routing on the server side means the server sending a response based on the URL path that the user is visiting. When we click on a link in a traditional server-rendered web app, the browser receives an HTML response from the server and reloads the entire page with the new HTML.

However, in a [Single-Page Application (SPA)](https://developer.mozilla.org/en-US/docs/Glossary/SPA) like the one we're developing, the client-side JavaScript can intercept the navigation, dynamically fetch new data, and update the current page without full page reloads. This typically results in a more snappy user experience, especially for use cases that are more like actual "applications", where the user is expected to perform many interactions over a long period of time.

In such SPAs, the "routing" is done on the client side, in the browser. A client-side router is responsible for managing the application's rendered view using browser APIs such as History API or the hashchange event. We use the [Vue Router](https://v3.router.vuejs.org) library for client-side routing, which is referenced in `client/router.ts`.

### References

> **IMPORTANT:** This starter code uses **[version 2](https://v2.vuejs.org/) of Vue**, not [version 3](https://vuejs.org/)! There are multiple significant breaking changes between the two versions, so **please only consult documentation, StackOverflow questions, and other resources that reference Vue 2**.

Here is a list of documentation you may want to consult while working with Vue:

* [Vue 2 main library documentation](https://v2.vuejs.org)
* [Vue Router for Vue 2](https://v3.router.vuejs.org)
* [Vuex for Vue 2](https://v3.vuex.vuejs.org)
* [Vue Template Explorer for Vue 2](https://v2.template-explorer.vuejs.org)
* [MDN's in-depth Vue tutorials](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks#vue_tutorials)
