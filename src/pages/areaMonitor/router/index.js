import Vue from 'vue';
import Router from 'vue-router';

import Main from '../subPages/Main';
import Hello from '../subPages/Hello';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
    },
  ],
});
