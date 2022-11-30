import Vue from 'vue';
import VueRouter from 'vue-router';
import SearchPage from './components/Search/SearchPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import MeetingPage from './components/Meeting/MeetingPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: SearchPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/meeting', name: 'Meetings', component: MeetingPage},
  {path: '/profile', name: 'Profiles', component: ProfilePage},
  {path: '/profile/:userId', name: 'Profiles', component: ProfilePage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.userId) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.userId) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }


    if (to.name === 'Meetings' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Meetings and is not signed in
      return;
    }

    if (to.name === 'Profiles' && !router.app.$store.state.username) {

      next({name: 'Login'}); // Go to Login page if user navigates to Profiles and are not signed in
      return;
    }
  }

  next();
});

export default router;
