import Vue from 'vue';
import Router from 'vue-router';

// import { session$ } from '@/helpers/auth';

import SysStatus from '../subPages/SysStatus';
import AlertSetting from '../subPages/AlertSetting';
import StorageSetting from '../subPages/StorageSetting';
// import UserManagement from '../subPages/UserManagement';
import About from '../subPages/About';
import Log from '../subPages/Log';

import SysStatusCPU from '../subPages/SysStatusCPU';
import SysStatusDB from '../subPages/SysStatusDB';
import SysStatusMem from '../subPages/SysStatusMem';
import SysStatusNet from '../subPages/SysStatusNet';
import SysStatusStore from '../subPages/SysStatusStore';
import SysStatusProcess from '../subPages/SysStatusProcess';
import SysStatusPacket from '../subPages/SysStatusPacket';

Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/status',
  },
  {
    path: '/status',
    name: 'status',
    component: SysStatus,
    children: [{
      path: '',
      redirect: 'cpu',
    },
    {
      path: 'cpu',
      name: 'cpu',
      component: SysStatusCPU,
    },
    {
      path: 'db',
      name: 'db',
      component: SysStatusDB,
    },
    {
      path: 'mem',
      name: 'mem',
      component: SysStatusMem,
    },
    {
      path: 'net',
      name: 'net',
      component: SysStatusNet,
    },
    {
      path: 'store',
      name: 'store',
      component: SysStatusStore,
    },
    {
      path: 'process',
      name: 'process',
      component: SysStatusProcess,
    },
    {
      path: 'packet',
      name: 'packet',
      component: SysStatusPacket,
    },
    ],
  },
  {
    path: '/alert',
    name: 'alert',
    component: AlertSetting,
      // meta: { requiresAuth: true },
      // beforeEnter: (to, from, next) => {
      //   if (['超级管理员', '运维管理员'].includes(session$.rolename)) {
      //     next();
      //   }
      // },
  },
  {
    path: '/storage',
    name: 'storage',
    component: StorageSetting,
  },
    // {
    //   path: '/users',
    //   component: UserManagement,
    // },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/log',
    name: 'log',
    component: Log,
  },
  ],
});

// router.beforeEach((to, from, next) => {
//   const path = to.path.split('/')[1];
//   if (['alert', 'storage'].indexOf(path) < 0 || session$.role !== 'opsOperate') {
//     next();
//   }
// });

export default router;
