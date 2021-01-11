import Vue from 'vue';
import Router from 'vue-router';

import GroupMain from '../subPages/GroupMain';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GroupMain',
      component: GroupMain,
    },
  ],
});
