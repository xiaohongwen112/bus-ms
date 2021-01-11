import Vue from 'vue';
import Router from 'vue-router';

import Main from '../subPages/Main';

Vue.use(Router);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

const samples = requireAll(require.context('../subPages/samples', false, /\.vue$/));

export const children = samples.map(s => ({
  path: s.default.name,
  component: s.default,
})).sort((a, b) => a.path.localeCompare(b.path, { sensitivity: 'base' }));

console.log('samples', samples, children);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/samples',
    },
    {
      path: '/samples',
      name: 'main',
      component: Main,
      children,
    },
  ],
});
