import Vue from 'vue';
import Router from 'vue-router';

import Summary from '../subPages/Summary';
import Single from '../subPages/Single';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'summary',
    component: Summary,
  }, {
    path: '/:query',
    name: 'single',
    component: Single,
  }],
});
