import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loaclRoutes = [{
  path: '/',
  redirect: '/BizChart',
}];
const allPages = require.context('../subPages', false, /\.vue$/);
const importAll = allPages.keys().map(allPages);
importAll.forEach((e) => {
  loaclRoutes.push({
    name: e.default.name,
    path: `/${e.default.name}`,
    component: e.default,
  });
});

export default new Router({
  routes: loaclRoutes,
});
