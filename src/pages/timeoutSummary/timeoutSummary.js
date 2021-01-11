import Vue from 'vue';
import App from './App';
import router from './router';
// import store from './store/';
// import { bmsAuth, syncSession$ } from '../../helpers/auth';

// Vue.config.productionTip = false;

// Vue.mixin(bmsAuth);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  template: '<App/>',
  components: { App },
});
