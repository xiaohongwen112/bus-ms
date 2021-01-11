import Vue from 'vue';
import Router from 'vue-router';

import Indicator from '../subPages/Indicator';
import Dimension from '../subPages/Dimension';
import Baseline from '../subPages/Baseline';

Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/indicator',
  },
  {
    path: '/indicator',
    name: 'indicator',
    component: Indicator,
  },
  {
    path: '/dimension',
    name: 'dimension',
    component: Dimension,
  },
  {
    path: '/baseline',
    name: 'baseline',
    component: Baseline,
  },
  ],
});

export default router;
