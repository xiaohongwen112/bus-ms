import Vue from 'vue';
import 'babel-polyfill';
import App from './App';
import router from './router';
import store from './store';

import {
  bmsAuth,
  syncSession$,
} from '../../helpers/auth';
import GlobalAlert from '../../components/common/CmAlert/CmAlert';

Vue.config.productionTip = false;

Vue.mixin(bmsAuth);

syncSession$().then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
      App,
    },
    mounted() {
      const k = new Vue({
        name: 'global-alert',
        render(h) {
          return h(GlobalAlert, {});
        },
      });

      const component = k.$mount();
      document.body.appendChild(component.$el);
    },
  });
});
