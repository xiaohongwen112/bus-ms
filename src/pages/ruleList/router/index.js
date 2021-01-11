import Vue from 'vue';
import Router from 'vue-router';

import Main from '../subPages/Main';
import Old from '../subPages/Old';
import RuleTemplate from '../subPages/RuleTemplate';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/old',
      name: 'old',
      component: Old,
    },
    {
      path: '/template',
      name: 'template',
      component: RuleTemplate,
    },
  ],
});
