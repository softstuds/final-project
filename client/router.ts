import Vue from 'vue';
import VueRouter from 'vue-router';
import SearchPage from './components/Search/SearchPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import MeetingPage from './components/Meeting/MeetingPage.vue';
import HomePage from './components/Home/HomePage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import AboutPage from './components/About/AboutPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/search', name: 'Search', component: SearchPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/meeting', name: 'Meetings', component: MeetingPage},
  {path: '/profile/:userId', name: 'My Profile', component: ProfilePage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/about', name: 'About', component: AboutPage},
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


    if (to.name === 'Meetings' && !router.app.$store.state.userId) {
      next({name: 'Login'}); // Go to Login page if user navigates to Meetings and is not signed in
      return;
    }


    if (to.name === 'My Profile' && !router.app.$store.state.userId) {
      next({name: 'Login'}); // Go to Login page if user navigates to Profiles and are not signed in
      return;
    }

    if (to.name === 'Home' && !router.app.$store.state.userId) {
      next({name: 'Login'}); // Go to Login page if user navigates to Profiles and are not signed in
      return;
    }
    
  }

  next();
});

export default router;
