import Vue from 'vue';
import Router from 'vue-router';
import Index from '../subPages/Index';
import Day from '../subPages/Day';
import Month from '../subPages/Month';
import Season from '../subPages/Season';
import Year from '../subPages/Year';
import Custom from '../subPages/Custom';
import Demo from '../subPages/Demo';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
    },
    {
      path: '/day',
      name: 'Day',
      component: Day,
    },
    {
      path: '/month',
      name: 'Month',
      component: Month,
    },
    {
      path: '/season',
      name: 'Season',
      component: Season,
    },
    {
      path: '/year',
      name: 'Year',
      component: Year,
    },
    {
      path: '/custom',
      name: 'Custom',
      component: Custom,
    },
    {
      path: '/demo',
      name: 'Demo',
      component: Demo,
    },
  ],
});
