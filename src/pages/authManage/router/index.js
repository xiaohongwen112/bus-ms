import Vue from 'vue';
import Router from 'vue-router';

import Demo from '../subPages/Demo';
import Domain from '../subPages/Domain';
import Role from '../subPages/Role';
import User from '../subPages/User';
import Data from '../subPages/Data';

Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/data',
  },
  {
    path: '/domain',
    name: 'domain',
    component: Domain,
  },
  {
    path: '/role',
    name: 'role',
    component: Role,
  },
  {
    path: '/user',
    name: 'user',
    component: User,
  },
  {
    path: '/data',
    name: 'data',
    component: Data,
  },
  {
    path: '/demo',
    name: 'demo',
    component: Demo,
  }],
});

export default router;
