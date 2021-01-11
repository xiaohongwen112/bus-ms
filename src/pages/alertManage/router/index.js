import Vue from 'vue';
import Router from 'vue-router';

import Contact from '../subPages/Contact';
import Message from '../subPages/Message';
import Template from '../subPages/Template';
import List from '../subPages/List';
// import Data from '../subPages/Data';

Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/contact',
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
  },
  {
    path: '/message',
    name: 'message',
    component: Message,
  },
  {
    path: '/template',
    name: 'template',
    component: Template,
  },
  {
    path: '/list',
    name: 'list',
    component: List,
  },
  // {
  //   path: '/demo',
  //   name: 'demo',
  //   component: Demo,
  // },
  ],
});

export default router;
